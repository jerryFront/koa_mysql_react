
/**
 * 
 * koa-compose增加多个中间件
 * 
 */

 const path=require('path')
 const compose=require('koa-compose')
 const Koa=require('koa')
 const app=new Koa()
 const router=require('koa-router')()
 const koaStatic=require('koa-static') //加载静态资源中间件
 const staticCache=require('koa-static-cache') //设置静态资源过期策略
 const bodyParser=require('koa-bodyparser') //表单解析中间件




 //加载静态资源
 app.use(koaStatic(
     path.join(__dirname,'./server/public')
 ))


//表单解析大小限制
app.use(bodyParser({
    "formLimit":'5mb',
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
        console.log('%s %s - %s',ctx.method,ctx.url,ms);
    }
}

async function responsed(ctx,next){
    await next()
    if(ctx.url!=='/') return
    ctx.body='Hello World'
}

const all=compose([
    responseTime,
    logger,
    responsed,
])

app.use(all)

//路由相关
app.use(require('../router/user').routes())






/**
 * module.parent标明被其他文件require,如果被引用的场景下，不执行此行
 */
if(!module.parent) app.listen(4000)

module.exports=app




