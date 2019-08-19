import React,{useState,useLayoutEffect,useCallback,useRef} from 'react'
import {Upload,Icon,message,Layout,Divider,Col,Input,Card,Radio,Button} from 'antd'
import http from '@utils/fetch'
import {setStorage,getStorage} from '@utils/storage'
import {rootPath} from '@configs/const'

import styles from './index.less'
import { changeConfirmLocale } from 'antd/lib/modal/locale';


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

const {Content}=Layout

export default ()=>{

    const [loading,setLoading]=useState(false)

    const fetchUser=useCallback(()=>http.get('user/info',user_id?{id:user_id}:null),[])
    const [DataBound,,res]=fetchUser()

    const uploadImage=useCallback(()=>http.post('upload/image',null),[]) 
    const [,setParams,res1]=uploadImage()


    const updateUser=useCallback(()=>http.post('user/update',null),[])
    const [,setParams2,res2,isLoading2]=updateUser()


    //用来记录最新数据，不一定是更新成功的，因为update返回的只有成功，避免再请求一遍get，采用ref记录每次最新的res
    const ref=useRef(null) 


    useLayoutEffect(()=>{
        if(res1&&res1.url) res.headImg=res1.url.replace(`${rootPath}`,"")   
        setLoading(false)
    },[res1])

    useLayoutEffect(()=>{
        if(res2){
            message.success('数据更新成功')
            /**更新之后同时也更新缓存,需合并处理 */
            const info=getStorage('user_info')
            setStorage('user_info')(info?{...info,...ref.current}:ref.current)
        }  
    },[res2])


    const handleChange=info=>{
           if(!info||!info.file) return
           if(!beforeUpload(info.file)||loading) return //避免多次重复请求
           setLoading(true)
           getBase64(info.file.originFileObj,imageUrl=>{
            setParams({image:imageUrl}) //触发上传
           })
    }

    const inputChange=(e,type)=>{
       if(!type) return
       res[type]=e.target.value
    }



    const update=()=>{
      /**
       *每次render之后，如果res值为空(但实际每次都会有数据)，则默认理解为没有更改就不用提交请求，有更改再提交
       *实际有数据是每次res都会从链表的尾部读取数据作为其最新数据
       *    */
        if(res){ 
            ref.current=res
            setParams2({...ref.current})  //注意useState传入的值需要每次浅拷贝，不然一直是对应的变量的引用，不会认为其有变化
        }
    }


    return (
        <section className={styles.mcontainer}>

        <Layout>

          <Content>

            <Col lg={24} xl={{span:16,offset:4}}>

              {DataBound(({res})=>
               res&&(
                   <Card title="个人信息" bordered={false}>
                       
                       <Divider orientation="left">用户名</Divider>
                       <nav>{res.username}</nav>

                       <Divider orientation="left">昵称</Divider>
                       <nav><Input type="text" maxLength={12} onChange={e=>inputChange(e,'name')} defaultValue={res.name}></Input></nav>

                       <Divider orientation="left">手机号</Divider>
                       <nav><Input type="text" maxLength={11} onChange={e=>inputChange(e,'mobile')}  defaultValue={res.mobile}></Input></nav>

                       <Divider orientation="left">邮箱</Divider>
                       <nav><Input type="text" maxLength={20} onChange={e=>inputChange(e,'email')} defaultValue={res.email}></Input></nav>

                       <Divider orientation="left">性别</Divider>
                       <nav>
                           <Radio.Group defaultValue={res.sex} buttonStyle="solid" onChange={e=>inputChange(e,'sex')}>
                                <Radio.Button value={0}>男生</Radio.Button>
                                <Radio.Button value={1}>女生</Radio.Button>
                           </Radio.Group>
                       </nav>
                    
                       <Divider orientation="left">头像</Divider>
                       <nav>
                       <Upload name="avatar"
                        listType="picture-card"
                        className="avatar-uploader"
                        showUploadList={false}
                        onChange={handleChange}>
                        {res.headImg?<img src={`${rootPath}${res.headImg}`} alt="avatar" style={{ width: '100%' }} /> :(
                            <label>
                                <Icon type={loading?'loading':'plus'}></Icon>
                                <label className="ant-upload-text">上传</label>
                            </label>
                        )}
                        </Upload>
                       </nav>

                       <nav className="flex-center">
                       <Button type="primary" loading={isLoading2} onClick={()=>update()}>提交修改</Button>
                       </nav>
                       

                    </Card>
               ))
              }

            </Col>

          </Content>

        </Layout>

        </section>

    )


}
