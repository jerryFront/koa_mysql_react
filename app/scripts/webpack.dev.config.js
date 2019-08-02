const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const webpackConfigBase = require('./webpack.base.config')
const htmlWebpackPages = require('./htmlWebpack')
const {hash} = require('./hash') 

const OpenBrowserPlugin = require('open-browser-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const AutoDllPlugin = require('autodll-webpack-plugin')

const PORT = 8899
const resolve=name=>{
    return path.join(__dirname,name)
}
const webpackConfigDev = {
   plugins:[
       new webpack.DefinePlugin({
           'process.env.NODE_ENV':JSON.stringify('development'),
       }),
       new OpenBrowserPlugin({
           url:`http://localhost:${PORT}`,
       }),
       new AutoDllPlugin({
           inject:true,
           debug:true,
           filename:`[name].${hash}.js`,
           entry:{
            dll:[
                'react',
                'react-dom',
                'react-router',
                'babel',
                'react-router-dom',
                'axios',
            ]
           },
       }),     
   ].concat(htmlWebpackPages),
   devtool:'source-map',
   devServer:{
       contentBase:resolve('../src'),
       historyApiFallback:false,
       hot:false,
       port:PORT,
   }
}

module.exports = merge(webpackConfigBase,webpackConfigDev)