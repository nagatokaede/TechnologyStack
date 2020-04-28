webpack
======================
是一个现代 JavaScript 应用程序的静态模块打包工具。当 webpack 处理应用程序时，它会在内部构建一个依赖图，此依赖图会映射项目所需的每个模块，并生成一个或多个 bundle

### 目录
* 安装


安装
-------------------------------------------
安装 webpack 以及 webpack-cli（此工具用于在命令行中运行 webpack）
```Bash
$ npm install webpack webpack-cli --save-dev
```

起步
-------------------------------------------
命令行启动
```Bash
# 开发环境
$ webpack [entryPath] -o [outputPath] --mode=development

# 生产环境
$ webpack [entryPath] -o [outputPath] --mode=production
```
webpack 会以 [entryPath] 为入口文件开始打包，打包之后输出到 [outputPath]

配置文件
-------------------------------------------
webpack.config.js `webpack` 的配置文件

运行环境基于 `nodejs`

启动命令
```Bahs
$ webpack --config webpack.config.js
```

webpack.config.js
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

loader
------------------------------------------
`webpack` 可以使用 `loader` 来预处理文件。这允许你打包除 `JavaScript` 之外的任何静态资源。
> webpack 只懂 js/json 。loader 就是用来翻译的

### 打包样式资源
安装 css
```Bsh
$ npm install css-loader style-loader --save-dev
```

安装 less
```Bash
$ npm install less less-loader --save-dev
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

### 打包图片资源
安装
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

### 打包其它资源
安装
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

### CSS 兼容性性处理
不同浏览器对某些 css 会有特殊前缀，这里使用 postcss 打包时自动添加这些前缀

安装
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
          /*
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
              plugins: () => {
                // postcss 插件
                require('postcss-preset-env')()
              }
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
  mode: 'development',
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

### js 语法检查 eslint
使语法风格更标准化

安装 `eslint` 语法检查
```Bash
$ npm install eslint eslint-loader --save-dev
```

安装 `airbnb` js 标准规则
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
      /*
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
  mode: 'development',
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
  }
}
```

### js 兼容性处理 `babel`
编译 js 高级语法使其兼容更多恶心的浏览器环境

安装 babel loader
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
      /*
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
  mode: 'development',
}
```

plugins
-------------------------------------------
插件是 webpack 的支柱功能。webpack 自身也是构建于，你在 webpack 配置中用到的相同的插件系统之上！

插件目的在于解决 loader 无法实现的其他事。

### 打包 `html` 资源 `html-webpack-plugin`
安装
```Bash
$ npm install html-webpack-plugin --save-dev
```
使用
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

### 提取 css 成单独文件 `mini-css-extract-plugin`
css-loader 打包 css 资源，实际是将 css 文件加载到 js 中，如此一来 css 文件将和 js 混合

在生产环境中，我们需要分离出 css 文件以减小浏览器解析效率

安装
```Bash
$ npm install mini-css-extract-plugin --save-dev
```
webpack.config.js 配置
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
  mode: 'development',
}
```

### CSS 文件压缩
压缩 css 内容为一行，使用工具 `optimize-css-assets-webpack-plugin`

安装
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
  mode: 'development',
}
```

devServer
-------------------------------------------
开发服务器 devServer：用来自动化（自动编译，自动打开浏览器，自动刷新浏览器）

特点：只会再内存中编译打包

安装
```Bash
$ npm install webpack-dev-server --save-dev
```

启动
```Bash
$ npx webpack-dev-server
```

webpack.config.js 配置
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
    open: true
  }
}
```

基本的开发环境配置
-------------------------------------------
```js
/*
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
