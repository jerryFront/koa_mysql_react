/**
 * 处理文件相关Promise化
 * 
 * 
 * 判断路径是否存在
 * 创建路径
 * 
 */

const fs=require('fs')
const path=require('path')

/**读取路径信息 */
const getStat=path=>{
   
    return new Promise((resovle,reject)=>{
        fs.stat(path,(err,stats)=>{
            if(err) resovle(false)
            else resovle(stats)
        })
    })

}
 

/**
 * 创建路径(默认同步)
 * 多传入type，则为异步
 *  */
const mkdir=(dir,type)=>{

   if(!type){
       fs.mkdirSync(dir)
       return true
   }else return new Promise((resolve,reject)=>{
       fs.mkdir(dir,err=>{
           if(err) resolve(false)
           else resolve(true)
       })
   }) 

}


/**
 * 检查路径是否存在，非递归方法，更直接
 */
const checkDirExists=dir=>{

    const paths=dir.split('/')
    let _path=''
    for(let i=1;i<paths.length;i++){ //根目录需要过滤掉，下标从1开始
        if(paths[i]){
            _path+=`/${paths[i]}`
            if(!fs.existsSync(_path)){
                mkdir(_path)
            }
        }
    }

}


/**
 * 判断路径是否存在，不存在则创建
 */
const dirExists=async dir=>{
    
    const isExists=await getStat(dir)

    /**该路径存在且不是文件，则返回true*/
    if(isExists&&isExists.isDirectory()){
        return true
    }else if(isExists) //路径存在且是文件
        return false

    /**
     * 如果该路径不存在，需要递归拿到上级路径，从最上存在的一级开始递归向下创建目录
     *  */  

    let tempDir=path.parse(dir).dir
    /**递归判断 */
    let status=await dirExists(tempDir)
    
    let mkdirStatus
    if(status){
        mkdirStatus=await mkdir(dir)
    }
    return mkdirStatus

} 


/**写入文件 */
const writeFile=async (fullPathName,buffer)=>{

    return new Promise((resolve,reject)=>{
        fs.writeFile(fullPathName,buffer,function(err,data){
            if(err){
                resolve({
                    result:false,
                    msg:err.toString()
                })
            }else{
                resolve({
                    result:true,
                    data, //data为undefined
                })
            }
        })
    })

}



module.exports={
    getStat,
    mkdir,
    dirExists,
    writeFile,
    checkDirExists,
}