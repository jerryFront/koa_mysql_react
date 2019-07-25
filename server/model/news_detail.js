const defineModel=require('../config/db').defineModel
const seq=require('sequelize')
const db=require('../config/db').db


const NewsDetail=defineModel('Cure_news_detail',{
    uid:{
        type:seq.UUID,
        defaultValue:seq.UUIDV1,
        unique:'uq_t_news_detail', //建立索引
    },
    content:seq.TEXT,
    create_time:seq.DATE,
})

NewsDetail.sync()

module.exports=NewsDetail


