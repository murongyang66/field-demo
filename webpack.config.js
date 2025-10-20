const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
  entry: './src/index.ts', // 入口文件
  output: {
    path: path.resolve(__dirname, 'dist'), // 输出目录
    filename: 'bundle.js', // 输出文件名
    clean: true // 每次构建前清理输出目录
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue'], // 支持的文件扩展名
    alias: {
      '@': path.resolve(__dirname, 'src') // 设置别名方便引入
    }
  },
  module: {
    rules: [
      // 处理Vue文件
      {
        test: /\.vue$/, 
        loader: 'vue-loader'
      },
      // 处理TypeScript文件
      {
        test: /\.ts$/, 
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      },
      // 处理CSS文件
      {
        test: /\.css$/, 
        use: ['style-loader', 'css-loader']
      },
      // 处理图片资源
      {
        test: /\.(png|jpg|gif|svg)$/, 
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    // 处理Vue单文件组件
    new VueLoaderPlugin(),
    // 生成HTML文件并自动引入打包后的JS
    new HtmlWebpackPlugin({
      template: './src/index.html', // 模板HTML文件
      filename: 'index.html' // 输出的HTML文件名
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist') // 静态文件目录
    },
    compress: true, // 启用gzip压缩
    port: 9000, // 开发服务器端口
    open: true // 自动打开浏览器
  },
  mode: process.env.NODE_ENV || 'development' // 构建模式
};