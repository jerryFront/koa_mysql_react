import  React,{useRef,useState,useEffect,useContext} from 'react'
import {Layout,Row,Col,List,Skeleton} from 'antd'
import  http from '@utils/fetch'



import styles from './index.less'

export default ()=>{
   
  const initData={
    page_num:0,
  }
  let list=[]


  const [isLoading,res,error,setParams]=http.post('news/list',initData)
  
  

  const {Header,Footer,Content}=Layout


  const RenderList=({res})=>{

    if(res&&res.length) list=list.concat(res)

    if(list&&list.length) return (
    // <List className="main-list"
    //  loading={isLoading} itemLayout="horizontal"
    //  dataSource={list}
    //  renderItem={item=>(
    //   <List.Item>
    //     <Skeleton title={false} active>
    //         {/* <List.Item.Meta title={item.title}>
    //           </List.Item.Meta>  */}
    //     {item.content}      
    //     </Skeleton>
    //   </List.Item> 
    //  )}
    // >
    // </List>

    list.map((item,key)=>(
      <div>{item.title}</div>
    ))

    )
    else return null
    
  }

    return (
        <section className={styles.container}>

        <Layout>
          <Header>
            Header
          </Header>
          <Content>
            
              <Row>
                <Col lg={24} xl={{span:16,offset:4}}>
                 
                  <RenderList res={res}></RenderList>

                </Col>

              </Row>
            
          </Content>  
          <Footer>
            Footer
          </Footer>
        </Layout> 


        </section>
    )
}

