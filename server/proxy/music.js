const {httpRequest}=require('../utils/fetch')
const {request,response,reply,threeReply}=require('../utils/response')

const get=httpRequest('http://47.105.150.105/m-api/','get',0)


/**http://localhost:4000/music-api/playlist/hot */

const getResult=(url)=>{
 
  /**router.use的回调方法必须是个function */
  
   return  async(req)=>{

     let query=request(req)

     const res=await get(url,query)

     return threeReply(req,res)

   }


}

module.exports={
    getResult,
}

