const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const HappyPack = require("happypack"); // 多线程编译
const webpackbar = require("webpackbar");

const PUBLIC_PATH = "/"; // 基础路径

module.exports = {
    mode: "development",
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        publicPath: PUBLIC_PATH, // 文件解析路径，index.html中引用的路径会被设置为相对于此路径
        filename: "[name]-[contenthash].js", // 编译后的文件名字
        assetModuleFilename: "assets/[name].[hash:4][ext]"
    },
    mode: "development",
    devtool: "eval-source-map", // 报错的时候在控制台输出哪一行报错
    optimization: {
      splitChunks: {
            chunks: "all",
      },
    },
    module: {
      rules: [
        // {
        //   // 编译前通过eslint检查代码 (注释掉即可取消eslint检测)
        //   test: /\.js?$/,
        //   enforce: "pre",
        //   use: ["eslint-loader"],
        //   include: path.resolve(__dirname, "src"),
        // },
        {
          // .js .jsx用babel解析
          test: /\.js?$/,
          use: ["happypack/loader"],
          include: path.resolve(__dirname, "src"),
        },
        {
          // .css 解析
          test: /\.css$/,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
        {
          // .less 解析
          test: /\.less$/,
          use: [
            "style-loader",
            "css-loader",
            "postcss-loader",
            {
              loader: "less-loader",
              options: { lessOptions: { javascriptEnabled: true } },
            },
          ],
        },
        {
          // 文件解析
          test: /\.(eot|woff|otf|svg|ttf|woff2|appcache|mp3|mp4|pdf)(\?|$)/,
          include: path.resolve(__dirname, "src"),
          type: "asset/resource",
        },
        {
          // 图片解析
          test: /\.(png|jpg|jpeg|gif)(\?|$)/i,
          include: path.resolve(__dirname, "src"),
          type: "asset",
        },
      ]
    },
    plugins: [
      new webpackbar(),
      new webpack.DefinePlugin({
        "process.env": "dev",
      }),
      new HappyPack({
        loaders: ["babel-loader"],
      }),
      new HtmlWebpackPlugin({
        // 根据模板插入css/js等生成最终HTML
        filename: "index.html", //生成的html存放路径，相对于 output.path
        favicon: "./public/favicon.ico", // 自动把根目录下的favicon.ico图片加入html
        template: "./public/index.html", //html模板路径
        inject: true, // 是否将js放在body的末尾
      }),
      // 拷贝public中的文件到最终打包文件夹里
      new CopyPlugin({
        patterns: [
          {
            from: "./public/**/*",
            to: "./",
            globOptions: {
              ignore: ["**/favicon.png", "**/index.html"],
            },
            noErrorOnMissing: true,
          },
        ],
      }),
    ],
    resolve: {
      extensions: [".js", ".jsx", ".less", ".css", ".wasm"], //后缀名自动补全
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
}