const webpack = require('webpack')
const path = require('path')
const merge = require('webpack-merge')
const webpackConfigBase = require('./webpack.base.config')
const htmlWebpackPages = require('./htmlWebpack')
const {hash} = require('./hash') 

const Copy = require('copy-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')
const AutoDllPlugin = require('autodll-webpack-plugin')

const resolve=name=>{
    return path.join(__dirname,name)
}

const webpackConfigProd = {
    output:{
        publicPath:'./',
    },
    plugins:[
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            IS_DEVELOPMETN: false, 
        }),
        /* webpack自带压缩代码*/
        // new webpack.optimize.UglifyJsPlugin({ minimize: true }),
        /* 多核压缩代码 */
        new ParallelUglifyPlugin({
            cacheDir: '.cache/',
            uglifyJS:{
            output: {
                comments: false
            },
            compress: {
                warnings: false
            }
            }
        }),

        // 分析代码
        new BundleAnalyzerPlugin({ analyzerMode: 'static' }),

        new CleanWebpackPlugin(['dist'],{
            root: path.join(__dirname, '../'),
            verbose:false,
            // exclude:['img']//不删除img静态资源
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
            plugins:[
                new ParallelUglifyPlugin({
                    cacheDir: '.cache/',
                    uglifyJS:{
                      output: {
                        comments: false
                      },
                      compress: {
                        warnings: false
                      }
                    }
                }),
            ]
        }),     

        ].concat(htmlWebpackPages),

              
}

module.exports=merge(webpackConfigBase,webpackConfigProd)