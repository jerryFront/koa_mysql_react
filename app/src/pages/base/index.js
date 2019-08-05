import  React,{useReducer} from 'react'
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
import {commonReducer} from '@reducers/common'



export const commonContext=React.createContext(null)


/**
 * 不同的总路由页面采用不同的reducer数据
 * 然后fetch去对应的dispatch
 **/
const comReducer=()=>{
    const [commonState,dispatch]=useReducer(commonReducer,{
        isFetching:false,
        isLoading:false,
    })

    return [commonState,dispatch]
}


/**
 *最外层加loading会引起层层重复渲染 
 * {commonState.isLoading&&<Loader />}  
 *  */

//主要的路由表结构
const PrimaryLayout=()=>{

    const [commonState,dispatch]=comReducer()

    return(
     
    <commonContext.Provider value={{commonState,dispatch}}>
    <section className={styles.container}>
       <News></News>
    </section>
    </commonContext.Provider>    
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
                 !isLogin()?(<PrimaryLayout />):(<Redirect to="/login" />)
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

console.log(React.createElement(Loader()))

