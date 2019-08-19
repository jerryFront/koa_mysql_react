import  React,{useRef,useState,useEffect,useCallback} from 'react'
import {Layout,Row,Col,Card} from 'antd'
import  http from '@utils/fetch'



import styles from './index.less'

export default props=>{
   

  const [uid]=useState(props.match.params.uid)


  const fetchDetail=useCallback(()=>http.post('news/getDetail',{uid}),[uid])
  
  const [DataBound]=fetchDetail()


  const {Header,Footer,Content}=Layout

  

    return (
        <section className={styles.container}>

        <Layout>
          <Header>
            详情页
          </Header>
          <Content>
              
              <Row>
                <Col lg={24} xl={{span:16,offset:4}}>
                 
    
                 {DataBound(({res})=>res&&(
                    <Card title="文章详情" bordered={false}>
                       
                       <div dangerouslySetInnerHTML={{__html: res.content}}></div>

                    </Card>
                  ))
                } 

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

