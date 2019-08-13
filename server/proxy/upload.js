const rep=require('../utils/response')
const fs=require('fs')
const path=require('path')


/**只支持post */
const fileUpload=async (req,next)=>{

    const file=req.request.files.file

    const ext=(file&&file.name)?file.name.split('.')[1]:null

    const reg=new RegExp(/\(gif|jpg|jpeg|JPEG|JPG|PNG|png)$/)

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