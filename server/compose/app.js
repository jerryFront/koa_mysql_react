
/**
 * 
 * koa-compose增加多个中间件
 * 
 */

 const compose=require('koa-compose')
 const Koa=require('koa')
 const app=new Koa()
 const router=require('koa-router')()


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









/**
 * module.parent标明被其他文件require,如果被引用的场景下，不执行此行
 */
if(!module.parent) app.listen(4000)

module.exports=app




