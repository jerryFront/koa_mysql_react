import  React,{useReducer} from 'react'
// v4 中改从 'react-router-dom'引入

/**
 *hashHistory
  browserHistory
  createMemoryHistory
 */
import {BrowserRouter,HashRouter,Route,Switch,Redirect} from 'react-router-dom'
import Loadable from 'react-loadable' //懒加载
// import loadable from '@loadable/component'

import styles from './index.less'
import {Spin} from 'antd'
import {isLogin} from './common'
import {commonReducer} from '@reducers/common'


/**动态加载组件
 * 
 * import('./app'+path+'/util') => /^\.\/app.*\/util$/
也就是说，import参数中的所有变量，都会被替换为【.*】，
而webpack就根据这个正则，查找所有符合条件的包，将其作为package进行打包。

webpackIgnore: Disables dynamic import parsing when set to true.
Note that setting webpackIgnore to true opts out of code splitting.

特别注意动态import 它默认会找所有的Include类型文件进行匹配,且需要指定前半部分文件夹，来缩小匹配范围
 * 
 */
const AsyncPage=path=>{
    return Loadable({
        loader:()=>import(/* webpackInclude: /\.js$/ */ `@pages/${path}`),
        loading:Loader,
    })
}



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
          {AsyncPage('news/index')}
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
  

              <Route path="/login"  component={AsyncPage('login/index')}></Route>
              <Route path="/news" exact component={AsyncPage('news/index')}></Route>
              <Route path="/news/detail/:uid" component={AsyncPage('news/detail')}></Route>
              
            
             
              <Redirect to="/" />
          </Switch>
       </HashRouter>
    )
}

export function Loader(){

    return (
        <Spin tip="Loading..."  size="large">
        <div className={styles.container}>
        </div>
        </Spin>
    )

}

