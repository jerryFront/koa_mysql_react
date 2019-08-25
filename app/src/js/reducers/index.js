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
 

/**默认定义state下所有属性attr的case处理情况,并返回默认的reducer */ 
const  definekeyReducer=(state)=>{

    return action=>{
        
        const {type,data}=action

        if(typeof state==='object'){
          
            if(state.hasOwnProperty(type)) return {...state,[type]:data}
            else return state

        }else return state

    }

} 

/**
 * reducer采取compose的管道形式，默认的initReducer优先匹配
 * 而每个reducer会在useReducer之前默认创建state下面所有的属性case(前提是initReducer为匹配到action.type)
 * 
 */
export const reactReducer=(args)=>{

    const [state,reducer]=args

    /**将每个type对应的init fetch放置对应的state的某个默认有的属性下面 */
    
    // const keyReducer=definekeyReducer(state)

    // const proReducer=(state,action)=>{
        
    //     const res=reducer(state,action)
    //     if(res&&res[action.type])  return res
    //     //未命中，则找keyReducer
    //     return keyReducer(action)


    //     // return reducer(state,action)||keyReducer(action)

    // }

    if(!state||typeof state!=='object') return
    /**设置默认属性_init_hooks {} 其接受key:type(正常为types下面的)和value:initFunction*/

     const [states,dispatch]=useReducer(reducer,state)

     states._init_hooks={}

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
     * 
     *  实际场景还会遇到与redux一样的脏数据问题，因为是优先缓存策略，可这时候如果数据要求有更新
     * (一般为params变化)，则还会默认拿state的脏(旧)数据，而数据得不到更新
     * 为解决这个问题，则需要存储一个和state的attr对应的数据结构，专门存储对应的params
     * 当下次判断params有更新，则表示数据要求被更新，则走fetch
     * 
     * 扩展功能，则必须引入第三个参数data即params，用来存储或判断 
     * */
     const intercept=(type,cb)=>{

         return params=>{  //params即为fetch的参数
             
            let param=null
            try{
              param=typeof params==='object'?JSON.stringify(params):''
            }catch(e){
                console.error(e.toString())
            }

            if(!type||typeof type!=='string'){
                console.error('intercept type must be string')
                return 
             }
             if(!states.hasOwnProperty(type)){
                states._init_hooks[type]=param 
                return
             } 
             if(states[type]){
                /**如果有值但参数有变化，则不应该返回脏数据 */ 
                if(states._init_hooks[type]&&states._init_hooks[type]!==param){
                    states._init_hooks[type]=param 
                    return 
                }
                states._init_hooks[type]=param 
                return states[type]
             } 
             else {
                states._init_hooks[type]=param 
                return res=>{_dispatch(type,cb?cb(res):res);return res}
             }    
         
         }

      
     }





     return [states,_dispatch,intercept]

} 