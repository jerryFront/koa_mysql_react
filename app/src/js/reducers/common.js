


export const commonReducer=(state,action)=>{

    switch(action.type){
      case 'set_common_loading':
          return Object.assign({},state,{
              isLoading:(typeof state.isLoading!=='undefined'?!state.isLoading:false)
          });

      default:
          return state;    
     
    }

}