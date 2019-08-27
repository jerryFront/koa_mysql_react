
const state={
    banners:null,
    newest:null,
    cat:'',
    tag_:null,
    tag_华语:null,
    tag_流行:null,
    tag_摇滚:null,
    tag_民谣:null,
    tag_电子:null,
    playlist_detail:null,
}


/**
 * reducer与state的绑定只有一次，即使用useReducer来操作
 * 在reducer里默认创建state下所有propertyName的处理情况
 * 
 *  */


 
export const  musicReducer=(state,action)=>{

   /**action的结构为{type:data},可能存在多个type */
//    const {type,data}=action

//    const keys=typeof action==='object'?Object.keys(action):[]
//    let initState=state
   
//    if(keys.length){
//        keys.forEach(type=>{
//         if(state.hasOwnProperty(type)) initState={...state,[type]:action[type]}
//        })
//    }
//    return initState


  return Object.keys(action).length?{...state,...action}:state

}



export default [state,musicReducer]





