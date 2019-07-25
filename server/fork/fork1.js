/**
 * 爬虫数据
 * 
 * superagent http模块
 * cheerio  抓取页面样式结构下的内容
 * 
 */

const superagent=require('superagent')
const cheerio=require('cheerio')

const uuid=require('../utils/common').uuid
const query=require('../utils/common').query
const fork=require('../utils/common').fork



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
 
         var addSql = "insert into 1905_huaxu(title,create_time,thumb_img,thumb_content,uid) values (?,?,?,?,?)"; 
         var addParmas = [newsTitle, newsTime,newsImg,content,uid];
 
         let re=await query(addSql,addParmas)
 
         if(re&&re.insertId){
             
             fork(href)(async $1=>{
                let cont=$1('.single-content')
                cont.find('.tg-pc').remove()
                cont=cont.html()
 
                addSql="insert into 1905_huaxu_detail(uid,content) values (?,?)"
                addParmas=[uid,cont]
                await query(addSql,addParmas)
             }) 
 
         }
 
     })
 
     fork1(cb,++id)
 
 }

fork1(cb,id)  




