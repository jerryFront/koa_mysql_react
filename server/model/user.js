const defineModel=require('../config/db').defineModel
const seq=require('sequelize')

const User=defineModel('Users',{
    username:{
        type:seq.STRING(16),
        unique:'uq_t_user' 
    },    
    name:{
        type:seq.STRING(50),
        allowNull:true,
    },    
    password:{
        type:seq.STRING(50), //密文
        allowNull:false,
    },    
    mobile:{
        type:seq.STRING(11),
        unique:'uq_t_user'
    },
    email:seq.STRING(30),
    sex:{
        type:seq.INTEGER(1),
        defaultValue:0,
    },
    headImg:{
        type:seq.STRING(50),
        allowNull:true,
    },    
    id:{
       type:seq.INTEGER(10),
       primaryKey:true,
       autoIncrement:true, //自动递增
    }
})

//创建对应表，如已存在则跳过
User.sync()




module.exports=User