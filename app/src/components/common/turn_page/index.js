/**分页相关 */
import React,{useState,useEffect} from 'react'
import {page_size} from '@configs/const'

import styles from './index.less'

export default (props)=>{
  
    /**turn的参数为object {page_num:xx} */

  const {page_num,count,turn}=props

  return(
      <section className={styles.turnPageContainer}>
      <button onClick={()=>{if(page_num>0) turn(page_num-1)}}>上一页</button>
      <label className={styles.num}>{page_num+1}/{Math.ceil(count/page_size)}</label>
      <button onClick={()=>{if(page_num<Math.ceil(count/page_size)-1) turn(page_num+1)}}>下一页</button>
      </section>
  )



}