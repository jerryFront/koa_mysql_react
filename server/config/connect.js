var mysql=require('mysql')

var connectionPool=mysql.createPool({
    host:'localhost',
    user:'root',
    password:'qq123456',
    database:'cure_blog',
    queueLimit:50,
    connectionLimit:50,
})

connectionPool.getConnection(err=>{
    if(err){
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connect success')
})



module.exports=connectionPool


