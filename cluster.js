/**
 * 模拟集群
 */

 const cluster=require('cluster')
 const numCPUs=require('os').cpus().length

 //记录所有的从进程,便于分发
 const workers=[]


 var task_queue=[] //全局任务队列


const updateQueue=(item)=>{
   if(Array.isArray(item)) task_queue=task_queue.concat(item)
   else task_queue.push(item)
}


 //将队列按照规则分发给对应worker，平均分发
 const dispatch=()=>{
   /**暂时按照平均分派的原则  通过send方法将参数传递*/

   for(let k=0,l=task_queue.length;k<l;k++){
      if(workers[k%numCPUs]) workers[k%numCPUs].send(task_queue[k])

   }
  

   
 }

 const fork1=require('./server/fork/fork2').fork1

 //子线程处理
 const dealTask=(args)=>{
   //如果处理成功则返回对应的item，更新队列锁
   try{
      fork1(args)
      return true
   }catch(e){
      return e
   }
 }


 if(cluster.isMaster){

    /**主线程 */
    
    console.log('[master] ' + "start master...");

    var results=[]

    /**动态更新异步队列 */
    var arr=[]
    for(var i=1;i<2000;i++) arr.push(i)
    updateQueue(arr)

 
    for (var i = 0; i < numCPUs; i++) {
         let wk=cluster.fork();

           //从进程绑定监听message事件
         wk.on('message',msg=>{
            results.push(msg)
         })

         workers.push(wk)
    }

    /**统一分发策略 */
    dispatch()  

    cluster.on('fork',worker=>{
       console.log(`fork worker: ${worker.id}`)
    })

    cluster.on('exit',(worker,code,signal)=>{
       console.log(`worker ${worker.id} exit`)
    })


   //  //从进程绑定监听message事件
   //  workers.forEach(worker=>{
   //     worker.on('message',msg=>{
   //        results.push(msg)
   //     })
   //  })

        
   


 }else if(cluster.isWorker){

     process.on('message',msg=>{
        let res=dealTask(msg)
        process.send(res)
     })
   

 }