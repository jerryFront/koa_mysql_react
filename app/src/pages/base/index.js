import  React,{useReducer,memo} from 'react'
// v4 中改从 'react-router-dom'引入

/**
 *hashHistory
  browserHistory (没有#)
  createMemoryHistory
 */
import {HashRouter,Route,Switch,Redirect,withRouter} from 'react-router-dom'
import Loadable from 'react-loadable' //懒加载

import styles from './index.less'
import {Spin} from 'antd'
import {isLogin} from './common'

import {musicReducer} from '@reducers/music'
import {reactReducer} from '@reducers/index'

export const musicContext=React.createContext(null)


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
    return  withRouter(memo(Loadable({
        loader:()=>import(/* webpackInclude: /\.js$/ */ `@pages/${path}`),
        loading:Loader,
    })))
}




/**模拟处理onEnter */
const Route4=(props)=>{
    const isPromise=(props.onEnter!==undefined&&props.onEnter().then!==undefined)?true:false
    const render=res=>res?(<Route {...props}></Route>):(<Redirect to="/login"></Redirect>)
    return (
        props.onEnter!==undefined?(
            isPromise?props.onEnter().then(re=>render(res)):render(props.onEnter())
        ):<Route {...props}></Route>
    )
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
     const [musicState,dispatch,initHook]=reactReducer(musicReducer,{
        banners:null
      })


    return (

       <HashRouter>
          <Switch>
          
              <musicContext.Provider value={{musicState,dispatch,initHook}}>
              <Route4 path="/" exact component={AsyncPage('music/index')}></Route4>
              <Route4 path="/playlist/detail/:id" component={AsyncPage('music/playlist_detail')}></Route4> 
              </musicContext.Provider> 

              <Route4 path="/index"  component={AsyncPage('base/primary')}></Route4>
              <Route4 path="/set" exact  onEnter={isLogin} component={AsyncPage('login/set')}></Route4>
              <Route4 path="/login"  component={AsyncPage('login/index')}></Route4>
              <Route4 path="/news" exact component={AsyncPage('news/index')}></Route4>
              <Route4 path="/news/detail/:uid" component={AsyncPage('news/detail')}></Route4>
             
            
             
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

