const Sequelize=require('sequelize')
const redis=require('../utils/redis')



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
    for(let key in attributes){
        let value=attributes[key]
        if(typeof value==='object'&&value['type']){ //此时value即为type
            value.allowNull=value.allowNull||false
            attrs[key]=value
        }else{
            attrs[key]={
                type:value,
                allowNull:false,
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

        const searchRedis=async key=>{
           let res=await redis.get(key)
           if(res) return res 
           //如redis匹配不到，则查询数据库
           res = await findInDB() 
           return res
        }

        const findInDB=async ()=>{
          let res = await Model.findAll(params)
          return res
        }

        let _key=null
        //匹配是否需要查询redis命中,string主键 or params只有一个类主键key的
        if(typeof params==='string'){
           _key=`${Model}:${params}`
           return  await searchRedis(_key)
        } 
        else if(Object.getOwnPropertyNames(params).length==1){
            //判断其key是否是unique 主键?
            if(Object.keys(params).every(it=>{
                _key=params[it]
                return !!(attrs[it].unique)
            })){  //符合规则
              _key=`${Model}:${_key}`
              return await searchRedis(_key)
            }else return await findInDB()
        }

        else return await findInDB()

    }

    //创建时，可以多传入自定义过期时间
    Model.created=async (params,ex)=>{
        if(typeof params!=='object'){
            console.error('Create query must be Object')
            return
        }
        //寻找主键，primaryKey:true或第一个unique存在的列
        let res=await Model.create(params)
        if(res){
            //更新对应缓存
            let _key=null,_val=null
            for(let i in attrs){
               if(attrs[i].primaryKey){
                   _key=i;
                   _val=res[i]                  
                   break;
               }
               if(attrs[i].unique){
                    _key=i;
                    _val=res[i] 
               }
            }
            _key=`${Model}:${_key}`
            ex?redis.mqSet(_key,_val,ex):redis.mqSet(_key,_val)       
        }

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