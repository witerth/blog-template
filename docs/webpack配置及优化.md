---
title: webpack配置及优化
tags:
  - webpack
  - 前端打包优化
readingTime: false
outline: [2, 3]
top: 2
recommend: 1
---

# webpack 配置及优化

## webpack 配置

webpack 执行构建会找 webpack.config.js 这个配置文件，如果没有找到，走默认配置

使用默认的配置⽂件：webpack.config.js

不使⽤⾃定义配置⽂件： ⽐如 webpackconfig.js，可以通过-- config webpackconfig.js 来指定 webpack 使⽤哪个配置⽂件来 执⾏构建，package.json 文件同样

```javascript
const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const PurifyCSS = require("purifycss-webpack");
const glob = require("glob-all");
const webpack = require("webpack");

module.exports = {
	//上下文 项目打包的相对路径，必须是绝对路径
	//context: process.cwd()

	//入口 执行构建的入口 项目入口 支持字符串 数组 对象(多入口，多键值)
	entry: "./src/index.js",
	//entry: ["./src/index.js", "./src/second.js"],	//数组 拼接
	//entry: { main: "./src/index,js" }	//key值随便起，filename会把其作为name

	//出口
	output: {
		//构建的文件资源存放目录。必须是绝对路径
		path: path.resolve(__dirname, "./dist"),

		//构建的文件资源名称 无论多出口还是单出口，都推荐使用占位符
		filename: "[name]-[chunkhash:6].js",
		/*占位符
          1、hash 整个项目的hash值，每构建一次，就会有一个新的hash值
            [name]-[hash: 6].js	hash长度6位，最长20位
          2、chunkhash 根据不同入口entry进行依赖解析，构建对应的chunk，生成相应的hash，只要组成entry的模块没有内容改动，则对应的hash不变
            [name]-[chunkhash:6].js
          3、name
          4、id
        */
	},

	//构建模式 none production development
	mode: "production",
	/*设置mode可以自动触发webpack内置的函数，达到优化的效果
      如果没有设置，webpack会将mode的默认值设置为 production
      设置 NODE_ENV 并不会自动设置mode
      开发阶段的开启会有利于热更新的处理，识别哪个模块变化
      生产阶段的开启会有帮助模块压缩，处理副作用等一些功能
      development: 会将 DefinePlugin 中 process.env.NODE_ENV 的值设置为 development，启用 NamedChunksPlugin 和 NameModulesPlugin
      production： 会将 DefinePlugin 中 provess.env.NODE_ENV 的值设置为 Producment，启用 FlagDependencyUsagePlugin、FlagIncludedChunkPlugin、ModuleConcatenationPlugin、NoEmitOnErrorsPlugin、OccurrenceOrderPlugin、SideEffectsFlagPlugin 和 TerserPlugin
      none：退出任何默认优化效果
    */

	module: {
		//loader
		/*webpack默认只支持.json和.js模块，不支持不认识其他格式的模块
          模块解析，模块转换器，用于把模块原内容按照需求转换成新内容
          webpack是模块打包工具，而模块不仅仅是js，还可以是css，图片或者其他格式
          但是webpack默认只知道如何处理js和json模块，那么其他格式的模块处理，和处理方式就需要loader了
          loader处理webpack不支持的格式文件，模块
          一个loader值处理一件事情
        */
		rules: [
			{
				test: /\.css$/,
				include: path.resolve(__dirname, "./src/style"), //只查找 src/style 文件夹
				//loader的执行顺序是从右到左，从下到上
				use: [
					{
						loader: "style-loader",
						options: {
							injectType: "singletonStyleTag", //将所有的style标签合并成⼀个
						},
					},
					"css-loader",
				],
			},
			{
				test: /\.less$/,
				use: [
					"style-loader",
					{
						loader: "css-loader",
						options: {
							//开启css模块化，可以在js里直接用css类名
							modules: true,
						},
					},
					{
						loader: "postcss-loader", //样式自动添加前缀，配置postcss.config.js
					},
					"less-loader",
				],
			},
			{
				test: /\.(png|jpe?g|gif)$/,
				use: [
					{
						loader: "url-loader",
						options: {
							name: "[name]_[hash:6].[ext]", //ext 后缀名
							outputPath: "images/",
							//url-loader内置file-loader
							//推荐使用url-loader，因为url-loader支持limit
							//推荐小体积的图片资源转成base64
							limit: 2 * 1024, //单位是字节 1024=1kb
						},
					},
				],
			},
			{
				test: /\.(eot|ttf|woff|woff2|svg)$/, //字体
				use: [
					{
						loader: "file-loader",
						options: {
							name: "[name]_[hash:6].[ext]",
						},
					},
				],
			},
			{
				test: /\,js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						//语法转换插件 preset-env
						presets: ["@babel-preset-env"],
					},
				},
			},
		],
	},

	//development模式下默认开启soruceMap
	devtool: "none", //关闭soruceMap
	/*source-map: 产生.map文件
      cheap: 较快，只显示行数，不显示列信息
      module: 第三方模块，包含loader的sourceMap(比如jsx to js,babel的sourcemap)
      inline: 讲.map作为DataURL嵌入，不单独生成.map文件
      推荐配置
      devtool: "cheap-module-eval-source-map"	//开发环境配置

      线上不推荐开启
      devtool: "cheap-module-source-map"	//线上配置
    */

	resolve: {
		//查找第三方依赖
		modules: [path.resolve(__dirname, "./node_modules")],
		//起别名，减少文件查找时间
		alias: {
			"@": path.resolve(__dirname, "./src"),
			react: "./node_modules/react/umd/react.production.min.js",
			"react-dom": "./node_modules/react-dom/umd/react-dom.production.min.js",
		},
		//引入文件可以省略后缀，会消耗一点资源，列表不宜过长
		extensions: [".js", ".ts", ".json"],
	},

	devServer: {
		contentBase: "./dist",
		open: true, //自动打开浏览器窗口
		port: 8080,

		//代理，本地通过 node mock 数据时使用proxy
		proxy: {
			api: {
				target: "http://localhost:8888",
			},
		},

		//before after 是 devServer 中间件提供的两个钩子
		//mock server 直接在当前服务
		before(app, server) {
			app.get("/api/mock.json", (req, res) => {
				res.json({
					name: "witerth",
				});
			});
		},
		// hot: true,	//开启HMR(热模块替换)
		// hotOnly: true	//开启后，浏览器不自动刷新，即使HMR不生效
	},
	/*package.json文件
      "scripts": {
        "server": "webpack-dev-server --open --config webpack.dev.js"
        // --open 和 open: true 效果相同
        // --config name 表示默认 webpack 配置文件，不配置默认 webpack.config.js
      },
    */

	//js Tree Shaking
	//mode 为 development 时不生效，生产模式不需要配置，默认开启
	optimization: {
		usedExports: true, //打包使用的模块
	},

	//plugin
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			//选择html模板
			//title: "新页面", //src/index.html 中写 <title><%= htmlWebpackPlugin.options.title %></title>
			//template: "./src/index.html",	//模板文件路径，支持加载器
			//filename: "index.html",	//输出的 HTML 文件名，默认是 index.html, 也可以直接配置带有⼦⽬录
			minify: {
				//压缩HTML文件
				removeComments: true, //移除HTML中的注释
				collapseWhitrspace: true, //删除空白符与换行符
				minifyCSS: true, //压缩内联css
			},
			/*inject: true | 'head' | 'body' | false ,注⼊所有的资源到特定的 template 或者 templateContent 中，如果设置为true 或者 body，所有的 javascript 资源将被放置到 body 元素的底部，'head' 将放置到 head 元素中。
              favicon: 添加特定的 favicon 路径到输出的 HTML ⽂件中。
              minify: {} | false , 传递 html-minifier 选项给 minify 输出hash: true | false, 如果为 true, 将添加⼀个唯⼀的 webpack 编译 hash 到所有包含的脚本和 CSS ⽂件，对于解除cache 很有⽤
            */
		}),
		// new webpack.HotModuleReplacementPlugin(),
		new OptimizeCSSAssetsPlugin({
			cssProcessor: require("cssnano"), //引入cssnano配置压缩选项
			cssProcessorOptions: {
				discardComments: { removeALL: true },
			},
		}),
		//CSS Tree Shaking
		new PurifyCSS({
			paths: glob.sync([
				//要做 CSS Tree Shaking 的路径文件
				path.resolve(__dirname, "./src/*.html"),
				path.resolve(__dirname, "./src/*.css"),
			]),
		}),
	],
	/*作用于webpack打包整个过程
      webpack的打包过程时候有钩子(生命周期概念)
      plugin可以在webpack运行到某个阶段的时候，帮你做一些事情，类似于生命周期的概念扩展插件，在webpack构建流程中的特定时机注入扩展逻辑来改变构建结果或做你想要的事情作用于整个构建过程
    */
};
```

