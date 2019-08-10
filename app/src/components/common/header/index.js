import React,{setState} from 'react'

import {Layout} from 'antd'
import {isLogin} from '@pages/base/common'

import styles from './index.less'



export default props=>{

   const {showSearch, }=props

   const {Header}=Layout

   const user_info=isLogin()


   return (<Header className={styles.header}>
  
     {props.children}

     {user_info?(
       <section className={styles.user}>user_info.name</section>
       ):(<section className={styles.user}>
      登录
     </section>)}

   </Header>)


}