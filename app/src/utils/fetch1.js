import axios from 'axios'
import React,{useState,useEffect,useCallback,useRef} from 'react'
import {message,Spin} from 'antd'
import {timeout,rootPath} from '@configs/const'
import {getStorage,removeStorage} from '@utils/storage'


const md5=require('md5')
const qs=require('qs')





const blackList=[

 
]

/*
防止重复提交
 利用缓存机制进行处理,当同一个页面如果在2秒钟被要求再次请求，则拒绝
 缓存机制采取 key:`$$http_request_{url}+{env}+{AppVersion}`,value:{data,time:(new Date().getTime()/1000)}
 然后2秒后删除该缓存
*/
const beforeRequest=(list,url,data)=>{
    
    return (url,data)=>{
        
        return true

    }
}


const beforeHttp=beforeRequest(blackList)


const baseConfig={
    url:'/',
    method:'get',
    baseUrl:rootPath,
    headers:{
        'Content-Type':'application/x-www-form-urlencoded',
    },
    timeout,
    widthCredentials:true,
    responseType: 'json',
    maxContentLength: 50000,
    validateStatus(status){
      return status>=200 && status<300
    }
}




export default class http{




  static guid(){
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''), uuid = new Array(36), rnd=0, r;
    for (var i = 0; i < 36; i++) {
        if (i==8 || i==13 ||  i==18 || i==23) {
            uuid[i] = '-';
        } else if (i==14) {
            uuid[i] = '4';
        } else {
            if (rnd <= 0x02) rnd = 0x2000000 + (Math.random()*0x1000000)|0;
            r = rnd & 0xf;
            rnd = rnd >> 4;
            uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
    }
    return uuid.join('');
  }

  static key='E41F6E5DBA6W'

  static createHeader(){

         //鉴权签名算法
        //SeqNo：唯一请求序列号，客户端识别码(0W代表web端，0I代表ios端，0A代表Android端)+UUID
        let timestamp=parseInt(new Date().getTime()/1000), seqno='0W'+this.guid(),SignTemp,sign
        SignTemp=`seqno=${seqno}&timestamp=${timestamp}&key=${this.key}`
        sign=md5(SignTemp)

        return {
            timestamp,
            seqno,
            sign
        }
  }


  //采用hooks处理方式
  static request(args){

    const [url,data]=args 



    //需要监听data变化的时候，必须设置其为hook相关(采用ref来对比参数变化)

    const currentData=useRef()

    const [isLoading,setIsLoading]=useState(false)
    const [res,setRes]=useState(null)
    const [error,setError]=useState(null)

    const isPost=baseConfig.method==='post'?true:false


    const fetch=useCallback(async ()=>{

      /**
       * 如果没有带任何参数即undefined时候，不请求数据
       * 因为hooks只能在主function中执行，所以必须init时执行一次(实际不发起请求)
       *  */
      if(!data||!beforeHttp(url,data)) return
 
      const userheader={token:getStorage('user_info')?getStorage('user_info').token:''}
      baseConfig.headers={...baseConfig.headers,...this.createHeader(),...userheader}
      baseConfig.url=`${rootPath}${url}`
      if(isPost){  //因为post和get是分两个不同的字段传递参数的，必须清除不必要的上次参数污染
        baseConfig.data=qs.stringify(data)
        baseConfig.params=null
      }
      else{
        baseConfig.params=data
        baseConfig.data=null
      }


      if(isLoading) return
      setIsLoading(true)

      try{

        let res=await axios(baseConfig).then(res=>res.data)

        setIsLoading(false)
 
        /**
         * 判断通用错误
         * 1.无返回
         * 2.鉴权失败
         * 3.token错误
         */

        if(!res||typeof res!=='object'||!Object.keys(res).length){
          message.error('未获取到数据信息，请稍后再试',10)
          return
        }
        if(res.code&&res.code===801){
          message.error('请求包含的鉴权信息不合法，请重试',6)
          return
        } 
        if(res.code&&res.code===802){ //跳转登录
          message.error('Token令牌已过期，请重新登录',4)
          window.location.href="#/login"
          removeStorage('user_info')
          return
        }

        if(res.code&&res.code!==200){
          message.error(res.msg,6)
          return
        }
        
        setRes(res.data)

      }catch(e){
        setIsLoading(false)
        setError(e)   
      }


    },[url,data])

        console.log(data)
     
    useEffect(()=>{

      currentData.current=data
 
      /**
       * 如果请求有更新，则放弃之前的
       * 如果需要在参数变化后重新请求，如果参数频繁更新，会出现竞态（旧的请求因为慢，晚于后发的请求 resolve）的问题
       *  */
      if(currentData.current!==data) return
 
      fetch()
 
     },[currentData])
 


    /**利用renderProps来返回通用化的Component children 卡槽式 */

    const DataBounday=useCallback(renderChildren=>{

      if(error) return <div>error</div>
      else if(isLoading) return <Spin tip="Loading..."  size="large" />
      else if(res) return renderChildren({res})
      else return null

    },[isLoading,res,error])

     return DataBounday

  }

  static get(...args){
    baseConfig.method='get'
    return this.request(args)
  }

  static post(...args){
    baseConfig.method='post'
    return this.request(args)
  } 




}



