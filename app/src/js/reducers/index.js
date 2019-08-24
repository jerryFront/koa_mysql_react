/***
 * 将reducer扩充功能
 * 同时能处理有数据(直接获取)和无数据(fetch填充)的两种情况
 * 
 * 
 * 
 */
import React,{useReducer} from 'react'




const observeState=(state,dispatch)=>{
    
    /**cases的key即为types的key，value为对应需要执行的function */ 
    /**遍历state的所有property */
    if(!state||typeof state!=='object') return 

    Object.keys(state).forEach(key=>{
    
       if(key!=='_init_hooks') //剔除
       Object.defineProperty(state,key,{
             get(val){
                 console.log(state)
               if(val||(typeof val==='object'&&Object.keys(val).length))
               return val
               else{
                    if(state._init_hooks&&state._init_hooks.hasOwnProperty(key)){
                        /**
                         * state._init_hooks[key] 可能为Array或Object 
                         * */
                        let func,cb
                        if(Array.isArray(state._init_hooks[key])) [func,cb]=state._init_hooks[key]
                        else func=state._init_hooks[key]


                        // Promise.resolve(func()).then(res=>{
                        //     if(Array.isArray(res)&&res.length>=3){ //返回的是数组，且数据固定是第三项
                        //         res=res[2]
                        //         if(cb&&res) res=cb(res)
                               
                        //         dispatch(key,res)
    
                        //     }
                        // })

                    }
                    return null
               } //先执行请求结果

           },
       })
    })
 

 }
 


export const reactReducer=(reducer,state)=>{

    /**将每个type对应的init fetch放置对应的state的某个默认有的属性下面 */

    if(!state||typeof state!=='object') return
    /**设置默认属性_init_hooks {} 其接受key:type(正常为types下面的)和value:initFunction*/

     const [states,dispatch]=useReducer(reducer,state)

    //  states._init_hooks={}

     /**一般funcs为数组，
      * 第一个参数一般为useCallback返回的function(fetch)，
      * 第二个参数为callback(re) 即为处理fetch返回值（数组的第三个数据）,指定接口返回值字段与state的绑定关系
      * 如果funcs为function，则默认state对应的某项属性，直接由接口返回的数据覆盖 
      * */
    //  const initHook=(type,funcs)=>{

    //      /**type必须为string，且隶属于types */
    //      if(typeof type!=='string'){
    //          console.error('function inithook should receive 2 paramters,type must be string')
    //          return 
    //      }
    //      if(states._init_hooks[type]) return  //已经存在，表示之前初始化过，不做处理

    //      if(typeof funcs!=='function'&&!Array.isArray(funcs)){
    //         console.error('it should be a function or an array')
    //         return 
    //      }

    //      states._init_hooks[type]=funcs 
     
    //  }

     /**简化dispatch */
     const _dispatch=(type,data)=>{
        dispatch({type,data})
     }

    /**
     * 拦截非必要请求
     * 接收参数和_dispatch一样
     * 优先查询state[key]即reducer里是否有值
     * 有则返回true(方便判断)
     * 如没有则原样返回dispatch
     * @params {string} type 为state的key
     * @params {function} cb为处理fetch返回值res的层级关系，确保提交给reducer的值的层级正确性
     * 
     *  */
     const intercept=(type,cb)=>{
         if(!type||typeof type!=='string'){
            console.error('intercept type must be string')
            return 
         }
         if(!states.hasOwnProperty(type)) return
         if(states[type]) return true
         else return res=>_dispatch(type,cb?cb(res):res)
     }





     return [states,_dispatch,intercept]

} 