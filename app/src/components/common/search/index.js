/**搜索相关 */
import React,{useState,useEffect,useRef,memo,useCallback} from 'react'
import {Input} from 'antd'
import styles from './index.less'
import {use$Ref} from '@utils/ref'

export default (props)=>{

    /**turn的参数为object {page_num:xx} */
    const {Search}=Input

    const { placeholder,onSearch, width:width=250,}=props||{}

    use$Ref(props,{
      aa:()=>console.log(placeholder)
    })

    
  return(
      <section className={`${styles.container}`}>
         <Search placeholder={placeholder} onSearch={value=>onSearch(value,props.$ref)} style={{width}} enterButton></Search>
      </section>
  )

}