`postcss.config.js`

```js
const autoprefixer = require("autoprefixer");
module.exports = {
	pulgins: [
		autoprefixer({
			//兼容最近两个版本和全球浏览器的市场份额大于1%的浏览器
			overrideBrowserslist: ["last 2 versions", ">1%"],
		}),
	],
};
```

loader 和 plugin 区别

loader 是个函数，plugin 是个类

### 注意：

1、热替换影响了 chunkhash 的使用，要确保 hotModuleReplacementPlugin()函数没在生产环境下执行

2、mini-css-extract-plugin 与 HMR 兼容性不好，不建议同时使用

3、一般配置下 webpack 无法将 Import css 语法打包进构建 css 文件，需用 require

4、babel-loader 只是用于连接 babel 和 webpack 的，并不会语法转换

5、postcss 依赖 cssnano，所以安装 postcss 也会安装 cssnano

6、purifycss-webpack 依赖 purify-css，都下载，使用时只需引入 purifycss-webpack

## webpack 流程

\*Compiler 编译对象 代表了完整的 webpack 环境配置

\*Compilation 资源构建 代表了一次资源版本构建

Module Factory 模块处理

Module 模块

Parser 解析

Template 模板

## webpack 优化

1、打包文件名添加 hash 或 chunkhask，利用浏览器缓存机制

