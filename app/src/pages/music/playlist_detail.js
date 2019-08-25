import React,{useCallback,useContext,useEffect,useRef,useState,Fragment} from 'react'
import {Layout,Row,Col,Card} from 'antd'
import {Link} from 'react-router-dom'
import http from '@utils/fetch'
import Header from '@components/common/header'
import {DeclareRef} from '@utils/ref'

import styles from './index.less'
import {musicContext} from '@pages/base/index'

const {Footer,Content}=Layout

const Detail= (props)=>{


  const {musicState,dispatch,intercept} = useContext(musicContext)

  const id=props.match.params.id
  const fetchPlaylist=useCallback(()=>http.get('music-api/playlist/detail',id?{id}:null,intercept('playlist_detail')),[])
  const [,,res]=fetchPlaylist()

  const renderDetailDescription=res=>{
      if(!res||!res.description) return null
      res.description=res.description.replace(/\n/g,'<br/>')
      return (<p dangerouslySetInnerHTML={{__html:res.description}}></p> )
  }

  return (<section className={styles.container}>

      <Layout>
        <Header></Header>
        <Content>
            <Row>
                <Col lg={24} xl={{span:16,offset:4}}>
                  {
                   res&&res.playlist&&(
                    <Fragment> 
                    <Card bordered={false}>
                    <div className={`flex ${styles.detailHeader}`}>
                        <img className={styles.pic} src={res.playlist.coverImgUrl}></img>
                        <div className={styles.area}>
                             <h6>{res.playlist.name}</h6>
                             {res.playlist.creator&&(<b>{res.playlist.creator.signature}</b>)}
                             <nav>
                            {
                                res.playlist.tags&&res.playlist.tags.map((item,index)=>(
                                <label key={index}>{item}</label>   
                                ))  
                            }
                            </nav>
                            {
                               renderDetailDescription(res.playlist) 
                            }
                        </div>
                    </div> 
                    </Card>

                     <Card title={(<p>歌曲列表 <label className={styles.songNum}>{res.playlist.tracks?res.playlist.tracks.length:0}首歌</label></p>)}> 
                     <ul>
                     {
                         res.playlist.tracks.map((item,index)=>(
                           <li key={index}>{item.name}</li>
                         ))
                     }
                     </ul> 
                   </Card> 
                   </Fragment>  
                
                    )
                  }

     
                
                </Col>
            </Row>
        </Content>
      </Layout>
    

  </section>)



}


export default Detail

