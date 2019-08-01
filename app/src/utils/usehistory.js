/**
 * 利用useReducer实现撤销，前进等操作功能，类似之前的redux dispatch操作
 * 
 */

import React from 'react'
import {useRef,useState,useEffect,useReducer,useCallback} from 'react'

const  initialState={
    past:[], //历史队列
    present:null, //当前值
    future:[], //下一步队列
}

const reducer=(state,action)=>{
   const  {past,present,future}=state

   switch(action.type){

     case 'UNDO': //撤销
         const previous=past.pop()
         return {
             past,
             present:previous,
             future:[present,...future]
         }
     case 'REDO': //前进
         const now=future.shift()
         return{
           past:[...past,present],
           present:now,
           future
         }  
     case 'SET': //设置
     const {newPresent}=action
     if(newPresent===present){
         return state
     }
     return {
         past:[...past,present],
         present:newPresent,
         future
     }
     case 'CLEAR':
         const {initialPresent}=action
         return {
             ...initialState,
             present:initialPresent
         }
     
   }

}

export function useHistory(initialPresent){

   const [state,dispatch]=useReducer(reducer,{
       ...initialState,
       present:initialPresent
   })

   const canUndo=state.past.length!==0
   const canRedo=state.future.length!==0



   const undo=useCallback(()=>{
       if(canUndo){
           dispatch({type:'UNDO'})
       }
   },[canUndo,dispatch])

}