import axios from 'axios'
import React,{useState,useEffect,useCallback,useRef} from 'react'
import {message,Spin} from 'antd'
import {timeout,rootPath,storage_prefix,env} from '@configs/const'
import {getStorage,removeStorage,setStorage} from '@utils/storage'



const md5=require('md5')
const qs=require('qs')




/**白名单，不检验重复提交 */
const whiteList=[

 
]

/*
防止重复提交
 利用缓存机制进行处理,当同一个页面如果在2秒钟被要求再次请求，则拒绝
 缓存机制采取 key:`$$http_request_{url}+{env}+{AppVersion}`,value:{data,time:(new Date().getTime()/1000)}
 然后2秒后删除该缓存
*/
const beforeRequest=(list,url,data)=>{
   
   const checkRepeat=obj=>{
     if(obj){ //如果含有该缓存，则判断时间戳
       const now=new Date().getTime()
       if(obj.time)
       if(Math.abs(obj.time-now)<1000){
         if(obj.data&&toString.call(data)==='[object Object]'&&toString.call(obj.data)==='[object Object]'){
           return JSON.stringify(obj.data)==JSON.stringify(data)
         }else return obj.data==data
       }else return false
     }else return true
   }

    return (url,data)=>{
        if(url&&list.indexOf(url)>0) return true 
        let obj=null,key=`request_${storage_prefix}_${env}_${url}`
        if(getStorage(key)) obj=getStorage(key)
        const result=checkRepeat(obj)
        /**重新更新缓存时间和内容,并设置定时器清除 */
        setStorage(key)({data,time:new Date().getTime()})
        setTimeout(()=>removeStorage(key),2000)
        return result

    }
}

const beforeHttp=beforeRequest(whiteList)


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

const recordRef=(obj)=>{
  const ref=useRef(obj)
  return ref

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
  /**
   * 
   * @param {*} args 
   * 正常接收url,data([object])两个参数,此时统一处理错误返回非200，返回res.data
   * 如传有第三个参数!!type===true,则此时除了处理特殊错误，其他原样返回res 
   * 
   */
  static request(args){

    
    const [url]=args 


    //需要监听data变化的时候，必须设置其为hook相关
    const [data,setData]=useState(args[1])

    const currentData=useRef()
    


    const [isLoading,setIsLoading]=useState(false)
    const [res,setRes]=useState(null)
    const [error,setError]=useState(null)

    /**分别存储dispatch和res */
    const resolve=recordRef(typeof args[2]==='function'?args[2](data):null)


    /**
     * 设置对应的setData钩子，如果手动触发setData表明要强制更新，此时需要重置resolve
     * 已经做了redux脏数据的检测处理,则没必要特殊处理了
     *  */
    // const setData=data=>{
    //   resolve.current=typeof args[2]==='function'?args[2](data):null
    //   setData1(data)
    // }

    const isPost=baseConfig.method==='post'?true:false


    const fetch=useCallback(async ()=>{


      /**
       * 如果没有带任何参数即undefined时候，不请求数据
       * 因为hooks只能在主function中执行，所以必须init时执行一次(实际不发起请求)
       *  */
      if(!data||!beforeHttp(url,data)) return

      /**如果传有第三个参数，且第三个参数为function，
       * 则为intercept，需要先执行其function，用返回结果来判断是否需要继续请求
       * 
       *  */

      /**第一次执行完后，第三个参数本身function会变为对应的执行结果 */
      // if(args.length>=3&&(typeof args[2]==='function'||typeof args[2]==='object'||(args[2]===true))){
      //   resolve=args[2]
      //   console.log(resolve) 
      //   if(resolve&&typeof resolve!=='function'){ //reducer有数据则直接不请求，此时resolve即为返回的数据
      //     // setRes(resolve) 会造成循环rerender
      //     return
      //   }  
      // }

      if(resolve.current&&typeof resolve.current!=='function'){
        return
      }
    

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


        /**如果args传递了第三个参数type，则表明需要自定义处理返回情况，此时原样返回 */
        if(res.code&&res.code!==200){
          if(args.length<3||!args[2]||typeof args[2]==='function'){
            message.error(res.msg,6)
            return
          }else{ //传有意义的type !!type===true
             return res
          }
        }
     
        /**
         * 
         * 兼容第三方的转发请求，可能没有data字段
         * 如果没有data字段则返回上一层res
         *  */
 
        const re=res.data?res.data:res
        setRes(re) 

        
      }catch(e){
        console.error(e.toString())
        setIsLoading(false)
        setError(e)   
      }


    },[data])

    /**useCallback的监听必须是hooks相关变量，才能捕捉到变化，普通变量监听不到 */

    useEffect(()=>{
      if(res&&resolve.current&&typeof resolve.current==='function'){
        resolve.current=resolve.current(res)
      } 
    },[res])


    useEffect(()=>{

      currentData.current=data

     /**
     * 如果请求有更新，则放弃之前的
     * 如果需要在参数变化后重新请求，如果参数频繁更新，会出现竞态（旧的请求因为慢，晚于后发的请求 resolve）的问题
     *  */
      if(currentData.current!==data) return 

      fetch() 
   
    },[fetch])

        /**利用renderProps来返回通用化的Component children 卡槽式 */

        const DataBoundary=useCallback(renderChildren=>{
          if(error) return <div>error</div>
          else if(isLoading) return<div className="flex-center inline-loading"><Spin   tip="Loading..."  size="large" /></div> 
          else if(res) return renderChildren({res,error}) //返回结果和error(可能需要单独处理error的场景)
          else if(resolve.current) return renderChildren({res:resolve.current}) //如果reducer有缓存，则返回缓存数据
          else return null
        },[isLoading,res,error])
    
         /**同时返回renderProps的模板处理函数 以及动态setData函数(很多场景需要动态改变触发，比如翻页搜索等) 和 获取的res结果(可能出现不render只单纯获取数据的场景) */
         return [DataBoundary,setData,res||resolve.current,isLoading]  

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



