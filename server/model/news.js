const defineModel=require('../config/db').defineModel
const seq=require('sequelize')


const News=defineModel('Cure_news',{
    title:seq.STRING(500),
    uid:{
        type:seq.UUID,
        defaultValue:seq.UUIDV1,
        unique:'uq_t_news', //建立索引
    },
    thumb_img:seq.STRING(200),
    thumb_content:seq.STRING(2000),
    create_time:seq.DATE,
})

News.sync()

module.exports=News