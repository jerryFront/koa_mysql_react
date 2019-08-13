import React,{useState,useLayoutEffect,useCallback} from 'react'
import {Upload,Icon,message} from 'antd'
import http from '@utils/fetch'
import {setStorage,getStorage} from '@utils/storage'

import styles from './index.less'


const user_id=getStorage('user_info')?getStorage('user_info').id:null

const getBase64=(img,cb)=>{
    const reader=new FileReader()
    reader.addEventListener('load',()=>cb(reader.result))
    reader.readAsDataURL(img)
}

const beforeUpload=file=>{
    const isJpgOrPng=file.type==='image/jpeg'||file.type==='image/png'
    if(!isJpgOrPng){
        message.error('只能选择jpg或png图片类型')
        return
    }
    const isLess2M=file.size/1024/1024<2
    if(!isLess2M){
        message.error('图片只能选择2M以下的')
        return
    }
    return true
}

export default (props)=>{

    const [isLoading,res,error,setParams]=http.get('user/info',user_id?{id:user_id}:null)

    const [loading,setLoading]=useState(false)
    const [imageUrl,setImageUrl]=useState(res?res.headImg:null)

    const handleChange=info=>{
        console.log(info)
       if(info.status==='uploading'){
           setLoading(true)
           return
       }
       if(info.status==='done'){
           getBase64(info.file.originFileObj,imageUrl=>{
               setImageUrl(imageUrl)
               setLoading(false)
           })
       }

    }


    return (
        <Upload name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="http://localhost:4000/upload/image"
        beforeUpload={beforeUpload}
        onChange={handleChange}>

        {imageUrl?<img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> :(
            <div>
                <Icon type={loading?'loading':'plus'}></Icon>
                <div className="ant-upload-text">Upload</div>
            </div>
        )}

        </Upload>
    )


}
