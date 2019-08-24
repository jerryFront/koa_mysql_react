/**
 * compose使用
 */

 /**兼容异步 */
 export const compose=(...funcs)=>{
   
    const init=funcs.shift()

    return (...args)=>{
        return funcs.reduce((a,b)=>{
            return a.then(res=>b.apply(null,res))
        },Promise.resolve(init.apply(null,args)))
    }

 }