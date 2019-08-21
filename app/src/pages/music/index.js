import  React,{useRef,useState,useEffect,useCallback,useContext,useMemo} from 'react'
import {Layout,Row,Col,List,Skeleton,Tabs,Card} from 'antd'
import { Link } from 'react-router-dom'
import  http from '@utils/fetch'
import TurnPage from '@components/common/turn_page'
import Search from '@components/common/search'
import Header from '@components/common/header'
import Swiper from '@components/common/swiper'
import {DeclareRef} from '@utils/ref'

import styles from './index.less'


export default ()=>{


  const {Footer,Content}=Layout

  const {TabPane}=Tabs


  const [page_num,setPageNum]=useState(0)

  const [title,setTitle]=useState('')  //模糊搜索

  const fetchBanner=useCallback(()=>http.get('music-api/banner',{}),[])

  const [,,banners]=fetchBanner()

  const fetchPersonlized=useCallback(()=>http.get('music-api/personalized',{}),[])

  const [renderPersonlized,]=fetchPersonlized()



  // useEffect(()=>{
  //   setData({
  //     page_num,
  //     title,
  //   })
  // },[page_num,title])



  let searchRef1={},swiper1={}  //用于ref


  /**翻页 */
  const turnPage=(num)=>{
     if(typeof num==='number'&&num>=0) setPageNum(num)
  }

  const onSearch=(val,ref)=>{
    if(ref) ref.aa() 
    if(val==title) return //相同则不查询 
    setPageNum(0)
    setTitle(val)
  }

  /**banner点击,跳转详情 */
  const tapBanner=(item)=>{

    console.log(item)

  }

  /**tab切换 */
  const switchTab=index=>{
     console.log(index)
  }

  /**渲染每个cardItem */
  const renderCardItem=(item,index)=>{
    return (<div key={index}>{item.name}</div>)
  }




    return (
        <section className={styles.container}>

        <Layout>
          <Header>
            <DeclareRef component={Search} $ref={searchRef1} placeholder="请输入文章关键字" onSearch={onSearch} />
          </Header>
          <Content>
            
              <Row>


              <section className={styles.swiperContainer}>
                <DeclareRef component={Swiper} $ref={swiper1} type={0} banners={banners} tap={tapBanner}>
                </DeclareRef>
              </section>   


                <Col lg={24} xl={{span:16,offset:4}}>

                  <Tabs defaultActiveKey="1" onChange={switchTab}>
                      <TabPane tab="华语" key="1">
                        
                      {renderPersonlized(({res})=>(
                        <Card bordered={false}> 
                          {
                           res&&res.result&&res.result.map((item,index)=>renderCardItem(item,index)) 
                          }
                        </Card> 
                      ))
                      } 

                      </TabPane> 
                      <TabPane tab="流行" key="2">
                          556
                      </TabPane> 
                      <TabPane tab="摇滚" key="3">
                          999
                      </TabPane> 


                  </Tabs>



                  


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

