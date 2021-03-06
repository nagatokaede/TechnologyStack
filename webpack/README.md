webpack
======================
是一个现代 JavaScript 应用程序的静态模块打包工具。当 webpack 处理应用程序时，它会在内部构建一个依赖图，此依赖图会映射项目所需的每个模块，并生成一个或多个 bundle

### 目录
* [简介](#简介)
    * [Webpack五个核心概念](#webpack五个核心概念)
* [简单入门](#简单入门)
    * [初始化配置](#初始化配置)
    * [编译打包应用](#编译打包应用)
* [开发环境的基本配置](#开发环境的基本配置)
    * [创建配置文件](#创建配置文件)
    * [打包样式资源](#打包样式资源)
    * [打包HTML资源](#打包HTML资源)
    * [打包图片资源](#打包图片资源)
    * [打包其它资源](#打包其它资源)
    * [devServer](#devserver)
    * [开发环境配置](#开发环境配置)
* [生产环境的基本配置](#生产环境的基本配置)
    * [提取CSS成单独文件](#提取CSS成单独文件)
    * [CSS兼容性性处理](#CSS兼容性性处理)
    * [CSS文件压缩](#CSS文件压缩)
    * [js语法检查](#js语法检查)
    * [js兼容性处理](#js兼容性处理)
    * [js压缩](#js压缩)
    * [HTML压缩](#HTML压缩)
    * [生产环境配置](#生产环境配置)
* [优化配置](#优化配置)
    * [HMR](#HMR)
    * [sourceMap](#sourcemap)
    * [oneOf性能优化](#oneOf性能优化)
    * [缓存](#缓存)
    
* [配置详解](#配置详解)

简介
----------------------
webpack 是一种前端资源构建工具，一个静态资源打包器（module bundle）

在 webpack 看来，前端的所有资源文件（js/json/css/img/less...）都会模块处理

它将根据模块依赖关系进行静态分析，打包生成对应的静态资源（bundle）

### Webpack五个核心概念
* Entry
入口 entry 指示 webpack 以哪个文件作为入口起点开始打包，分析内部构建依赖图。

* Output
输出 output 指示 webpack 打包后的资源 bundles 输出到哪里去，以及如何命名。

* Loader
loader 让 webpack 能够处理哪些非 js 文件（webpack 本身只理解 js）

* Plugins
插件（plugins）可以用于执行更广泛的任务。包括打包优化和压缩，一直到重新定义环境中的变量等。

* Mode
模式（mode）指示 webpack 使用相应模式中的配置。

| 选项 | 描述 | 特点 |
|-----|-----|------|
|development|会将 DefinePlugin 中的 process.env.NODE_ENV 的值设置为 development 。启动 NamedChunksPlugin 和 NamedModulesPlugin。|能让代码本地调试运行的环境|
|production|会将 DefinePlugin 中的 process.env.NODE_ENV 的值设置为 production 。启动 FlagDependencyUsagePlugin， FlagIncludedChunksPlugin，ModuleConcatenationPlugin， FlagDependencyUsagePlugin，NoEmitOnErrorsPlugin， OccurrenceOrderPlugin， SideEffectsFlagPlugin 和 TerserPlugin|能让代码优化上线运行的环境|


简单入门
----------------------
###初始化配置
* 初始化 package.json
```Bash
$ npm init
```

* 安装 webpack

安装 webpack 以及 webpack-cli（此工具用于在命令行中运行 webpack）
```Bash
$ npm install webpack webpack-cli --save-dev
```

* 安装未来版本 webpack
```Bash
$ npm install webpack@next --save-dev
```

###编译打包应用
* 创建文件

默认 webpack 会直接寻找当前目录下的 webpack.config.js 文件，如果自定义名称须使用 `--config` 指定文件地址

* 运行命令
```Bash
# 开发环境
$ webpack [entryPath] -o [outputPath] --mode=development --config [filePath]
# webpack 能够编译打包 js 和 json 文件，并将 es6 语法转换成浏览器可以识别的语法

# 生产环境
$ webpack [entryPath] -o [outputPath] --mode=production --config [filePath]
# 在开发环境的基础上增加一个压缩代码功能
```
webpack 会以 [entryPath] 为入口文件开始打包，打包之后输出到 [outputPath]

* 结论

webpack 能够打包 js 和 json 文件，能将 es6 的模块语法转换成浏览器可识别语法，以及压缩代码。

* 问题

不能打包 css 、img 等文件。

不能将 es6 转换成 es5 以下语法。


开发环境的基本配置
----------------------
###创建配置文件
* 创建 webpack.config.js `webpack` 的配置文件

* webpack.config.js
```js
const { resolve } = require('path');

module.exports = {
  // 入口起点
  entry: './client/main.js',
  // 输出
  output: {
    // 输出文件名
    filename: 'build.js',
    // 输出路径
    path: resolve(__dirname, 'webapp'),
  },
  // loader
  module: {
    rules: [
      // 详细的 loader 配置
    ]
  },
  // plugins
  plugins: [
    // 详细的 plugins 配置
  ],
  // 模式
  // 开发模式 不压缩 js 代码
  mode: 'development',
  // 生产模式 压缩 js 代码
  // mode: 'production'
}
```

* 运行指令

webpack 默认查找当前路径下的 webpack.config.js 文件
```Bash
$ webpack
```

###打包样式资源
* 创建 webpack.config.js `webpack` 的配置文件

* 下载安装 loader 包
```Bash
$ npm install css-loader style-loader less-loader --save-dev
```

* 修改配置文件

webpack.config.js
```js
const { resolve } = require('path');

module.exports = {
  entry: './client/main.js',
  output: {
    filename: 'build.js',
    path: resolve(__dirname, 'webapp'),
  },
  module: {
    rules: [
      // 详细 loader 配置
      {
        // 用正则表达式匹配哪些文件
        // 不同文件配置不同 loader 处理
        test: /\.css$/,
        // 使用哪些 loader 就行处理,执行顺序从右到左
        use: [
          // 创建 style 标签，将 js 中的样式资源插入，添加到 html 的 head 中
          'style-loader',
          // 将 css 文件翻译成 commonjs 模块加载到 js 中，里面内容是样式字符串
          'css-loader'
        ]
      },
      {
        test: /\.less/,
        // 使用哪些 loader 就行处理,执行顺序从右到左
        use: [
          // 创建 style 标签，将 js 中的样式资源插入，添加到 html 的 head 中
          'style-loader',
          // 将 css 文件翻译成 commonjs 模块加载到 js 中，里面内容是样式字符串
          'css-loader',
          // 将 less 文件编译成 css 文件
          // 安装 npm install less less-loader --save-dev
          'less-loader'
        ]
      },
    ]
  },
  // plugins
  plugins: [
    // 详细的 plugins 配置
  ],
  mode: 'development'
}
```

###打包HTML资源
* 创建 webpack.config.js `webpack` 的配置文件

* 下载安装 plugin 包
```Bash
$ npm install html-webpack-plugin --save-dev
```

* 修改配置文件

webpack.config.js
```js
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './client/main.js',
  output: {
    filename: 'build.js',
    path: resolve(__dirname, 'webapp'),
  },
  module: {
    rules: [
      // 详细的 loader 配置
    ]
  },
  // plugins
  plugins: [
    // 详细的 plugins 配置
    // 创建一个 HTML 文件，自动引入打包输出的所有资源（JS/CSS）
    new HtmlWebpackPlugin({
      // 复制 ./client/index.html 文件，并自动引入打包输出所有资源（JS/CSS）
      template: './client/index.html',
      minify: {
        // 移除空格
        collapseWhitespace: true,
        // 移除注释
        removeComments: true
      }
    })
  ],
  mode: 'development'
}
```

###打包图片资源
* 创建 webpack.config.js `webpack` 的配置文件

* 下载安装 loader 包
```Bash
$ npm install url-loader file-loader html-loader --save-dev
```

webpack.config.js
```js
const { resolve } = require('path');

module.exports = {
  entry: './client/main.js',
  output: {
    filename: 'build.js',
    path: resolve(__dirname, 'webapp'),
  },
  module: {
    rules: [
      {
        // 处理图片资源
         // 问题：处理不了 html 中引入的 img 图片
        test: /\.(jpg|png|gif)$/,
        // 使用一个 loader 
        // 安装 npm install url-loader file-loader --save-dev
        // url-loader 依赖 file-loader
        loader: 'url-loader',
        options: {
          // 图片大小小于 8kb ，就会被 base64 处理，减少请求
          limit: 8 * 1024,
          // 问题：解析时出现 [Object Module] 问题
          // 原因：url-loader 默认使用 es6 模块化解析，而 html-loader 引入图片是 commonjs
          // 解决：关闭 url-loader 的 es6 模块化，使用 commonjs 解析
          esModule: false,
          // 给图片重命名
          // [hash:10] 取图片 hash 的前 10 位
          // [ext] 取文件原本的扩展名
          name: '[hash:10].[ext]'
        },
      },
      {
        test: /\.html$/,
        // 处理 html 文件中引入的 img 图片（负责引入 img，从而能被 url-loader 进行处理）
        // 安装 npm install html-loader
        loader: 'html-loader',
      }
    ]
  },
  // plugins
  plugins: [
    // 详细的 plugins 配置
  ],
  mode: 'development'
}
```

###打包其它资源
* 创建 webpack.config.js `webpack` 的配置文件

* 下载安装 loader 包
```Bash
$ npm install file-loader --save-dev
```

webpack.config.js
```js
const { resolve } = require('path');

module.exports = {
  entry: './client/main.js',
  output: {
    filename: 'build.js',
    path: resolve(__dirname, 'webapp'),
  },
  module: {
    rules: [
      // 打包其它资源（除 html、js、css 以外的资源）
      {
        // 排除  html、js、css 资源
        exclude: /\.(html|js|css)$/,
        loader: 'file-loader',
        options: {
          name: '[hash:10].[ext]'
        }
      }
    ]
  },
  // plugins
  plugins: [
    // 详细的 plugins 配置
  ],
  mode: 'development'
}
```

###devServer
开发服务器 devServer：用来自动化（自动编译，自动打开浏览器，自动刷新浏览器）

特点：只会再内存中编译打包

* 下载安装包
```Bash
$ npm install webpack-dev-server --save-dev
```

* 启动

package.json 中的 scripts 会读取 node_module 即不用再添加 npx
```Bash
$ npx webpack-dev-server
```

webpack.config.js
```js
const { resolve } = require('path');

module.exports = {
  entry: './client/main.js',
  output: {
    filename: 'build.js',
    path: resolve(__dirname, 'webapp'),
  },
  module: {
    rules: [
      // 详细的 loader 配置
    ]
  },
  // plugins
  plugins: [
    // 详细的 plugins 配置
  ],
  mode: 'development',
  devServer: {
    // 项目构建后路径
    contentBase: resolve(__dirname, 'webapp'),
    // 启动 gzip 压缩,是代码更小
    compress: true,
    // 端口号
    port: 3000,
    // 自动打开浏览器
    open: true,
  }
}
```

###开发环境配置
```js
/**
 * 开发环境配置
 *   运行项目指令
 *     webpack 会将打包结果输出
 *     npx webpack-dev-server 只会在内存中编译打包，没有输出文件
*/

const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './client/main.js',
  output: {
    filename: 'js/build.js',
    path: resolve(__dirname, 'webapp'),
  },
  module: {
    rules: [
      // 详细 loader 配置
      {
        // 处理 css 资源
        // css-loader 使 css 文件加载到 js 中
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ],
      },
      {
        // 处理 less 资源
        test: /\.less/,
        use: [ 'style-loader', 'css-loader', 'less-loader' ]
      },
      {
        // 处理图片资源
        test: /\.(jpg|png|gif)$/,
        use: 'url-loader',
        options: {
          limit: 8 * 1024,
          esModule: false,
          name: '[hash:10].[ext]',
          // 输出文件夹，基于 output 目录
          outputPath: 'media'
        },
      },
      {
        // 处理其它资源
        exclude: /\.(html|js|css|less|jpg|png|gif)$/,
        loader: 'file-loader',
        options: {
          name: '[hash:10].[ext]',
          outputPath: 'media'
        }
      }
    ]
  },
  // plugins
  plugins: [
    // 详细的 plugins 配置
    new HtmlWebpackPlugin({
      template: './client/index.html'
    }),
  ],
  devServer: {
    contentBase: resolve(__dirname, 'webapp'),
    compress: true,
    port: 3000,
    open: true
  },
  mode: 'development',
}
```


生产环境的基本配置
----------------------
###提取CSS成单独文件

css-loader 打包 css 资源，实际是将 css 文件加载到 js 中，如此一来 css 文件将和 js 混合

在生产环境中，我们需要分离出 css 文件以减小浏览器解析效率

* 下载插件
```Bash
$ npm install mini-css-extract-plugin --save-dev
```

* webpack.config.js
```js
const { resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './client/main.js',
  output: {
    filename: 'build.js',
    path: resolve(__dirname, 'webapp'),
  },
  module: {
    rules: [
      // 详细的 loader 配置
      {
        test: /\.css$/,
        use: [
          // 'style-loader',
          // MiniCssExtractPlugin.loader 取代 style-loader。
          // 作用：提取 js 中的 css 成单独文件
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
    ]
  },
  // plugins
  plugins: [
    // 详细的 plugins 配置
    new MiniCssExtractPlugin({
      // 对输出的文件重命名
      filename: 'css/build.css'
    }),
  ],
  mode: 'production',
}
```

### CSS兼容性性处理
不同浏览器对某些 css 会有特殊前缀，这里使用 postcss 打包时自动添加这些前缀

* 下载插件
```Bash
$ npm install postcss-loader postcss-preset-env --save-dev
```

webpack.config.js 配置
```js
const { resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// 设置 nodejs 环境变量
// browserslist 默认加载生产环境，开发环境须修改 nodejs 环境变量
process.env.NODE_ENV = 'development';

module.exports = {
  entry: './client/main.js',
  output: {
    filename: 'build.js',
    path: resolve(__dirname, 'webapp'),
  },
  module: {
    rules: [
      // 详细的 loader 配置
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          /**
           * css 兼容性处理： postcss -> postcss-loader postcss-preset-env
           * 
           * postcss-preset-env 帮助 postcss 找到 package.json 中 browserslist 里面的配置
           * 通过配置加载指定的 css 兼容性样式
           * 
           * "browserslist": {
           *   "development": [
           *     "last 1 chrome version",
           *     "last 1 firefox version",
           *     "last 1 safari version"
           *   ],
           *   "production": [
           *     ">0.2%",
           *     "not dead",
           *     "not op_mini_all"
           *   ]
           * }
          */
          // 使用 loader 的默认配置
          // 'postcss-loader',
          // 修改 loader 配置
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                // postcss 插件
                require('postcss-preset-env')()
              ]
            }
          }
        ]
      },
    ]
  },
  // plugins
  plugins: [
    // 详细的 plugins 配置
    new MiniCssExtractPlugin({
      // 对输出的文件重命名
      filename: 'css/build.css'
    }),
  ],
  mode: 'production',
}
```

package.json 详细查询 `browserslist`
```json
{
  "name": "vue-webapp",
  "version": "0.0.1",
  "description": "vue web app project",
  "private": true,
  "scripts": {
  },
  "author": "nagato kaede",
  "license": "ISC",
  "dependencies": {
  },
  "devDependencies": {
  },
  "browserslist": {
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ],
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini_all"
    ]
  }
}

```

### CSS文件压缩
压缩 css 内容为一行，使用工具 `optimize-css-assets-webpack-plugin`

* 下载插件
```Bash
$ npm install optimize-css-assets-webpack-plugin --save-dev
```

webpack.config.js
```js
const { resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

process.env.NODE_ENV = 'development';

module.exports = {
  entry: './client/main.js',
  output: {
    filename: 'build.js',
    path: resolve(__dirname, 'webapp'),
  },
  module: {
    rules: [
      // 详细的 loader 配置
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ]
      },
    ]
  },
  // plugins
  plugins: [
    // 详细的 plugins 配置
    new MiniCssExtractPlugin({
      // 对输出的文件重命名
      filename: 'css/build.css'
    }),
    // 压缩 CSS 文件
    new OptimizeCssAssetsWebpackPlugin(),
  ],
  mode: 'production',
}
```

###js语法检查
使语法风格更标准化

* 安装 `eslint` 语法检查
```Bash
$ npm install eslint eslint-loader --save-dev
```

* 安装 `airbnb` js 标准规则
```Bahs
$ npm install eslint-config-airbnb-base eslint-plugin-import --save-dev
```

webpack.config.js
```js
const { resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './client/main.js',
  output: {
    filename: 'build.js',
    path: resolve(__dirname, 'webapp'),
  },
  module: {
    rules: [
      // 详细的 loader 配置
      /**
       * 语法检查：eslint-loader eslint
       *   注意：只检查自己写的源代码，第三方库不检查
       *   设置检查规则：
       *     package.json 中的 eslintConfig 中设置
       *       "eslintConfig": {
       *         "extends": "airbnb-base"
       *       }
       *     airbnb --> eslint-config-airbnb-base eslint-plugin-import eslint
       */
      {
        // 只检查 js 文件
        test: /\.js$/,
        // 排除第三方库
        exclude: /node_modules/,
        // 正常来讲一个文件只能被一个 loader 处理
        // 当一个文件要被多个 loader 处理，那么一定要指定 loader 执行的优先顺序
        // 优先执行，与下一章 babel 共同处理 js 文件时配置优先顺序
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          // 自动修复 eslint 错误
          fix: true
        }
      },
    ]
  },
  // plugins
  plugins: [
    // 详细的 plugins 配置
    new MiniCssExtractPlugin({
      // 对输出的文件重命名
      filename: 'css/build.css'
    }),
  ],
  mode: 'production',
}
```

package.json
```json
{
  "name": "vue-webapp",
  "version": "0.0.1",
  "description": "vue web app project",
  "private": true,
  "scripts": {
  },
  "author": "nagato kaede",
  "license": "ISC",
  "dependencies": {
  },
  "devDependencies": {
  },
  "eslintConfig": {
    "extends": "airbnb-base"
  },
  "env": {
    "browser": true
  }
}
```

###js兼容性处理
编译 js 高级语法使其兼容更多恶心的浏览器环境

* 安装 babel loader
```Bash
$ npm install babel-loader @babel/core @babel/preset-env --save-dev
```

```js
const { resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './client/main.js',
  output: {
    filename: 'build.js',
    path: resolve(__dirname, 'webapp'),
  },
  module: {
    rules: [
      // 详细的 loader 配置
      /**
       * js 兼容性处理：babel-loader @babel/core @babel/preset-env
       *   1. 基本兼容性处理 --> @babel/preset-env
       *     问题：只能转换基本语法，如 promise 高级语法不能转换
       *   2. 全部 js 兼容性处理 --> @babel/polyfill
       *     问题：只想要解决部分兼容性问题，但是将所有兼容性代码全部引入，体积太大
       *   3. 需要做兼容性处理的就做按需加载 --> core-js
       */
      {
        // 只检查 js 文件
        test: /\.js$/,
        // 排除第三方库
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          // 预设：指示 babel 做怎么样的兼容性处理
          presets: [
            [
              '@babel/preset-env',
              {
                // 按需加载
                useBuiltIns: 'usage',
                // 指定 core-js 版本
                corejs: {
                  version: 3
                },
                // 指定兼容性做到哪些版本浏览器
                targets: {
                  chrome: '60',
                  firefox: '60',
                  ie: '9',
                  safari: '10',
                  edge: '17'
                }
              }
            ]
          ]
        }
      },
    ]
  },
  // plugins
  plugins: [
    // 详细的 plugins 配置
    new MiniCssExtractPlugin({
      // 对输出的文件重命名
      filename: 'css/build.css'
    }),
  ],
  mode: 'production',
}
```

###js压缩
打开生产环境就可以压缩 js 代码

```js
const { resolve } = require('path');

module.exports = {
  // 入口起点
  entry: './client/main.js',
  // 输出
  output: {
    // 输出文件名
    filename: 'build.js',
    // 输出路径
    path: resolve(__dirname, 'webapp'),
  },
  // loader
  module: {
    rules: [
      // 详细的 loader 配置
    ]
  },
  // plugins
  plugins: [
    // 详细的 plugins 配置
  ],
  // 模式
  // 开发模式 不压缩 js 代码
  // mode: 'development',
  // 生产模式 压缩 js 代码
  mode: 'production'
}
```

###HTML压缩
通过配置 `html-webpack-plugin` plugin 移除空格和注释来压缩 html

webpack.config.js
```js
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './client/main.js',
  output: {
    filename: 'build.js',
    path: resolve(__dirname, 'webapp'),
  },
  module: {
    rules: [
      // 详细的 loader 配置
    ]
  },
  // plugins
  plugins: [
    // 详细的 plugins 配置
    // 创建一个 HTML 文件，自动引入打包输出的所有资源（JS/CSS）
    new HtmlWebpackPlugin({
      // 复制 ./client/index.html 文件，并自动引入打包输出所有资源（JS/CSS）
      template: './client/index.html',
      minify: {
        // 移除空格
        collapseWhitespace: true,
        // 移除注释
        removeComments: true
      }
    })
  ],
  mode: 'production'
}
```

###生产环境配置
```js
const { resove } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

process.env.NODE_ENV = 'development';

const commonCssLoader = [
  MiniCssExtractPlugin.loader,
  'css-loader',
  {
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: () => [require('postcss-preset-env')]
    }
  }
];

module.exports = {
  entry: './client/main.js',
  output: {
    filename: 'js/build.js',
    path: resolve(__dirname, 'webapp'),
  },
  module: {
    rules: [
      // 详细的 loader 配置
      {
        test: /\.css$/,
        use: [...commonCssLoader],
      },
      {
        test: /\.less/,
        use: [...commonCssLoader, 'less-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          fix: true
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                useBuiltIns: 'usage',
                corejs: {
                  version: 3
                },
                targets: {
                  chrome: '60',
                  firefox: '60',
                  ie: '9',
                  safari: '10',
                  edge: '17'
                }
              }
            ]
          ]
        }
      },
    ]
  },
  // plugins
  plugins: [
    // 详细的 plugins 配置
    new HtmlWebpackPlugin({
      template: './client/index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true
      }
    }),
    new MiniCssExtractPlugin({
      filename: 'css/build.css'
    }),
    new OptimizeCssAssetsWebpackPlugin(),
  ],
  mode: 'production'
}
```
package.json
```json
{
  "name": "vue-webapp",
  "version": "0.0.1",
  "description": "vue web app project",
  "private": true,
  "scripts": {
  },
  "author": "nagato kaede",
  "license": "ISC",
  "dependencies": {
  },
  "devDependencies": {
  },
  "eslintConfig": {
    "extends": "airbnb-base"
  },
  "env": {
    "browser": true
  }
}
```


优化配置
----------------------
###HMR
热模块替换，在 `devServer` 中开启 hot 即可

webpack.config.js
```js
const { resolve } = require('path');

module.exports = {
  entry: './client/main.js',
  output: {
    filename: 'build.js',
    path: resolve(__dirname, 'webapp'),
  },
  module: {
    rules: [
      // 详细的 loader 配置
    ]
  },
  // plugins
  plugins: [
    // 详细的 plugins 配置
  ],
  mode: 'development',
  devServer: {
    // 项目构建后路径
    contentBase: resolve(__dirname, 'webapp'),
    // 启动 gzip 压缩,是代码更小
    compress: true,
    // 端口号
    port: 3000,
    // 自动打开浏览器
    open: true,
    /**
     * HMR: hot module replacement 模块热替换
     * 作用： 一个模块发生变化，只重新打包这一个模块
     *   极大提升构建速度
     *   
     * 样式文件: 可以使用 HMR 功能：因为 style-loader 内部实现了
     * js 文件：默认不能使用 HMR 功能 --> 需要修改 js 代码，添加 HMR 功能代码
     *   注意：HMR 功能对 js 的处理，只能处理非入口 js 文件的其它文件
     * HTML 文件：默认不使用 HMR 功能，同时会导致问题：html 文件不能热更新了~（不用对唯一一个html文件做 HMR 功能）
     *   解决：修改 entry 入口，将 html 文件引入
     */
    // 开启模块热替换
    hot: true,
  }
}
```

main.js
```js
if (module.hot) {
  // 一旦 module.hot 为 true ，说明开启了 HMR 功能。 --> 让 HMR 功能代码生效
  module.hot.accept('./mode.js', () => {
    // 方法会监听 mode.js 文件变化，一旦发生变化，其它模块不会重新打包构建。
    // 会执行后面的回调函数
    console.info()
  });
}
```

###sourceMap

调试代码工具

webpack.config.js
```js
const { resolve } = require('path');

module.exports = {
  entry: './client/main.js',
  output: {
    filename: 'build.js',
    path: resolve(__dirname, 'webapp'),
  },
  module: {
    rules: [
      // 详细的 loader 配置
    ]
  },
  // plugins
  plugins: [
    // 详细的 plugins 配置
  ],
  mode: 'development',
  devServer: {
    contentBase: resolve(__dirname, 'webapp'),
    compress: true,
    port: 3000,
    open: true,
    hot: true,
  },
  devtool: 'eval-source-map',
  /**
   * source-map: 一种提供源代码到构建后代码映射的技术（如果构建后代码出错了，通过映射可以追踪源代码错误）
   * 
   * 参数:
   * [inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map
   * 
   * source-map: 外部
   *   错误代码准确信息 和 源代码的错误位置
   * inline-source-map: 内联
   *   只生成一个内联 source-map
   *   错误代码准确信息 和 源代码的错误位置
   * hidden-source-map: 外部
   *   错误代码准确信息，但没有错误位置
   *   不能追踪源代码错误，只能提示到构建后代码的错误位置
   * eval-source-map: 内联
   *   每个文件都生成对应的 source-map，都在 eval
   *   错误代码准确信息 和 源代码的错误位置
   * nosources-source-map: 外部
   *   错误代码准确信息，但没有任何源代码信息
   * cheap-source-map: 外部
   *   错误代码准确信息 和 源代码的错误位置
   *   只能精确到行
   * cheap-module-source-map: 外部
   *   错误代码准确信息 和 源代码的错误位置
   *   module 会将 loader 的 source-map加入
   *   
   *   内联 和 外部的区别：1 外部生成了文件，内联没有 2. 内联构建速度更快
   *   
   *   开发环境：速度快，调试更友好
   *      速度快(eval > inline > cheap...)
   *        eval-cheap-source-map
   *        eval-source-map
   *      调试更友好
   *        source-map
   *        cheap-module-source-map
   *        cheap-source-map
   *        
   *   --> eval-source-map / eval-cheap-module-source-map
   *        
   *   生产环境：隐藏源码，调试友好
   *      内联会让代码体积更大，所以生产环境只考虑外部
   *      nosources-source-map 全隐藏
   *      hidden-source-map 只隐藏源代码，会提示构建后代码错误
   *   
   *   --> source-map / cheap-module-source-map
   */
}
```

###oneOf性能优化
```js
const { resolve } = require('path');

module.exports = {
  entry: './client/main.js',
  output: {
    filename: 'js/[hash:10].main.js',
    path: resolve(__dirname, '../webapp'),
  },
  module: {
    rules: [
      // 详细 loader 配置
      {
        // js 语法检测
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          fix: true
        }
      },
      {
        // 以下 loader 只会匹配一个
        // 注意：不能有两个匹配处理同一种类型文件
        oneOf: [
          {
            // 处理 css 资源
            test: /\.css$/,
            use: [ 'style-loader', 'css-loader' ],
          },
          {
            // 处理 less 资源
            test: /\.less/,
            use: [ 'style-loader', 'css-loader', 'less-loader' ]
          },
          {
            // 处理图片资源
            test: /\.(jpg|png|gif)$/,
            loader: 'url-loader',
            options: {
              limit: 8 * 1024,
              esModule: false,
              name: '[hash:10].[ext]',
              outputPath: 'img'
            },
          },
          {
            // 处理其它资源
            exclude: /\.(html|js|css|less|jpg|png|gif|vue)$/,
            loader: 'file-loader',
            options: {
              name: '[hash:10].[ext]',
              outputPath: 'media'
            }
          },
          {
        // js 兼容性处理 babel
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                useBuiltIns: 'usage',
                corejs: { version: 3 },
                targets: {
                  chrome: '60',
                  firefox: '60',
                  ie: '9',
                  safari: '10',
                  edge: '17'
                }
              }
            ]
          ],
          plugins: [
            ['import', {
              libraryName: 'vant',
              libraryDirectory: 'es',
              style: true
            }, 'vant']
          ]
        }
      },
        ]
      },

    ]
  },
  plugins: [
    // 详细的 plugins 配置
  ],
  devServer: {
    contentBase: resolve(__dirname, '../webapp'),
    compress: true,
    port: 3001,
    open: true
  },
  mode: 'development',
};
```

###缓存
webpack.config.js
```js
const { resolve } = require('path');

/**
 * 缓存
 *    babel 缓存
 *      cacheDirectory: true
 *      --> 让第二次打包构建速度更快
 *      
 *    文件资源缓存
 *      hash：每次 webpack 构建时会生成一个唯一的 hash 值
 *        问：因为 js 和 css 使用一个 hash 值
 *          如果重新打包会使所有缓存失效
 *      chunkhash：根据 chunk 生成 hash 值。如果打包来源同一个 chunk 那么 hash 值一样
 *        问：js 和 css 的 hash 值还是一样
 *          因为 css 是在 js 中被引入的，所属同一个 chunk
 *      contenthash：根据文件内容生成 hash 值。不同文件 hash 值一定不一样
 *        --> 让代码上线运行缓存更好使用
 */

module.exports = {
  entry: './client/main.js',
  output: {
    filename: 'js/main.[contenthash:10].js',
    path: resolve(__dirname, '../webapp'),
  },
  module: {
    rules: [
      // 详细 loader 配置
      {
        // js 语法检测
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          fix: true
        }
      },
      {
        // 以下 loader 只会匹配一个
        // 注意：不能有两个匹配处理同一种类型文件
        oneOf: [
          {
            // 处理 css 资源
            test: /\.css$/,
            use: [ 'style-loader', 'css-loader' ],
          },
          {
            // 处理 less 资源
            test: /\.less/,
            use: [ 'style-loader', 'css-loader', 'less-loader' ]
          },
          {
            // 处理图片资源
            test: /\.(jpg|png|gif)$/,
            loader: 'url-loader',
            options: {
              limit: 8 * 1024,
              esModule: false,
              name: '[contenthash:10].[ext]',
              outputPath: 'img'
            },
          },
          {
            // 处理其它资源
            exclude: /\.(html|js|css|less|jpg|png|gif|vue)$/,
            loader: 'file-loader',
            options: {
              name: '[contenthash:10].[ext]',
              outputPath: 'media'
            }
          },
          {
        // js 兼容性处理 babel
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          // babel 缓存，下一次构建时只重新处理更新的文件，使打包更快
          cacheDirectory: true,
          presets: [
            [
              '@babel/preset-env',
              {
                useBuiltIns: 'usage',
                corejs: { version: 3 },
                targets: {
                  chrome: '60',
                  firefox: '60',
                  ie: '9',
                  safari: '10',
                  edge: '17'
                },
              }
            ]
          ],
          plugins: [
            ['import', {
              libraryName: 'vant',
              libraryDirectory: 'es',
              style: true
            }, 'vant']
          ]
        }
      },
        ]
      },
    ]
  },
  plugins: [
    // 详细的 plugins 配置
  ],
  devServer: {
    contentBase: resolve(__dirname, '../webapp'),
    compress: true,
    port: 3001,
    open: true
  },
  mode: 'development',
};
```

###treeShaking
摇树，去除代码中引用但未使用的内容

* 使用方法
    * 开启生产环境 production
    * 使用 es6 语法 import 语法

webpack4 中嵌套引用无法摇下枯叶

webpack5 中能更好的摇树
    
###codeSplit
代码分割，将大的 js 拆分成多个小的 js ，使用并发请求提高页面加载速度

* 多入口拆分

* 

* import

###lazyLoading

###pwa

###多线程打包

###externals

###dll
