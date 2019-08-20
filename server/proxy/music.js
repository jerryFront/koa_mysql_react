const {httpRequest}=require('../utils/fetch')
const {request,response,reply}=require('../utils/response')

const get=httpRequest('http://47.105.150.105/m-api','get',0)


/**http://localhost:4000/music-api/playlist/hot */

const getResult=async (req)=>{

    console.log(req)

//    let query=request(req)

//    get()

}

module.exports={
    getResult,
}

