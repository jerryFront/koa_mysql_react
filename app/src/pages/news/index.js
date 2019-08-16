import  React,{useRef,useState,useEffect,useContext,memo} from 'react'
import {Layout,Row,Col,List,Skeleton} from 'antd'
import { Link } from 'react-router-dom'
import  http from '@utils/fetch'
import TurnPage from '@components/common/turn_page'
import Search from '@components/common/search'
import Header from '@components/common/header'

import styles from './index.less'


const DeclareRef=memo(Comp=>{
   const Com=React.useCallback(Comp.component({...Comp}),[Comp])
   if(Comp.$ref!==undefined){
     if(typeof Comp.$ref!=='object') console.error('attribute $ref must be object,better useRef')
     else if(typeof Comp.$ref==='object') Comp.$ref.ref=Com
   } 
  return Com
})


export default ()=>{


  const {Footer,Content}=Layout

  let list=[]

  const [page_num,setPageNum]=useState(0)

  const [title,setTitle]=useState('')  //模糊搜索

  const [isLoading,res,error,setParams]=http.post('news/list',{page_num,})


  let searchRef1={},searchRef2={}  //用于ref

  useEffect(()=>{
    console.log(searchRef1.methods.aa(),searchRef2.methods.aa())
     setParams({
       page_num,
       title
     })
  },[page_num,title])

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
     if(typeof num==='number'&&num>=0) setPageNum(num)
  }

  const onSearch=(val)=>{
    if(val==title) return //相同则不查询 
    setPageNum(0)
     setTitle(val)
  }

    return (
        <section className={styles.container}>

        <Layout>
          <Header>
            <DeclareRef component={Search} $ref={searchRef1} placeholder="请输入文章关键字" onSearch={onSearch} />
            <DeclareRef component={Search} $ref={searchRef2} placeholder="请输入any" onSearch={onSearch} />
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

