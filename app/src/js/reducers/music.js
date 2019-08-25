
const state={
    banners:null,
    newest:null,
    tag_:null,
    tag_华语:null,
    tag_流行:null,
    tag_摇滚:null,
    tag_民谣:null,
    tag_电子:null,
}


/**
 * reducer与state的绑定只有一次，即使用useReducer来操作
 * 在reducer里默认创建state下所有propertyName的处理情况
 * 
 *  */
export const  musicReducer=(state,action)=>{


   const {type,data}=action
   
   if(state.hasOwnProperty(type)) return {...state,[type]:data}
   else return state

  
//    switch(type){
//        case 'tag_':
//             return {...state,[type]:data}
//        case 'banners':
//            return {...state,[type]:data}
//        case 'newest':
//            return {...state,[type]:data}    
//        default:
//            return state;   
//    }

}

export default [state,musicReducer]





