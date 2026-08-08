const path = require('path')
const AppConfig = require('@apps/config')
const defaultDefine = AppConfig.getEnvDefine()
const BACK_GATEWAY = defaultDefine.OUT_BACK_GATEWAY
console.log('代理的api网关：', BACK_GATEWAY)

const config = {
  projectName: '业务员小程序',
  date: '2021-9-9',
  designWidth: 375,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
    375: 2 / 1,
  },
  sourceRoot: 'src',
  outputRoot: `dist/${process.env.TARO_ENV}`,
  plugins: [
    ['@tarojs/plugin-platform-weapp'],
    [
      '@tarojs/plugin-http',
      {
        disabledFormData: false,
        disabledBlob: false,
      },
    ],
  ],
  defineConstants: {
    'process.env.BACK_GATEWAY': `"${BACK_GATEWAY}"`,
  },
  alias: {
    '@': path.resolve(__dirname, '..', 'src/'),
    '@api': path.resolve(__dirname, '..', 'api.config.ts'),
  },
  copy: {
    patterns: [],
    options: {},
  },
  framework: 'react',
  mini: {
    compiler: {
      type: 'webpack5',
      // 仅 webpack5 支持依赖预编译配置
      // prebundle: {
      //   enable: true,
      // },
    },
    // fix: 修复引入scss问题
    miniCssExtractPluginOption: {
      ignoreOrder: true,
    },
    // 开启智能提取分包依赖
    optimizeMainPackage: {
      enable: true,
    },
    commonChunks: ['taro', 'runtime', 'vendors', 'common'],
    webpackChain(chain) {
      chain.merge({
        module: {
          rule: {
            myloader: {
              test: /\.js$/,
              loader: require.resolve('babel-loader'),
            },
          },
        },
        optimization: {
          runtimeChunk: {
            name: 'runtime',
          },
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              common: {
                minChunks: 2,
                priority: 1,
              },
            },
          },
        },
      })
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {},
      },
      url: {
        enable: true,
        config: {
          limit: 1024, // 设定转换尺寸上限
        },
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
  },
  h5: {
    compiler: {
      type: 'webpack5',
      // 仅 webpack5 支持依赖预编译配置
      prebundle: {
        enable: false,
      },
    },
    publicPath: '/',
    staticDirectory: 'static',
    router: { mode: 'hash' }, // 'hash' | 'browser'
    webpackChain(chain) {
      chain.merge({
        module: {
          rule: {
            myloader: {
              test: /\.js$/,
              loader: require.resolve('babel-loader'),
            },
          },
        },
      })
    },
    miniCssExtractPluginOption: { ignoreOrder: true },
    postcss: {
      // 修复3.6后h5尺寸问题
      // https://github.com/NervJS/taro/issues/14085
      pxtransform: {
        enable: true,
        config: {
          baseFontSize: 23.4375,
          replace: false,
        },
      },
      autoprefixer: {
        enable: true,
        config: {},
      },
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]',
        },
      },
    },
    devServer: {
      hot: false,
      proxy: {
        '/api': {
          target: BACK_GATEWAY,
          pathRewrite: { '^/api': '' },
          changeOrigin: true,
        },
      },
    },
  },
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  if (process.env.MP_APPID) {
    const { CIPluginOpt } = require('@apps/ci/weapp/sale')
    config.plugins.push(['@tarojs/plugin-mini-ci', CIPluginOpt])
  }
  return merge({}, config, require('./prod'))
}
