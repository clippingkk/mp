const TerserPlugin = require('terser-webpack-plugin')

const config = {
  projectName: 'mp-clippingkk',
  date: '2019-3-10',
  designWidth: 750,
  deviceRatio: {
    '640': 2.34 / 2,
    '750': 1,
    '828': 1.81 / 2
  },
  framework: 'react',
  sourceRoot: 'src',
  outputRoot: 'dist',
  plugins: [
    '@tarojs/plugin-stylus',
  ],
  defineConstants: {
  },
  copy: {
    patterns: [
    ],
    options: {
    }
  },
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {
        }
      },
      url: {
        enable: true,
        config: {
          limit: 10240 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    },
    webpackChain(chain, webpack) {
      // 不知道为啥，要加上这句才能正确编译
      chain.optimization.minimizer()
      // console.log(chain.optimization.minimizer(), webpack)
      chain.merge({
        module: {
          rule: {
            md: {
              test: /\.md$/,
              use: [{
                loader: 'raw-loader',
                options: {}
              }]
            },
            graphql: {
              test: /\.(graphql|gql)$/,
              use: [{
                loader: 'graphql-tag/loader',
              }]
            }
          },
        },
      })
    }
  },
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
          browsers: [
            'last 3 versions',
            'Android >= 4.1',
            'ios >= 8'
          ]
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
