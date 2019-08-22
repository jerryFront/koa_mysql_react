import {types} from './types'


export const  reducer=(state,action)=>{

   switch(action.type){
       case types.UPDATE_MUSIC_BANNER:
           return Object.assign({},state,{
               banners:action.data
           }) 
       default:
           return state;   
   }

}




