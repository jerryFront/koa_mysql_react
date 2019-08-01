const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const resolve = dir=>{
    return path.join(__dirname,dir)
}

const pages=[
    new HtmlWebpackPlugin({
        entry:resolve('../src/js/index'),
        template:resolve('../src/html/index.html'),
        filename:'index.html',
        title:'主页',
        chunks:['index'],
    })

]

module.exports=pages