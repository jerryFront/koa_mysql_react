/**
 * 爬虫数据
 * 
 * superagent http模块
 * cheerio  抓取页面样式结构下的内容
 * 
 */


const uuid=require('../utils/common').uuid
const query=require('../utils/common').query
const fork=require('../utils/common').fork

const Models=require('../model')




var id=1
const fork1=fork('http://cntuku.com/huaxu/page/${id}')
const cb=async $=>{
    await $('#main article').each(async function(){
 
         //将其内容一并爬出来存入content内容中
         var href=$(this).find('.load a').attr('href')
 
         
         var newsTitle = $(this).find('header h2 a').text();
         var content = $(this).find('.archive-content').text();
         var newsTime=new Date();
         var newsImg= $(this).find('.load a img').attr('src');
         var uid=uuid()
 
         var news=await Models.News.create({
             title:newsTitle,
             create_time:new Date(),
             thumb_img:newsImg,
             thumb_content:content,
             uid,
         })

         if(news){
             
             fork(href)(async $1=>{
                let cont=$1('.single-content')
                cont.find('.tg-pc').remove()
                cont=cont.html()
 
                await Models.News_detail.create({
                    content:cont,
                    create_time:new Date(),
                    uid,
                })
             }) 
 
         }
 
     })
 
     fork1(cb,++id)
 
 }

fork1(cb,id)  




