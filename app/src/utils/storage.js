/**
 * 设置缓存相关
 */

import { storage_prefix } from '@configs/const'

// 函数式调用
const commonStorage ={
    get(){
        return key=>localStorage.getItem(storage_prefix+key)?JSON.parse(localStorage.getItem(storage_prefix+key)):null
    },
    set(){
        return key=>val=>localStorage.setItem(storage_prefix+key,val?JSON.stringify(val):null)
    },
    remove(){
        return key=>localStorage.remove(storage_prefix)
    }
} 

export const getStorage=commonStorage.get()

export const setStorage=commonStorage.set()

export const removeStorage=commonStorage.remove()


// 调用eg: setStorage(key)(val); getStorage(key);removeStorage(key)