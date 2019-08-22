import  React,{useRef,useState,useEffect,useCallback,useContext,useMemo} from 'react'
import {Layout,Row,Col,List,Skeleton,Tabs,Card} from 'antd'
import { Link } from 'react-router-dom'
import  http from '@utils/fetch'
import Search from '@components/common/search'
import Header from '@components/common/header'
import Swiper from '@components/common/swiper'
import {DeclareRef} from '@utils/ref'

import {musicContext} from '@pages/base/index'

import styles from './index.less'


const {Footer,Content}=Layout
const {TabPane}=Tabs

const Index=(props)=>{

  const {musicState,dispatch,initHook} = useContext(musicContext);
 
  const [title,setTitle]=useState('')  //模糊搜索

  const [cat,setTag]=useState('')

  const fetchBanner=useCallback(()=>http.get('music-api/banner',{}),[])
  const [,,banners]=fetchBanner()
  // initHook('update_music_banner',fetchBanner)

  const fetchPlaylist=useCallback(()=>http.get('music-api/top/playlist/highquality',{cat,limit:30}),[cat])
  const [renderPlaylist,setData,res]=fetchPlaylist()

  const fetchNewest=useCallback(()=>http.get('music-api/album/newest',{}),[])
  const [renderNewest,,newRes]=fetchNewest()



  useEffect(()=>{
    setData({
      cat,
      limit:30,
    })
  },[cat])



  let searchRef1={},swiper1={}  //用于ref


  /**翻页 */
  const turnPage=(num)=>{
     if(typeof num==='number'&&num>=0) setPageNum(num)
  }


  /**banner点击,跳转详情 */
  const tapBanner=(id)=>{
    console.log(id)
  }

  /**专辑详情跳转 */
  const tapPlaylist=id=>{
    console.log(id)
  }

  /**tab切换 */
  const switchTab=name=>{
     setTag(name)
  }


  /**渲染tabPane */
  const renderTabPane=(name,res)=>{
    
    return (
      <Card bordered={false}> 
      <section className={`flex ${styles.personalizeContainer}`} >
      {renderPlaylist(({res})=>
                                  
           res&&res.playlists&&res.playlists.map((item,index)=>renderCardItem(item,index)) 
                            
      )} 
      </section>
      </Card> 
    )

  }
  

  /**渲染每个cardItem */
  const renderCardItem=(item,index)=>{
    return (<div className={styles.card} key={index} onClick={()=>tapPlaylist(item.id)}>
      <Link to={`/playlist/detail/${item.id}`}>
      <img title={item.name} src={item.coverImgUrl?`${item.coverImgUrl}?param=200y200`:`${item.picUrl}?param=200y200`}></img>
      <p title={item.name}>{item.name}</p>
      </Link>
      </div>)
  }



    return (
        <section className={styles.container}>

        <Layout>
          <Header>
            <DeclareRef component={Search} $ref={searchRef1} placeholder="请输入文章关键字"  />
          </Header>
          <Content>
            
              <Row>


              <section className={styles.swiperContainer}>
                <DeclareRef component={Swiper} $ref={swiper1} type={0} banners={banners} tap={tapBanner}>
                </DeclareRef>
              </section>   


                <Col lg={24} xl={{span:18,offset:3}}>

                  <Tabs defaultActiveKey="" onChange={switchTab}>
                      <TabPane tab="全部" key="">
                        {renderTabPane('',res)} 
                      </TabPane> 
                      <TabPane tab="华语" key="华语">
                        {renderTabPane('',res)} 
                      </TabPane> 
                      <TabPane tab="流行" key="流行">
                        {renderTabPane('',res)} 
                      </TabPane> 
                      <TabPane tab="摇滚" key="摇滚">
                        {renderTabPane('',res)} 
                      </TabPane> 
                      <TabPane tab="民谣" key="民谣">
                        {renderTabPane('',res)} 
                      </TabPane> 
                      <TabPane tab="电子" key="电子">
                        {renderTabPane('',res)} 
                      </TabPane> 
                  </Tabs>


                  <Card bordered={false} title="新碟上架">
                      <section className={`flex ${styles.newestCard}`}>
                      {
                         renderNewest(({res})=>res&&res.albums&&res.albums.map((item,index)=>
                         renderCardItem(item,index)
                         ))
                      }
                      </section>
                  </Card>     


                  


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



export default Index