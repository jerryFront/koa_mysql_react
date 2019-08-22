import  React,{useReducer} from 'react'

import styles from './index.less'

import {commonReducer} from '@reducers/common'


export const commonContext=React.createContext(null)

/**
 * 不同的总路由页面采用不同的reducer数据
 * 然后fetch去对应的dispatch
 **/
const comReducer=()=>{
    const [commonState,dispatch]=useReducer(commonReducer,{
        isFetching:false,
        isLoading:false,
    })

    return [commonState,dispatch]
}






export default ()=>{

    const [commonState,dispatch]=comReducer()


    return(
     
    <commonContext.Provider value={{commonState,dispatch}}>
    <section className={styles.container}>
          1234
    </section>
    </commonContext.Provider>    
    )

}