/**
 * 有关serviceWorker的使用
 */

const PORT=require('./scripts/hash').PORT

 const isLocalhost=Boolean(window.location.hostname==='localhost'||
 //IPV6                              
 window.location.hostname==='[::1]'||
 //IPV4
 window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/))


 export function register(config){
   
    if(process.env.NODE_ENV==='development'&&'serviceWorker' in navigator){

      window.addEventListener('load',()=>{

        const swUrl=`http://${window.location.hostname}:${PORT}/service-worker.js`

        if(isLocalhost){

            /**检查serviceWorker是否还存在 */
            checkValidServiceWorker(swUrl,config)

            navigator.serviceWorker.ready.then(()=>{
                console.log('the web app is first cached by a service worker')
            })

        }else{
            registerValidSW(swUrl,config)
        }

      })
     
    } 

 }

 function registerValidSW(swUrl,config){
     navigator.serviceWorker.register(swUrl)
     .then(registration=>{
         /**更新回调 */
         registration.onupdatefound=()=>{
            const installingWorker=registration.installing
            if(installingWorker==null) return
            
            installingWorker.onstatechange=()=>{
               if(installingWorker.state==='installed'){
                   if(navigator.serviceWorker.controller){
                       console.log('new content is available')

                       if(config&&config.onUpdate){
                           config.onUpdate(registration)
                       }
                   }
               }else{
                   console.log('Content is cached for offline use')

                   if(config&&config.onSuccess){
                       config.onSuccess(registration)
                   }
               } 
            }
         }
     }).catch(e=>{
        console.error('Error during service worker registration:', e)
     })
 }

 function checkValidServiceWorker(swUrl,config){

    fetch(swUrl).then(response=>{
        if(response.status===404){
          // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then(registration => {
            registration.unregister().then(() => {
              window.location.reload();
            });
          });
        }else{
            registerValidSW(swUrl,config)
        }
    }).catch(e=>{
        console.error('Error during service worker registration:', e)
     })

 }

 export function unregister() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.unregister();
      });
    }
  }