import  React from 'react'
import {useRef,useState,useLayoutEffect} from 'react'

import http from '@utils/fetch'

import styles from './index.less'

export default ()=>{

    const [num,setNum]=useState(0)



    const [isLoading,res,error,setParams]=http.post('news/list',{page_num:num})

    

    useLayoutEffect(()=>{
       setParams({page_num:num}) 
 
    },[num])

 


    return (
        isLoading?(<div>Loading...</div>):(
        <section className={styles.container}>

           <section className={styles.leftContainer}>

                登录 {res&&res.length}

           </section>


           <section className={styles.rightContainer}>
               
           <p>You clicked {num} times</p>
            <button onClick={()=>setNum(num+1)}>点击</button>
               
           </section>  



        </section>
        )
    )
}

