import React,{setState} from 'react'
import { Link } from 'react-router-dom'
import {Layout,Menu,Dropdown} from 'antd'
import {isLogin} from '@pages/base/common'

import styles from './index.less'

const menu=(
  <Menu>
    <Menu.Item>
      <Link to="/set">个人设置</Link>
    </Menu.Item>
    <Menu.Item>
      <Link to="/login">修改密码</Link>
    </Menu.Item>
    <Menu.Item>
      <Link to="/login">注销登录</Link>
    </Menu.Item>
  </Menu>
)


export default props=>{

   const {showSearch, }=props

   const {Header}=Layout

   const user_info=isLogin()


   return (<Header className={styles.header}>
  
     {props.children}

     {user_info?(
        <Dropdown overlay={menu} placement="bottomCenter">
          <section className={styles.user}>{user_info.name}</section>
        </Dropdown>
       ):(<Link to="/login" className={styles.user} >
      登录
     </Link>)}

   </Header>)


}