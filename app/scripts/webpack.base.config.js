const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
// 多核压缩代码插件
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin')

const {hash} = require('./hash') 
const HappyPack = require('happypack')
const os = require('os')
const happyThreadPool = HappyPack.ThreadPool({size:os.cpus().length})

const resolve=name=>{
    return path.join(__dirname,name)
}

const webpackConfigBase = {
    entry:{
        index:resolve('../src/js/index.js'),
    },
    output:{
        path:resolve('../dist'),
        filename:`[name].${hash}.js`,
        chunkFilename:'chunks/[name].${hash}.js',
    },
    resolve:{
        extensions:['.js','.json'],
        alias:{
            '@src': path.join(__dirname, '../src'),
            '@apis': path.join(__dirname, '../src/apis'),
            '@components': path.join(__dirname, '../src/components'),
            '@configs': path.join(__dirname, '../src/configs'),
            '@images': path.join(__dirname, '../src/images'),
            '@middleware': path.join(__dirname, '../src/middleware'),
            '@pages': path.join(__dirname, '../src/pages'),
            '@js': path.join(__dirname, '../src/js'),
            '@styles': path.join(__dirname, '../src/styles'),
            '@pages': path.join(__dirname, '../src/pages'),
            '@utils':path.join(__dirname,'../src/utils'),
            '@html':path.join(__dirname,'../src/html'),
            '@reducers':path.join(__dirname,'../src/js/reducers'),

        }
    },
    resolveLoader:{
        moduleExtensions:['-loader']
    },
    module:{
        rules:[
            {
              test:/\.js[x]?$/,  
              exclude:/node_modules/,
              //loader:'babel',
              //把对.js的文件处理交给id为happyBabel的HappyPack的实例执行
              loader:'happypack/loader?id=happyBabel',
            },
            {
              test:/\.(css|less)$/,
              include:[
                  resolve('../src'),
              ],
              loader:ExtractTextPlugin.extract({fallback: 'style', use: 'happypack/loader?id=happyStyle'})
            },
            {
                test:/\.(css|less)$/, //antd需要全局编译不能采用css module，所以要分开
                include:[
                    resolve('../../node_modules'),
                ],
                loader:ExtractTextPlugin.extract({fallback: 'style', use: 'happypack/loader?id=happyGlobalStyle'})
            },
            {
                test:/\.(woff|eot|ttf|svg|gif)$/,
                loader:'url',
                options:{
                    limit:8192,
                    name:`font/[name].${hash}.[ext]`
                }
            },
        ]
    },
    plugins:[
        // 去除moment的语言包
        new webpack.ContextReplacementPlugin(/moment[\/\\]local$/,/de|fr|hu/),
        new HappyPack({
            //用id来标识 happypack处理那些类文件
            id:'happyBabel',
            loaders:[{
                loader:'babel?cacheDirectory=true', //重复公共文件缓存
            }],
            // 代表共享进程池，即多个HappyPack实例都是用同一个共享进程池中的子进程去处理任务，以防资源占用过多
            threadPool:happyThreadPool,
            // 允许HappyPack输出日志
            verbose:true,
        }),
        new HappyPack({
             id:'happyStyle', //css scoped css Module
             loaders:[
                 'css-loader?modules?sourceMap=true',
                 'less-loader?sourceMap=true',
                 'postcss-loader',
                ],
             threadPool:happyThreadPool,
             verbose:true,
        }),
        new HappyPack({
            id:'happyGlobalStyle', //css scoped
            loaders:[
                'css-loader?sourceMap=true',
                'less-loader?sourceMap=true',
               ],
            threadPool:happyThreadPool,
            verbose:true,
       }),
        new ExtractTextPlugin(`style.${hash}.css`),
        new webpack.optimize.CommonsChunkPlugin({
            async:'async-common',
            minChunks:3,
        })
    ],
}

module.exports=webpackConfigBase