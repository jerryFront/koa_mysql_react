import axios from 'axios'
import React,{useState,useEffect,} from 'react'
import ReactDOM from 'react-dom'
import {message,Spin} from 'antd'
import {timeout,basePath} from '@configs/const'
import {getStorage,removeStorage} from '@utils/storage'
import md5 from 'md5'
import {Loader} from '@pages/base/index'



const qs=require('qs')

const {CancelToken}=axios



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
    baseUrl:basePath,
    headers:{
        'Content-Type':'text/plain',
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

  static keys='E41F6E5DBA6W'

  static createHeader(){

         //鉴权签名算法
        //SeqNo：唯一请求序列号，客户端识别码(0W代表web端，0I代表ios端，0A代表Android端)+UUID
        let TimeStamp=parseInt(new Date().getTime()/1000), SeqNo='0W'+this.guid(),SignTemp,Sign
        SignTemp='seqno='+SeqNo+'&timestamp='+TimeStamp+'&key='+this.key
        Sign=md5(SignTemp)

        return {
            TimeStamp,
            SeqNo,
            Sign
        }
  }


  //采用hooks处理方式
  static async request(url,data){

    const userheader=getStorage('user_info')
    baseConfig.headers={...baseConfig.headers,...this.createHeader(),...userheader}
    baseConfig.url=url
    baseConfig.data=data
    

    const [res,setRes]=useState({
        status:'pending',
        data:null,
        error:null,
    })


    useEffect(()=>{

      let aborted=false
     
      ReactDOM.render(
        <Loader />,
        document.getElementById('app')
    )
      



      return ()=>{
          aborted=true
      }
        
    },[url,data])



  }



}



