import  React from 'react'
import {useRef,useState,useLayoutEffect} from 'react'
import {Form,Icon,Input,Button,Checkbox} from 'antd'

import http from '@utils/fetch'

import styles from './index.less'

export default (props)=>{

    console.log(props.form)

    const [num,setNum]=useState(0)


    useLayoutEffect(()=>{
       
 
    },[num])

 
   const submit=e=>{
       e.preventDefault()
   }


    return (
        <section className={styles.container}>
         <Form onSubmit={submit}>
            <Form.Item>
              <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}></Icon>} placeholder="UserName"></Input>
            </Form.Item>
            <Form.Item>
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password"placeholder="Password"/>
            </Form.Item>
            <Form.Item>
            <Checkbox>Remember me</Checkbox>
            <Button type="primary" htmlType="submit" className="login-form-button">
                Login
            </Button>
           </Form.Item>
         </Form>
       </section>  
    )
}

