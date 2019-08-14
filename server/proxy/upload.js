const rep=require('../utils/response')
const fs=require('fs')
const path=require('path')
const User=require('../model/user')
const {randomName}=require('../utils/common')
const {checkDirExists,writeFile}=require('../utils/fs')


/**只支持post */
const fileUpload=async (req,next)=>{

    const query=rep.request(req)

    const res=User.validate(query,'image')

    if(!res||!res.result){
      req.response.body=rep.response(null,'0601',res.msg)
      return
    }

    try{
        let ext=null
        const base64Data=query.image.replace(/^data:image\/(\w+);base64,/,function(match,key){
            ext=key //用来记录存储文件后缀名
            return ""
        })
        const dataBuffer=new Buffer(base64Data,'base64')
        
        if(ext) ext='.'+ext
       
        /**文件名 以时间戳+原文件名命名 */
        const newFileName=new Date().getTime()+'_'+randomName(8)+ext
        const now=new Date()
        const date=`${now.getFullYear()}${now.getMonth()>9?now.getMonth():'0'+now.getMonth()}${now.getDate()}`

        const targetPath=path.join(__dirname,`../assets/${date}`)

        /**
         * 先检查目录是否存在 isDirectory
         * 不存在则创建目录,直接写文件存在权限问题
         *  */
        await checkDirExists(targetPath)
        
        //写入文件
        const res=await writeFile(`${targetPath}/${newFileName}`,dataBuffer)

        if(!res.result) rep.reply(req,null,'0600',res.msg)
        else{
            const re={
                url:`http://${req.headers.host }/${date}/${newFileName}`
            }    
            rep.reply(req,re,'0200')
        } 


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