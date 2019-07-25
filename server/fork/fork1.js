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

/**
 * 
 * @param {string} url  //出去id变化的其他不变部分，可用占位符${id}来暂时替代 
 * @param {number} id  //自增规律性id
 * @param {function} callback 拉取数据后自定义回调函数 
 * 
 * 实际中基本只有id总会变化自增
 */
  function fork(url,callback,id){
       
    return async(callback,id)=>{
             let url1=url
            if(id) url1=url1.replace('${id}',id)
            let res=await superagent.get(url1)
            if(res&&res.text&&res.status==200){
                var $=cheerio.load(res.text,{decodeEntities:false}) //所有的dom结构
                await callback&&callback($)
            }else{
                console.error('拉取数据失败')
                console.log(`目前拉取:${id}页`) 
            }
       
    }
   

}

var id=101
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

/**影视资讯相关 */
// const fork1=async item=>{
    
//     let res=await superagent.get(`http://cntuku.com/huaxu/page/${item}`)


    
//     if(res&&res.text&&res.status==200){
//         var $=cheerio.load(res.text,{decodeEntities:false})

//         $('#main article').each(async function(){

//             //将其内容一并爬出来存入content内容中
//             var href=$(this).find('.load a').attr('href')

            
//             var newsTitle = $(this).find('header h2 a').text();
//             var content = $(this).find('.archive-content').text();
//             var newsTime=new Date();
//             var newsImg= $(this).find('.load a img').attr('src');

//             var addSql = "insert into 1905_huaxu(title,create_time,thumb_img,thumb_content,uid) values (?,?,?,?,?)"; 
//             var addParmas = [newsTitle, newsTime,newsImg,content,uuid()];

//             let re=await query(addSql,addParmas,function(err){
//                 if(err){  
//                   console.log("数据库连接错误");  
//                 }
//             })

//             let rr=await superagent.get(href)


//         }); 

//     }else{
//         console.log(`目前拉取:${item}页`)
//     }

    
// }

// fork1(1)


