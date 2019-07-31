/**
 * 针对token，鉴权问题的统一拦截处理函数
 * 
 * 可以理解它为代理层，后续可以动态层扩展
 * 
 */

const rep=require('../utils/response')
const redis=require('./redis').client 
const md5=require('md5')



const compose=(...args)=>{
    let init=args.shift()
    return (...arg)=>{
        return args.reduce((a,b)=>{
            return a.then(res=>b(res))
        },Promise.resolve(init.apply(null,arg)))
    }
}

  /**
   * 不需要token验证的白名单接口
   * 
   */
 const whiteList=[
     '/user/login',

 ]

 /**不同端的私钥 */
 const keys={
     '0W':'E41F6E5DBA6W',
     '0A':'E41F6E5DBA6A',
     '0I':'E41F6E5DBA6I',
     '0X':'E41F6E5DBA6X',
 }


 /**
  * 
  * @param {*} ctx 为request
  *
  * 验证鉴权机制 
  *
  */
 function checkAuth(ctx){

    if(!ctx||typeof ctx==='string') return ctx

     let header=ctx.request.header


     /**
      * header里验证 
      * timestamp
      * seqno:'0X'+uuid()
      * sign 为md5('seqno='+seqno+'&timestamp='+timestamp+'&key='+key)
      */

      if(!header||!header.timestamp||typeof header.timestamp!=='string'||!header.seqno||typeof header.seqno!=='string'||!header.sign||typeof header.sign!=='string'){

         return '0801'  //不合法返回特定的错误码

      }

      const key_prefix=header.seqno.substr(0,2),
      key=key_prefix?keys[key_prefix]:'',
      timestamp=parseInt(new Date().getTime()/1000)


      if(Math.abs(timestamp-header.timestamp)>120||!key){ //鉴权时间戳要求2分钟之内请求才有效
        
         return '0801'

      }

      const sign=md5(`seqno=${header.seqno}&timestamp=${timestamp}&key=${key}`)


      if(header.sign!==sign) return '0801'

    
      return ctx


 }

 /**
  * 
  * @param {*} ctx request
  * 
  * 验证token是否有效
  */
 async function checkToken(ctx){


    if(!ctx||typeof ctx==='string'||!ctx.url) return ctx



    /**如果在白名单之列，则不验证token */
    if(whiteList.some(it=>it.indexOf(ctx.url)>-1)) return true

    const header =ctx.request.header

    if(!header||!header.token||typeof header.token!=='string'){

        return '0802'
    }


    /**
     * Token 存入redis ，直接将此Token作为key存入，不用根据Token获取user_id
     * Token在设置的时候会有一个redis的过期时间
     * */


    const res=await redis.get(header.token)

    if(res){
       return true
    }else return '0802' 


 
    
 
 


 }


 //组合compose

 const checkCompose=compose(checkAuth,checkToken)

  
module.exports={

    compose,
    checkAuth,
    checkToken,
    checkCompose, 

}