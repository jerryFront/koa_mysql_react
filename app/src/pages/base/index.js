import  React from 'react'
// v4 中改从 'react-router-dom'引入

/**
 *hashHistory
  browserHistory
  createMemoryHistory
 */
import {BrowserRouter,HashRouter,Route,Switch,Redirect} from 'react-router-dom'

import styles from './index.less'

import {Spin} from 'antd'
import Login from '@pages/login/index'
import News from '@pages/news/index'
import {isLogin} from './common'




//主要的路由表结构
const PrimaryLayout=()=>{
   
    return(
    <section className={styles.container}>
        <section className={styles.leftContainer}>
             菜单栏 
        </section>
        <section className={styles.rightContainer}>
            内容区域

        </section>
    </section>

    )
}

 

export function App(){
   
    /**
     * exact 指定确定的路由
     * v4 没有onEnter onLeave onUpdate 对应修改要到Route的生命周期对应
     */
   
    return (
       <HashRouter>
          <Switch>
              <Route path="/" exact render={()=>(
                 isLogin()?(<PrimaryLayout />):(<Redirect to="/login" />)
              )}></Route> 
              <Route path="/login"  component={Login}></Route>
              <Route path="/news" exact component={News}></Route>
              <Redirect to="/" />
          </Switch>
       </HashRouter>
    )
}

export function Loader(){

    return (
        <Spin tip="Loading...">
        <div className={styles.container}>
        </div>
        </Spin>
    )

}

