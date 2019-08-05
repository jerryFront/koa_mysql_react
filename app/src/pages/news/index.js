import  React,{useRef,useState,useEffect,useContext} from 'react'
import  {commonContext} from '@pages/base/index'
import  http from '@utils/fetch'



import styles from './index.less'

export default ()=>{
   
  const initData={
    page_num:0,
  }

  const [data,setData]=useState(initData)

  // const ctx=useContext(commonContext)


  // useEffect(()=>{

  //   ctx.dispatch({type:'set_common_loading'})

  // },[data])


  const [isLoading,res,error,setParams]=http.post('news/list',data)
  
  





    return (
        <section className={styles.container}>

          <button onClick={()=>{ ctx.dispatch({type:'set_common_loading'})}}>点击</button>

          
           something is ready!


        </section>
    )
}

