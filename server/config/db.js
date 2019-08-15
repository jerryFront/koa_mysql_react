const Sequelize=require('sequelize')
const redis=require('../utils/redis').client



/**
 * 将sequelize的类型与es6一一对应
 * sequelize DateType类型为sequelize的对应OBJ，无法获取其数据类型，只好采取toString
 */
const types={
   'VARCHAR':'string',
   'CHAR':'string',
   'DATETIME':'Date',
   'TEXT':'string',
   'INT':'number',
   'BIGINT':'number',
   'DOUBLE':'number',
   'BOOLEAN':'boolean',
   'Array':'object' 
}





/**
 * 
 * @param {string} name  表名 
 * @param {object} attributes 数据字段集合  
 */
function defineModel(name,attributes){
    var attrs={}
    for(let key in attributes){ //默认均改为允许为空
        let value=attributes[key]
        if(typeof value==='object'&&value['type']){ //此时value即为type
            value.allowNull=value.allowNull||true
            attrs[key]=value
        }else{
            attrs[key]={
                type:value,
                allowNull:true,
            }
        }
    }

    //附加公共字段
    attrs.createAt={
        type:Sequelize.BIGINT,
        allowNull:false
    }
    attrs.updateAt={
        type:Sequelize.BIGINT,
        allowNull:false,
    }
    //行锁
    attrs.version={
        type:Sequelize.BIGINT,
        allowNull:false
    }
    //状态，假删除使用 0表示有效，1表示无效，2表示已删除，默认为0
    attrs.status={
        type:Sequelize.INTEGER,
        defaultValue:0,
        allowNull:false
    }

    //模型返回
    const Model=connect.define(name,attrs,{
        tableName:name,
        timestamps:false,
        hooks:{
            beforeValidate(obj){
                let now=Date.now()
                if(obj.isNewRecord){
                    obj.createAt=now
                    obj.updateAt=now
                    obj.version=0
                }else{
                    obj.updateAt=now
                    ++obj.version
                }
            }
        },
    })

    /**
     * params为一个object或对应主键的id查询，去匹配params是否含有
     * 对应Model attrs的主键(或自定义主键) 即attr的unique是否存在，一般unique是设置在主键列上的
     * 
     */
    Model.find=async params=>{
        if(typeof params!=='string'&&typeof params!=='object'){
            console.error('Find query must be Object or String')
            return
        }

        const findInRedis=async key=>{
           let res=await redis.gets(key)
           
           if(res) return res 
           //如redis匹配不到，则查询数据库
           res = await findInDB(key) 
           return res
        }

               /**根据主键进行查询 */
        const findByPk=async pk=>{
           if(!pk||typeof pk==='object'){
               console.error('findByPk need param string or number，not object or undefined')
               return
           }
           const res = await Model.findByPk(params)  //没有findById此方法，百度坑
           /**并更新缓存 */
           updateRedis(res)

           return res
        } 

        /**
         * 如有key参数，表明其应该被缓存，但击穿，则查询到后，主动更新缓存
         * 未带key，则表明无需缓存，每次从DB更新
         *  */
        const findInDB=async (key)=>{

         let res=null  
            
          //合并一下params.attributes中的exclude，将通用字段都隐去
          if(typeof params==='object'){
            const excludes=['version','status','updateAt','createAt']
            if(params.attributes){
                //需要合并去重
                params.attributes.exclude=[...new Set(params.attributes.exclude.concat(excludes))]
            }else params.attributes={exclude:excludes}

            /**查询如果击穿缓存且是主键形式的查询，则需要更新缓存 */

            res = await Model.findAll(params)

            if(key) updateRedis(res,key)
            

          }else  //只有主键
            res=await findByPk(params)

            /**为了与缓存保持一致，这里统一处理，去除数组化 */
            return Array.isArray(res)?res[0].dataValues:res.dataValues
        }

        /**优先匹配是否有符合缓存的规则 */
        const _key=checkFitRedis(params)

        if(_key) return await findInRedis(_key)

        else  return await findInDB()

    }

    
    //用于列表请求分页相关,不走redis(列表数据更新很快，走redis无意义)
    Model.findAllCount=async params=>{

        if(typeof params!=='object'){
            console.error('Find query must be Object or String')
            return
        }

        if(typeof params==='object'){
            const excludes=['version','status','updateAt','createAt']
            if(params.attributes){
                //需要合并去重
                params.attributes.exclude=[...new Set(params.attributes.exclude.concat(excludes))]
            }else params.attributes={exclude:excludes}
            params.attributes.distinct=true //除去因为include等造成的重复
            res = await Model.findAndCountAll(params) //不叫findAllAndCount
            return res

          }



    }
    
    /**
     * 更新redis,在update和create以及查询击穿findByPk的时候都需要处理
     * 参数key如有则直接mqSet，无则自行找出Pk，ex为自定义过期时间number
     *  */
    const updateRedis=(res,key,ex)=>{

        /**sequelize查询返回值均为 [object SequelizeInstance:xxx] 对象，需要处理成json */
        if(!res) return

        /**为了与缓存保持一致，这里统一处理，去除数组化 */
        res=Array.isArray(res)?res[0].dataValues:res.dataValues
  
        //兼容key是否存在,因为key必定是string
        if(key&&typeof key==='number'){
            ex=key
            key=null
        }
        if(key){ //如果key存在，则直接更新并返回
            ex?redis.mqSet(key,res,ex):redis.mqSet(key,res)   
            return
        }else{ //key不存在，则查找PK或unique(可能不用PK查询或无PK)
            //查找PK或unique过程，匹配规则，PK>unique
            let _key=null //缓存的value一定都是res
            for(let i in attrs){
               if(attrs[i].primaryKey){
                   _key=i;                
                   break;
               }
               if(attrs[i].unique){
                    _key=i;
               }
            }
            _key=`${name}:${_key}` 
            ex?redis.mqSet(_key,res,ex):redis.mqSet(_key,res)       
        }
        
    }


     /**
     * 判断请求是否符合缓存策略
     * 实际情况下，params基本都是object
     * 一定有where和attribute等属性,所以删除这些属性之后，判断是否仅有主键
     * 若匹配到则返回 key(对应Model+Pk的值)，无匹配则返回null
     */
    const checkFitRedis=params=>{

        let _key=null
        
        //匹配是否需要查询redis命中,string主键 or params只有一个类主键key的
        if(typeof params==='string'){
            _key=`${name}:${params}`
            return key
        } 
        else{ //为object,否则validate步骤验证不通过

            /**需浅拷贝params，用于判断，且不更改原params */
            const _params={...params}   
            delete _params.where 
            delete _params.attributes

             //实际场景下，一定有where和attribute等属性,所以删除这些属性之后，判断是否仅有主键
            if(Object.keys(_params).length==1){ 
                //判断其key是否是unique 主键?
                if(Object.keys(_params).every(it=>{
                    _key=params[it]
                    return !!(attrs[it].unique||attrs[it].primaryKey) //是主键或者唯一
                })){  //符合规则
                  _key=`${name}:${_key}` //name为define时候的Model名
                }
            }  
            
            return _key

        }


    }


    //创建时，可以多传入自定义过期时间
    Model.created=async (params,ex)=>{
        if(typeof params!=='object'){
            console.error('Create query must be Object')
            return
        }
        //寻找主键，primaryKey:true或第一个unique存在的列
        let res=await Model.create(params)
        
        updateRedis(res,ex)

        return res 

    }

    //update，更新redis
    Model.updated=async (params,ex)=>{
        if(typeof params!=='object'||params.where===undefined){
            console.error('Update query must be Object or query.where is undefined')
            return
        }
        //寻找主键，primaryKey:true或第一个unique存在的列
        /**update两个参数 一个params，一个where语句 */
        let res=await Model.update(params,params)
        
        updateRedis(res,ex)

        return res 
    }



    /**
     * 验证传入参数是否缺少和类型是否正确的通用方法
     * query为get/post接受的提交参数 object
     * keys为对应方法需要验证的参数名集合
     * 
     * return为object  msg：string,result:true
     */
    Model.validate=(query,...keys)=>{

       if(typeof query!=='object') 
       return {
              msg:'接收数据格式错误',
              result:false,
       }

       
       let msg=null //错误语

       for(let i=0,l=keys.length;i<l;i++){

            //如果query没有要检验的字段则直接提示缺少字段
            if(!query[keys[i]]||typeof query[keys[i]]==='undefined'){
                msg=`缺少字段${keys[i]}`
                break;
            }
    
            if(!attrs[keys[i]]){ //取不到对应类型,表明是不在数据库对应字段里的，给予通过
                continue;
            } 
            let str=attrs[keys[i]].type||attrs[keys[i]]

            try{
                str=str.toString() //str类型为sequelize的对应OBJ，无法获取其数据类型，只好采取toString
                //split去掉 ()
                if(str) str=str.split('(')[0]

                if(!types[str]){
                console.error(`类型无法被识别`)
                continue;
                }
                if(typeof query[keys[i]]!==`${types[str]}`){
                    msg=`${keys[i]}字段类型不符`
                    break;
                } 

            }catch(err){
                console.error(err)
            }
    


       }


       if(msg) return{
           msg,
           result:false
       }


       return{
           msg:null,
           result:true
       }
       
         
    }



    return Model

}

const connect=new Sequelize('cure_blog','root','qq123456',{
    host:'localhost',
    port:3306,
    dialect:'mysql',
    pool:{
        max:10,
        min:0,
        acquire:30000,
        idle:10000,
    }
})

connect.authenticate().then(() => {
    console.log('Connection has been established successfully.');
})
.catch(err => {
    console.error('Unable to connect to the database:', err);
});




module.exports={
    defineModel,
    db:connect,
}    