
/**
 * 
 * koa-compose增加多个中间件
 * 
 */

 const path=require('path')
 const compose=require('koa-compose')
 const Koa=require('koa')
 const app=new Koa()
 const koaStatic=require('koa-static') //加载静态资源中间件
 const staticCache=require('koa-static-cache') //设置静态资源过期策略
 const bodyParser=require('koa-bodyparser') //表单解析中间件

 const checkContext=require('./server/utils/checkController') //鉴权验证
 const rep=require('./server/utils/response')




 /**
  *加载静态资源
  * 必须每个单独配置，读取不同每个文件夹下对应的静态资源(不要添加不存在的目录)
  * */
 app.use(koaStatic(
     path.join(__dirname,'./app'),
 ))

 app.use(koaStatic(
    path.join(__dirname,'./server/assets'),
 ))



//表单解析大小限制
app.use(bodyParser({
    "formLimit":'2mb', //上传限制2M
    "jsonLimit":'5mb',
    "textLimit":'5mb'
}))


  //x-response-time

  async function responseTime(ctx,next){
    const start=new Date()
    await next()
    const ms=new Date()-start
    ctx.set('X-Response-Time',ms+'ms')
}

async function logger(ctx,next){
    const start=new Date()
    await next()
    const ms=new Date()-start
    if(process.env.NODE_ENV!=='test'){
        console.log('%s %s -http_status %s - %sms',ctx.method,ctx.url,ctx.status,ms);
    }
}


/**
 * 只做转发的第三方请求不需要鉴权
 * 设置其匹配规则
 *  */
const whiteList=[
   /^\/music-api\/*/g,
]


/**
 * 
 * @param {*} ctx 
 * @param {*} next 
 * 
 * 作为统一拦截 token和签名校验等使用
 * 
 * 需要设置白名单，表示不进行token校验等
 */
async function checkController(ctx,next){

   
   /**
    * 将对应第三方请求转发等直接不鉴权验证
    * 抛开特定的第三方白名单外，都走鉴权
    *  */ 
   if(!whiteList.some(reg=>reg.test(ctx.url))){
       

    //设置跨域cors
    ctx.set('Access-Control-Allow-Origin','*')
    ctx.set('Access-Control-Allow-Methods', 'PUT,DELETE,POST,GET')  //OPTIONS,
    ctx.set('Access-Control-Allow-Headers', 'seqno,timestamp,sign,Content-Type,token')
    ctx.set('Access-Control-Allow-Credentials', true);

    // if(ctx.method==='OPTIONS'){
    //     ctx.response.body=''
    //     return
    // } 

    const res=await checkContext.checkCompose(ctx) 

    if(typeof res==='string'){

       ctx.response.body=rep.response(null,res)
       return

    }

  } 

    await next()

 
}

const all=compose([
    responseTime,
    logger,
    checkController,
])

app.use(all)




//路由相关
app.use(require('./server/router/user').routes())
app.use(require('./server/router/news').routes())
app.use(require('./server/router/common').routes())

app.use(require('./server/router/music').routes())







/**
 * module.parent标明被其他文件require,如果被引用的场景下，不执行此行
 */
if(!module.parent) app.listen(4000)

module.exports=app




