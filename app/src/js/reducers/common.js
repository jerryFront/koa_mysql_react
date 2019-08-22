import * as types from './types'


export const commonReducer=(state,action)=>{

    switch(action.type){
      case types.SET_COMMON_LOADING:
          return Object.assign({},state,{
              isLoading:(typeof state.isLoading!=='undefined'?!state.isLoading:false)
          });

      default:
          return state;    
     
    }

}