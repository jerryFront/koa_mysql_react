/**
 * 实现react hooks的$ref相关
 * 
 * 先是官方实现：
 * 在子组件用forwardRef包裹，子组件useImperativeHandle(ref,()=>{ 包裹methods })
 * 父组件中,useRef作为refs声明,然后其current获取子组件中包裹的methods进行调用
 *
 * 以下为自己实现
 */
import React,{memo,useMemo,useCallback} from 'react'

/**
 * 注意区分memo,useMemo,useCallback三者的区别 
 * 三者基本都是采用memorize方法缓存render结果，避免不必要的vdom diff到render的过程
 * 
 * memo和pureComponent类同，用于阻止组件的不必要render,
 * 默认情况将preProps与props进行浅拷贝比较，如要深层次则自行实现第二个参数Function
 * 
 * useCallback(fn, inputs) === useMemo(() => fn, inputs))
 * 
 * 
 */


/**
 * 将所有页面引入的子组件用DeclareRef封装
 * (父组件使用)
 * 后续可以利用compose进行扩展拦截
 */
export const DeclareRef=memo(Component=>{
    /**component属性为组件本身 */
    if(!Component.component){
        console.error('use DeclareRef,you must declare component attribute ')
        return null
    }


    /**缓存对应Component的执行结果 */
    const Com=useCallback(Component.component({...Component}),[Component])

   /**ref记录在$ref属性里，如有声明必须为object(且能改动) */
   if(Component.$ref!==undefined){
     try{
        /**null is object */ 
        if(!Component.$ref||typeof Component.$ref!=='object') console.error('attribute $ref must be object and not const,better not useRef')
        else  Component.$ref.ref=Com
     }catch(e){
         console.error(e.toString())
     }
   } 

   return Com

})


/**
 * 在子组件里将所需要的attrs(key,value)格式等属性绑定到props下的$ref下(如果存在的话)
 * (子组件使用) 利用useCallback来缓存不必要的再次执行
 */
export const use$Ref1=(props,{...attrs})=>{

    if(!props||!props.$ref||typeof props.$ref!=='object'){
       if(!props) console.warn('use$ref ,you should has props and props.$ref attribute')
       if(props.$ref&&typeof props.$ref!=='object') console.warn('use$ref,props.$ref must be object and not const')
       return
    }
    if(!attrs||typeof attrs!=='object'||!Object.keys(attrs).length) return 

    /**检测attrs如果有key ref的话，需要剔除 */
    if(attrs.hasOwnProperty('ref')) delete attrs.ref

    try{
         /**直接浅拷贝 */
         Object.assign(props.$ref,attrs)

        // Object.keys(attrs).reduce((prev,cur)=>{
        //    if(cur)  prev[cur]=attrs[cur]
        //    return prev
        // },props.$ref)
    }catch(e){
        console.error(e.toString())
    }

}


export const use$Ref=(...args)=>{
    return useCallback(use$Ref1(...args),[args[1]||null])
}

