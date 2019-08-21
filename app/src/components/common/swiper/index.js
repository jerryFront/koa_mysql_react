import React,{useState,useEffect,Fragment} from 'react'
import {Carousel} from 'antd'

import styles from './index.less'
import {use$Ref} from '@utils/ref'

/**
 * 接受props
 * type 默认0，则传递列表数据(list)以及点击事件(tap)
 * type 1，则选择slot式自定义
 * 
 *  */

export default (props)=>{


   const {type=0,autoplay=true,dots=true,banners={},tap}=props

  
   const renderImg=(item,index)=>{

     return (
         <div key={index} onClick={tap?()=>tap(item):''}>
         <img src={item.imageUrl} />
         </div>
     )   

   } 

   return (
   <Fragment>
        <Carousel className={styles.swiperContainer}  autoplay={autoplay} dots={dots}>
            {type&&props.children}
            {!type&&banners&&banners.banners&&
                banners.banners.map((item,index)=>renderImg(item,index)) 
            }
        </Carousel>
   </Fragment>
    ) 



}

