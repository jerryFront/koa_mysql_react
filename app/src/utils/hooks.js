import React from 'react'
import {useRef,useState,useEffect} from 'react'



/**
 * 绑定事件监听，将所有参数都防止useEffect，即可实现参数变化，对应的事件监听会同步更新
 */
export function useEventListener(eventName,handle,element=window){

   const hand=useRef(null)

   useEffect(()=>{
      hand.current=handle 
   },[handle])


   useEffect(()=>{

    const isSupported=element&&element.addEventListener
    if(!isSupported) return

    const event=e=>hand.current(e)

    element.addEventListener(eventName,event)

    return ()=>{
        element.removeEventListener(eventName,event)
    }

   },[eventName,element])

}


/**
 * 配合React.memo(类似pureRender功能，避免props无变化硬气的rerender)可以获取判断props的更新变化
 * 追踪数据来源以及变化
 * React.memo(props=>{xxx})
 * 
 * 
 */
export function propsChangeListener(props){
  
    //用来存储上一次props并在下一次hooks运行的时候进行比较
    const previousProps=useRef()  

    useEffect(()=>{
        if(previousProps.current){

            const alleKeys=Object.keys({...previousProps.current,...props})

            const changesObj=alleKeys.reduce((prev,cur)=>{
                if(previousProps[cur]!==props[cur]) prev[cur]={from:previousProps[cur],to:props[cur]}
                return prev
            },{})

            //最后输出changesObj
            if(Object.keys(changesObj).length){
                console.log('has changed these props:',changesObj)
            }

            //赋值给最新的
            previousProps.current=props

        }
    },[props])


}


 /**
  * 媒体查询 Hook  window.matchMedia
  * 
  * @param {*} queries 对应key数组 eg: ['(min-width: 1500px)', '(min-width: 1000px)', '(min-width: 600px)'],
  * @param {*} values  对应值数组（对应的列数）  eg: [5,4,3] 
  * @param {*} defaultValue  默认列数
  */
export function useMedia(queries,values,defaultValue){

   //返回包含是否匹配每个媒体查询的数组 
   const mediaQueryList=queries.map(q=>window.matchMedia(q))

   //根据mediaQueryList来取匹配到的值
   const getValue=()=>{

       //取第一个匹配到的下标
      const index=mediaQueryList.findIndex(mql=>mql.matches)
   
      return typeof values[index]!=='undefined'?values[index]:defaultValue 
   }

   const [value,setValue]=useState(getValue)

   useEffect(()=>{
     
      //通过在useEffect外定义getValue,但它又从hook参数传入得到最新值
      const handler=()=>setValue(getValue)

      //为没一个媒体查询设置一个监听作为回调
      mediaQueryLists.forEach(mql=>mql.addListener(handler))


      return ()=>mediaQueryList.forEach(mql=>mql.removeListener(handler))
   },[])  //空数组保证effect只在mount和unmont运行

   return value

}

