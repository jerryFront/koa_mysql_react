/**
 * 
 */

 const errors=require('./errorCode')

 const request=ctx=>{
     if(!ctx){
         console.error('缺少参数')
         return
     }

     if(ctx.request.query&&Object.getOwnPropertyNames(ctx.request.query).length) 
     return ctx.request.query
     else return ctx.request.body

 }
 
 const response=(data={},code='0200',msg)=>{
     return {
         data,
         code:errors[code].code,
         msg:msg?msg:errors[code].msg //如果有特殊自定义msg，则优先有自定义msg
     }
 }

 module.exports={
     request,
     response,
 }