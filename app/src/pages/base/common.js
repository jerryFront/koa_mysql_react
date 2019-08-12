/**
 * 针对路由拦截以及其他自定义处理的共用方法
 * 
 */
import {setStorge,getStorage,removeStorage} from '@utils/storage'



 /**进入路由的判断 */
 export const isLogin=()=>{

    return getStorage('user_info')?getStorage('user_info'):false

 }