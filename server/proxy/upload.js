const rep=require('../utils/response')
const fs=require('fs')
const Buffer=require('buffer')
const path=require('path')
const User=require('../model/user')


/**只支持post */
const fileUpload=async (req,next)=>{

    const query=rep.request(req)

    const res=User.validate(query,'image')

    if(!res||!res.result){
      req.response.body=rep.response(null,'0601',res.msg)
      return
    }

    try{
        
        const base64Data=query.image.replace(/^data:image\/\w+;base64,/, "")
        const dataBuffer=new Buffer(base64Data,'base64')  

        /**文件名 以时间戳+原文件名命名 */
        const newFileName=new Date().getTime()+'_'+file.name
        const date=new Date().getDate()

        const targetPath=path.join(__dirname,'./server/assets/')+`${date}/${newFileName}`
        
        //写入文件
        fs.writeFile(targetPath,dataBuffer,function(err,data){
           if(!err) rep.reply(req,{
                url:'http://' + ctx.headers.host + date + newFileName
            },'0200')
            console.log(data)
        })

    }catch(e){
        rep.reply(req,null,'0600',e.toString())
        return
    }

}


const fileUpload1=async (req,next)=>{

    const query=rep.request(req)

    const file=query.file

    const ext=(file&&file.name)?file.name.split('.')[1]:null

    var reg=/(gif|jpg|jpeg|JPEG|JPG|PNG|png)$/

    if(!ext||!reg.test(ext)){
        rep.reply(req,null,'0620')
        return 
    }

    try{
        /**创建可读流 */
        const reader=fs.createReadStream(file.path)

        /**文件名 以时间戳+原文件名命名 */
        const newFileName=new Date().getTime()+'_'+file.name
        const date=new Date().getDate()

        const targetPath=path.join(__dirname,'./server/assets/')+`${date}/${newFileName}`
        
        /**创建可写流 */
        const upStream=fs.createWriteStream(targetPath)
        //可读流通过管道写入可写流
        reader.pipe(upStream)

        rep.reply(req,{
            url:'http://' + ctx.headers.host + date + newFileName
        },'0200')

    }catch(e){
        rep.reply(req,null,'0600',e.toString())
        return
    }

}

module.exports={
    fileUpload,
}