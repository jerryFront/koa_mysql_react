/**
 * 专用于proxy向第三方发起代理请求转发使用
 * superagent
 * koa-proxy
 */
const superagent=require('superagent')


/**根据type返回不同的header，实际情况每个网站远程请求都不同 */
const getHeader=type=>{

   /**设置header */ 
   const header={
    'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Encoding':'gzip, deflate, sdch',
    'Accept-Language':'zh-CN,zh;q=0.8',
    'Cache-Control':'max-age=0',
    'Connection':'keep-alive',
    //'Cookie:':'', //此需要每次目标网站返回来更新，开始不设置
    // 'Host':url,
    'User-Agent':'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.221 Safari/537.36 SE 2.X MetaSr 1.0'
   }
   
    switch(type){

       case 1:
         /**更改对应的某些项 */
        
       break;
       default:

       break;

    }

    return header

}


const httpRequest=(host,method='get',headrType=0)=>{
     
  

   const headers=getHeader()

   const http=(url,params)=>{
       const su=(method&&method=='post')?superagent.post(url,params):superagent.get(url,params)
       Object.keys(headers).forEach(i=>{
           su.set(i,headers[i])
       })
       return su
   }

   return async(url,params)=>{

      let res=await http(host+url,params)

      if(res&&res.status===200){
        /**每次重新更新cookie，如果response返回了cookie的话 */
        headers['Cookie']=(res.headers&&res.headers.Cookie)?res.headers.Cookie:''
        try {
           res=JSON.parse(res.text)
        }catch(e){
           console.error(e.toString())
        }
      }else{ //返回失败
        console.error('拉取数据失败:'+res.status)
        res={
           code:'0601',
        }
      }

      return res

   }



}



module.exports={

   httpRequest,

}