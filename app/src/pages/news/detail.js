import  React,{useRef,useState,useEffect,useContext} from 'react'
import {Layout,Row,Col,List,Skeleton} from 'antd'
import { Link } from 'react-router-dom'
import  http from '@utils/fetch'



import styles from './index.less'

export default props=>{
   
  const initData={
    uid:props.match.params.uid,
  }




  const [isLoading,res,error,setParams]=http.post('news/getDetail',initData)
  
  

  const {Header,Footer,Content}=Layout




  const RenderDetail=({res})=>{

    // if(res&&res.rows&&res.rows.length) list=list.concat(res.rows)

    // if(list&&list.length) return (

    //     <Skeleton avatar title loading={isLoading} description>
    //          <List.Item.Meta  
    //          avatar={
    //            <img src={item.thumb_img} />
    //          }
    //          title={item.title} 
    //          description={
    //          <Link to={`/news/detail/${item.id}`}>
    //          <h6>{item.thumb_time}</h6>
    //          <div>{item.thumb_content}</div>
    //          </Link>  
    //         }
    //           />
            
    //     </Skeleton>

    // )
    // else return null
    
  }

    return (
        <section className={styles.container}>

        <Layout>
          <Header>
            详情页
          </Header>
          <Content>
            
              <Row>
                <Col lg={24} xl={{span:16,offset:4}}>
                 
                  {/* <RenderDetail res={res}></RenderDetail> */}

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

