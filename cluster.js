/**
 * 模拟集群
 */

 const cluster=require('cluster')
 const numCPUs=require('os').cpus().length


 if(cluster.isMaster){

    /**主线程 */
    
    console.log('[master] ' + "start master...");
 
    for (var i = 0; i < numCPUs; i++) {
       cluster.fork();
    }

        
   
    cluster.on('listening', function (worker, address) {
      console.log('[master] ' + 'listening: worker' + worker.id + ',pid:' + worker.process.pid + ', Address:' + address.address + ":" + address.port);
    });

 }else if(cluster.isWorker){

   

 }