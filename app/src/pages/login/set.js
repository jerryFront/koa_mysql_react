import React,{useState,useLayoutEffect,useCallback} from 'react'

import http from '@utils/fetch'
import {setStorage,getStorage} from '@utils/storage'

import styles from './index.less'


const user_id=getStorage('user_info')?getStorage('user_info').id:null


export default (props)=>{

    const [isLoading,res,error,setParams]=http.get('user/info',user_id?{user_id}:null)
   
    return (
        <div>1234</div>
    )


}
