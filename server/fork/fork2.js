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






const cb=async ($,id)=>{
    await $('.posts-loop .category-huaxu').each(async function(){
 
         //将其内容一并爬出来存入content内容中
         var href=$(this).find('.thumbnail-link').attr('href')
 
         
         var newsTitle = $(this).find('.entry-title h2 a').text();
         var content = $(this).find('.entry-summary').text();
         var newsTime=$(this).find('.entry-date').text();
         var newsImg= $(this).find('.thumbnail-wrap img').attr('src');
         var uid=uuid()
 
         var news=await Models.News.create({
             title:newsTitle,
             thumb_time:newsTime,
             thumb_img:newsImg,
             thumb_content:content,
             uid,
         })

         if(news){
             
             fork(href)(async $1=>{
                let cont=$1('.entry-content')
                // cont.find('.tg-pc').remove()
                cont=cont.html()
 
                await Models.News_detail.create({
                    content:cont,
                    create_time:new Date(),
                    uid,
                })
             }) 
 
         }
 
     })
 
    //  fork1(++id)  /**如果有多线程操作，则不需要自动累加 */
 
 }

const fork1=fork('http://cntuku.com/huaxu/page/${id}',cb)

// fork1(1)  

module.exports={
    fork1,
}