2、使用 postcss-loader 和 autoprefixer，使 css3 样式兼容老版本浏览器和更多的浏览器

3、使用 url-loader，设置 limit，小体积图片资源转成 base64，可以减少图片请求

​ 弊端：(1)根据 base64 的编码原理，大小比原文件大小大 1/3

​ (2)尽管图片请求少了，但是 HTML 文件本身尺寸会变大，会影响首屏加载，所以要权衡

​ (3)base64 无法缓存，要缓存只能缓存包含 base64 的文件，比如 HTML 或者 CSS，这相比直接缓存图片要弱很多，一般 HTML 会改动频繁，所以等同于得不到缓存效益

4、loader 使用 include 和 exclude 缩小查找范围

5、配置 resolve.modules，使查找范围固定在当前目录下的 node_modules，找不到时不去向上查找

6、借助 optimize-css-assets-webpack-plugin 和 cssnano 压缩 css

7、HtmlWebpackPlugin 中设置 minify 压缩 HTML

8、tree shaking

9、code split

10、弹出框等不需要一开始就渲染的组件使用预取或预加载(prefetch/preload)

## tree shaking

## code split

```javascript
optimization: {
    splitChunks: {
        chunks: "async", //对同步 initial，异步 async，所有的模块有效 all
        minSize: 30000, //最⼩尺⼨，当模块⼤于30kb
        maxSize: 0, //对模块进⾏⼆次分割时使⽤，不推荐使⽤
        minChunks: 1, //打包⽣成的chunk⽂件最少有⼏个chunk引⽤了这个模块
        maxAsyncRequests: 5, //最⼤异步请求数，默认5
        maxInitialRequests: 3, //最⼤初始化请求书，⼊⼝⽂件同步请求，默认3
        automaticNameDelimiter: "-", //打包分割符号
        name: true, //打包后的名称，除了布尔值，还可以接收⼀个函数function
        cacheGroups: {
            //缓存组
            vendors: {
                test: /[\\/]node_modules[\\/]/,
                name: "vendor", // 要缓存的 分隔出来的 chunk 名称
                priority: -10 //缓存组优先级 数字越⼤，优先级越⾼
            },
            other: {
                chunks: "initial", // 必须三选⼀： "initial" | "all" | "async"(默认就是async)
                test: /react|lodash/, // 正则规则验证，如果符合就提取 chunk,
                name: "other",
                minSize: 30000,
                minChunks: 1
            },
            default: {
                minChunks: 2,
                priority: -20,
                reuseExistingChunk: true //可设置是否重⽤该chunk
            }
        }
    }
}
```

## hash、chunkhash、contenthash 区别

hash 是工程级别的，修改一个文件，hash 值就会变，不能利用浏览器缓存

chunkhash 是根据不同入口文件(entry)进行依赖文件解析，构建不同的 chunk，生成对应的 hash，生产环境里把一些公共库和程序入口文件区分开，单独打包构建，接着我们采用 chunkhash 的方式生成哈希值，那么只要我们不改动公共库的代码，就可以保证其哈希值不会受影响。并且 webpack4 中支持了异步 import 功能，固，chunkhash 也作用于此

将一个公共代码 import 到 js 文件里，如果 js 文件有改变，公共代码对应的 chunkhash 也会变，达不到缓存的目的

contenthash 是文件级别的，内容不变，hash 不变
