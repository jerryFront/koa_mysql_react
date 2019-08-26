import React,{useCallback,useContext,useEffect,useRef,useState,Fragment,useMemo} from 'react'
import {Layout,Row,Col,Card} from 'antd'
import {Link} from 'react-router-dom'
import http from '@utils/fetch'
import Header from '@components/common/header'
import {DeclareRef} from '@utils/ref'

import styles from './index.less'
import {musicContext} from '@pages/base/index'

const {Footer,Content}=Layout

const Detail= (props)=>{


  const {musicState,dispatch,intercept} =useContext(musicContext)
 
  const [unfold,setUnfold]=useState(false)

  const id=props.match.params.id
  const fetchPlaylist=useCallback(()=>http.get('music-api/playlist/detail',id?{id}:null,intercept('playlist_detail')),[])
  const [renderPlayDetail]=fetchPlaylist()

  const renderDetailDescription=res=>{
      if(!res||!res.description) return null
      res.description=res.description.replace(/\n/g,'<br/>')
      return (<Fragment>
        <p dangerouslySetInnerHTML={{__html:res.description}} className={unfold?styles.unfold:''}></p>
        <label onClick={()=>setUnfold(!unfold)}>{unfold?'收起∧':'展开更多∨'}</label>
      </Fragment>)
  }

  /**毫秒转分 */
  const timeStamp=time=>{
    if(!time||!(+time)) return '--'
    time=parseInt(time/1000)
    let m=parseInt(time/60),s=time%60
    return (m<10?'0'+m:m)+":"+(s<10?'0'+s:s)
  }

  return (<section className={styles.container}>

      <Layout>
        <Header></Header>
        <Content>
            <Row>
                <Col lg={24} xl={{span:16,offset:4}}>
                  {
                  renderPlayDetail(({res})=>res&&res.playlist&&(
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
                     <ul className={styles.songList}>
                      <li className={styles.header}><p></p><p>歌曲标题</p><p>时长</p><p>歌手</p><p>专辑</p></li> 
                     {
                         res.playlist.tracks.map((item,index)=>(
                           <li key={index}>
                             <p>{index+1}</p>
                             <p title={item.name}>{item.name}</p>
                             <p>{timeStamp(item.dt)}</p>
                             <p>{item.ar.map((ite,ind)=>(<label key={ind}>{ind>0?'/'+ite.name:ite.name}</label>))}</p>
                             <p title={item.al.name}>{item.al.name}</p>
                           </li>
                         ))
                     }
                     </ul> 
                   </Card> 
                   </Fragment>  
                
                    ))
                  }

     
                
                </Col>
            </Row>
        </Content>
      </Layout>
    

  </section>)



}


export default Detail

