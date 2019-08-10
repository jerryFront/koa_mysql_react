/**
 * 针对路由拦截以及其他自定义处理的共用方法
 * 
 */
import {setStorge,getStorage,removeStorage} from '@utils/storage'



 /**进入路由的判断 */
 export const isLogin=()=>{

    if(!getStorage('user_info')) return false
    
    return JSON.parse(getStorage('user_info'))

 }