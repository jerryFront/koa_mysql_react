/**搜索相关 */
import React,{useState,useEffect} from 'react'
import {Input} from 'antd'

import styles from './index.less'

export default (props)=>{

    console.log(props)
  
    /**turn的参数为object {page_num:xx} */
    const {Search}=Input

    const { placeholder,onSearch, width:width=250 }=props||{}


  return(
      <section className={`${styles.container}`}>
         <Search placeholder={placeholder} onSearch={value=>onSearch(value)} style={{width}} enterButton></Search>
      </section>
  )



}