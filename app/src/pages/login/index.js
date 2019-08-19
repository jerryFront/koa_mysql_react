import  React from 'react'
import {useRef,useState,useLayoutEffect,useCallback} from 'react'
import {Form,Icon,Input,Button,Checkbox} from 'antd'
import {setStorage} from '@utils/storage'

import http from '@utils/fetch'

import styles from './index.less'


export default (props)=>{
    


    const [username,setUsername]=useState('')
    const [password,setPassword]=useState('')

    const [DataBound,setParams,res]=http.post('user/login',null)


    useLayoutEffect(()=>{

      if(res){
        setStorage('user_info')(res)
        props.history.go(-1)
       } 

    },[res])



 
   const submit=async e=>{
       e.preventDefault()
       if(!username||!password) return

       setParams({username,password})
       
   }


    return (
        <section className={styles.container}>
         <div className={styles.box}>
         <Form onSubmit={submit}>
            <Form.Item>
              <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}></Icon>}  onChange={e=>setUsername(e.target.value)}  placeholder="UserName"  allowClear></Input>
            </Form.Item>
            <Form.Item>
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" onChange={e=>setPassword(e.target.value)}  placeholder="Password" allowClear />
            </Form.Item>
            <Form.Item>
            <Checkbox>Remember me</Checkbox><br/>
            <Button type="primary" htmlType="submit" className={styles.loginButton}>
                Login
            </Button>
           </Form.Item>
         </Form>
         </div>
       </section>  
    )
}

