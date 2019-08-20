/**
 * 
 */

 const errors=require('./errorCode')

 const request=ctx=>{
     if(!ctx){
         console.error('缺少参数')
         return
     }

     let query=null

     if(ctx.request.query&&Object.getOwnPropertyNames(ctx.request.query).length) 
     query=ctx.request.query
     else query=ctx.request.body

     /**默认处理好where */

     if(typeof query!=='object'||!Object.keys(query).length) return query

     query.where=Object.keys(query).reduce((prev,cur)=>{
         if(typeof query[cur]!=='undefined') prev[cur]=query[cur]
         return prev
     },{})

    return query

 }
 
 const response=(data={},code='0200',msg)=>{
     return {
         data,
         code:errors[code].code,
         msg:msg?msg:errors[code].msg //如果有特殊自定义msg，则优先有自定义msg
     }
 }

 /**
  * 统一正确或错误返回
  * 优先匹配业务逻辑相关的错误码
  */
 const reply=(req,data,code,msg)=>{
    if(code) req.response.body=response(data,code,msg)  
    else if((typeof data==='object'&&Object.keys(data).length)||(Array.isArray(data))) req.response.body=response(data,'0200')
    else req.response.body=response(data,'0601')
    
 }


 /**
  * 直接格式化返回第三方返回的数据
  * 如果第三方有data,code（为object）则原样返回
  * 否则返回601 
  */
 const threeReply=(req,res)=>{
    
    if(res&&typeof res==='object'&&res.code){
        req.response.body=res
    }else req.response.body=response(null,'0601')

 }


 module.exports={
     request,
     response,
     reply,
     threeReply,
 }