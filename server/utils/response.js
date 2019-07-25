/**
 * 
 */

 const errors=require('./errorCode')
 
 const response=(data={},code='0200',msg)=>{
     return {
         data,
         code:errors[code].code,
         msg:msg?msg:errors[code].msg //如果有特殊自定义msg，则优先有自定义msg
     }
 }

 module.exports=response