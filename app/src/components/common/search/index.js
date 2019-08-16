/**搜索相关 */
import React,{useState,useEffect,useRef} from 'react'
import {Input} from 'antd'

import styles from './index.less'

export default (props)=>{

    /**turn的参数为object {page_num:xx} */
    const {Search}=Input

    const { placeholder,onSearch, width:width=250,$ref }=props||{}

    if($ref){
      console.log($ref)

      $ref["methods"]={
        aa:()=>console.log(placeholder)
      }
    }
    
  return(
      <section className={`${styles.container}`}>
         <Search placeholder={placeholder} onSearch={value=>onSearch(value)} style={{width}} enterButton></Search>
      </section>
  )

}