import  React,{useReducer} from 'react'
// v4 中改从 'react-router-dom'引入

/**
 *hashHistory
  browserHistory (没有#)
  createMemoryHistory
 */
import {HashRouter,Route,Switch,Redirect,withRouter} from 'react-router-dom'
import Loadable from 'react-loadable' //懒加载
// import loadable from '@loadable/component'

import styles from './index.less'
import {Spin} from 'antd'
import {isLogin} from './common'



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
    /**
     * 返回的动态Component可以经过多重高阶组件的增强compose
     * withRouter是给props添加match.params 方便获取路由参数
     */
    return withRouter(Loadable({
        loader:()=>import(/* webpackInclude: /\.js$/ */ `@pages/${path}`),
        loading:Loader,
    }))
}



/**
 *最外层加loading会引起层层重复渲染 
 * {commonState.isLoading&&<Loader />}  
 *  */



export function App(){
   
    /**
     * exact 指定确定的路由
     * v4 没有onEnter onLeave onUpdate 对应修改要到Route的生命周期对应
     */
   
    return (
       <HashRouter>
          <Switch>
              <Route path="/" exact render={()=>(
                 !isLogin()?(<Redirect to="/index" />):(<Redirect to="/login" />)
              )}></Route> 
  

              <Route path="/index" component={AsyncPage('base/primary')}></Route>
              <Route path="/login"  component={AsyncPage('login/index')}></Route>
              <Route path="/news" exact component={AsyncPage('news/index')}></Route>
              <Route path="/news/detail/:uid" component={AsyncPage('news/detail')}></Route>
              
            
             
              <Redirect to="/" />
          </Switch>
       </HashRouter>
    )
}

export function Loader({error,pastDelay}){

    if(error) return <div>error</div>
    else if(pastDelay) return (<Spin tip="Loading..."  size="large">
    <div className={styles.container}>
    </div>
    </Spin>)
    else return null   

}

