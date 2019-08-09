/**分页相关 */
import React,{useState,useEffect} from 'react'

import styles from './index.less'

export default (props)=>{
  
    /**turn的参数为object {page_num:xx} */

  const {page_num,count,turn}=props

  return(
      <section className={styles.turnPageContainer}>
      <button>上一页</button>
      <label className={styles.num}>{page_num+1}</label>
      <button onClick={()=>turn(page_num+1)}>下一页</button>
      </section>
  )



}