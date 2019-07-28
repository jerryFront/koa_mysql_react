const Sequelize=require('sequelize')

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
    return connect.define(name,attrs,{
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