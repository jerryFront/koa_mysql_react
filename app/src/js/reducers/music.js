
const state={
    banners:null
}


const initCase=(state)=>{
    
    const cases={}

    Object.keys(state).forEach(it=>{
        cases[it]
    })

}



/**
 * reducer与state的绑定只有一次，即使用useReducer来操作
 * 在reducer里默认创建state下所有propertyName的处理情况
 * 
 *  */
export const  musicReducer=(state,action)=>{


   const {type,data}=action
   

  
   switch(type){
       
       default:
           return null;   
   }

}





