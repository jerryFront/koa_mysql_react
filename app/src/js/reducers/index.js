/***
 * 将reducer扩充功能
 * 同时能处理有数据(直接获取)和无数据(fetch填充)的两种情况
 * 
 * 
 * 
 */
import React,{useReducer} from 'react'
import {types} from './types'


export const reactReducer=(reducer,state)=>{

    /**将每个type对应的init fetch放置对应的state的某个默认有的属性下面 */

    if(!state||typeof state!=='object') return
    /**设置默认属性_init_hooks {} 其接受key:type(正常为types下面的)和value:initFunction*/

     const [states,dispatch]=useReducer(reducer,state)

     states._init_hooks={}

     /**一般func为useCallback返回的function */
     const initHook=(type,func)=>{
         /**type必须为string，且隶属于types */
         if(typeof type!=='string'){
             console.error('function inithook should receive 2 paramters,type must be string')
             return 
         }
         if(!types[type]){  //type必须在types里面有，否则无效
             console.error('type is invalid,should in types')
             return 
         }
         if(states._init_hooks[type]) return  //已经存在，表示之前初始化过，不做处理

         if(typeof func!=='function'){
            console.error('it should be a function')
            return 
         }

         states._init_hooks[type]=func

         Promise.resolve(func).then(ress=>{
             console.log(ress)
             if(ress&&ress.length>=3) dispatch(type,ress[3])
         })
          
     }

     const _dispatch=(type,data)=>{
        dispatch({type,data})
     }


     return [states,_dispatch,initHook]

} 