import React from 'react'
import {useRef,useMemo,useState,useEffect,useReducer,useCallback} from 'react'

/**
 * 
 * https://www.jianshu.com/p/6c43b440dab8
 * 
 * useRef的 current属性总是指向state的最新值，用于实时获取最新值
 * 
 * useRef返回一个可变的ref对象，其.current属性被初始化为传递的参数（initialValue）。返回的对象将持续整个组件的生命周期。
 * 
 * 
 * useEffect 副总用，因为函数主体内不允许发生改变，订阅，计时器和其他副作用(主体统一被编入react的渲染阶段，
 * 会导致UI中的错误或不一致的混淆)，而useEffect的函数将避开它，在渲染结束后运行
 *
 * 与componentDidMount和componentDidUpdate不同，传递给useEffect的函数在延迟事件期间在布局和绘制后触发。
 * 这使得它适用于许多常见的副作用，例如设置订阅和事件处理程序，因为大多数类型的工作不应阻止浏览器更新屏幕。
   但是，并非所有效果都可以推迟。例如，用户可见的DOM改变必须在下一次绘制之前同步触发，以便用户不会感觉到视觉上的不一致。
   对于这些类型的效果，React提供了两个额外的Hook：useMutationEffect和useLayoutEffect。
   这些Hook与useEffect具有相同的api，并且仅在触发时有所不同。

   虽然useEffect会延迟到浏览器绘制完成之后，但它保证在任何新渲染之前触发，也就是说在开始新的更新之前，React将始终刷新先前渲染的效果。

 * 
   useContext 类同React.createContext 返回当前上下文


 * useReducer 类同redux的reducer 返回[state,dispatch]，useReducer优于useState

    当你具有涉及多个子值的复杂状态逻辑时，useReducer通常优于useState。
    它还允许你优化触发深度更新的组件的性能，因为你可以传递调度而不是回调
    
 * useMemo 格式与useEffect相同，用于返回计算的值并缓存，如果关心的依赖[]没有变化，则直接从缓存取值
 * useCallback 与useMemo类同，只是缓存function和其结果，关心的依赖[]变化时，会返回新函数，要判断函数是否
 * 发生变化，借助Set
 * useCallback 返回一个memoized回调
 * 
 * useCallback 用于props传参 是function的情况，避免不必要更新
 * useMemo 用于props是object或获取计算结果的情况，避免不必要更新
 */



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



