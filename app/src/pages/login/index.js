import  React from 'react'
import {useRef,useState,useEffect} from 'react'

import http from '@utils/fetch'

import styles from './index.less'

export default ()=>{

    const [num,setNum]=useState(0)
    const [params,setParams]=useState({page_num:0})



    const [isLoading,res,error]=http.post('news/list',{page_num:num})

    

    useEffect(()=>{
        

    })

 


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

