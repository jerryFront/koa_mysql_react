import React,{setState} from 'react'
import { Link } from 'react-router-dom'
import {Layout,Menu,Dropdown} from 'antd'
import {isLogin} from '@pages/base/common'
import {rootPath} from '@configs/const'

import styles from './index.less'

const menu=(
  <Menu>
    <Menu.Item className="flex-center">
      <Link to="/set">个人设置</Link>
    </Menu.Item>
    <Menu.Item className="flex-center">
      <Link to="/login">修改密码</Link>
    </Menu.Item>
    <Menu.Item className="flex-center">
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
          <section className="flex">
          <p className={`${styles.user} ellipsis`}>{user_info.name}</p>
          <img className={styles.headImg} src={`${rootPath}${user_info.headImg}`} />
          {/* {user_info.headImg?():null} */}
          </section>
        </Dropdown>
       ):(<Link to="/login" className={styles.user} >
      登录
     </Link>)}

   </Header>)


}