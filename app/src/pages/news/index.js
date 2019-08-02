import  React from 'react'
import {useRef,useState,useEffect} from 'react'

import {useEventListener} from '@utils/hooks'

import styles from './index.less'

export default ()=>{

    const [num,setNum]=useState(1)
    const [kk,setKk]=useState(5)

    const [eventName,setEventName]=useState('click')
    useEventListener(eventName,()=>{console.log(eventName)})



    const aa=useRef(null)

    useEffect(()=>{
      setEventName(eventName=='click'?'click1':'click')   
      console.log(num)

    },[num])

    return (
        <section className={styles.container}>

           <section className={styles.leftContainer}>

                导航区

           </section>


           <section className={styles.rightContainer}>
               
           <p>You clicked {num} times</p>
            <button onClick={()=>setNum(num+1)}>点击</button>

            <p>You clicked {kk} times</p>
            <button onClick={()=>setKk(num+1)}>点击</button>
               
           </section>  



        </section>
    )
}

