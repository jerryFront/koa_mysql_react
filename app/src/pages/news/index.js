import  React,{useRef,useState,useEffect,useContext} from 'react'
import {Layout,Row,Col,List,Skeleton} from 'antd'
import { Link } from 'react-router-dom'
import  http from '@utils/fetch'
import TurnPage from '@components/common/turn_page/index'

import styles from './index.less'




const useListData=()=>{





}




export default ()=>{
  const {Header,Footer,Content}=Layout
  let list=[]
  const [page_num,setPageNum]=useState(0)

  const [isLoading,res,error,setParams]=http.post('news/list',{page_num,})
  const RenderList=({res})=>{

    if(res&&res.rows&&res.rows.length) list=list.concat(res.rows)

    if(list&&list.length) return (
    <List className="main-list"
     loading={isLoading} itemLayout="horizontal"
     dataSource={list}
     renderItem={item=>(
      <List.Item>
        <Skeleton avatar title loading={isLoading} description>
             <List.Item.Meta  
             avatar={
               <img src={item.thumb_img} />
             }
             title={item.title} 
             description={
             <Link to={`/news/detail/${item.uid}`}>
             <h6>{item.thumb_time}</h6>
             <div>{item.thumb_content}</div>
             </Link>  
            }
              />
            
        </Skeleton>
    
      </List.Item> 
     )}
    >
    </List>

 

    )
    else return null
    
  }
  /**翻页 */
  const turnPage=(num)=>{
     if(num&&num>0) setPageNum(num)
     setParams({page_num})
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

                 {
                  res&&res.count&&(
                    <div>             
                    <RenderList res={res}></RenderList>
                    <TurnPage count={res.count} page_num={page_num} turn={turnPage}></TurnPage>
                    </div> 
                  )
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

