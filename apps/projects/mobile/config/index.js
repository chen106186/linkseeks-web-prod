const path = require('path')
const AppConfig = require('@apps/config')
const defaultDefine = AppConfig.getEnvDefine()
const BACK_GATEWAY = defaultDefine.OUT_BACK_GATEWAY
const IM_URL = process.env.IM_URL || defaultDefine.IM_URL
console.log('代理的api网关：', BACK_GATEWAY)
console.log(process.env.IM_URL, defaultDefine.IM_URL)
const config = {
  projectName: '瓴犀小程序&amp;h5',
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
    ['@apps/ci/uploadHook'],
  ],
  env: {
    IM_URL: `"${IM_URL}"`,
  },
  defineConstants: {
    'process.env.BACK_GATEWAY': `"${BACK_GATEWAY}"`,
    IM_URL: `"${IM_URL}"`,
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
      prebundle: { enable: false, force: true }, // 开启可用有兼容性问题
    },
    // fix: 修复引入scss问题
    miniCssExtractPluginOption: {
      ignoreOrder: true,
    },
    // 开启智能提取分包依赖
    optimizeMainPackage: {
      enable: true,
      // 避免开发者工具在增量编译时漏注册单独拆出的 Babel 运行时模块。
      exclude: [
        (module) =>
          /[\\/]@babel[\\/]runtime[\\/]helpers[\\/]esm[\\/]interopRequireWildcard\.js$/.test(module.resource || ''),
      ],
    },
    commonChunks: ['taro', 'runtime', 'vendors', 'common'],
    terser: {
      config: {
        output: {
          // 微信开发者工具会将 `?.1` 误解析为可选链语法
          keep_numbers: true,
          beautify: false,
        },
      },
    },
    webpackChain(chain) {
      chain.merge({
        module: {
          rule: {
            myloader: {
              test: /\.(js|mjs)$/,
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

      chain.merge({
        plugin: {
          install: {
            plugin: require('terser-webpack-plugin'),
            args: [
              {
                terserOptions: {
                  compress: true, // 默认使用terser压缩
                  output: {
                    // 微信开发者工具会将 `?.1` 误解析为可选链语法
                    keep_numbers: true,
                    beautify: false,
                  },
                  // mangle: false,
                  keep_classnames: true, // 不改变class名称
                  keep_fnames: true, // 不改变函数名称
                },
              },
            ],
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
    webpackChain(chain, webpack) {
      chain.merge({
        module: {
          rule: {
            myloader: {
              test: /\.(js|mjs)$/,
              loader: require.resolve('babel-loader'),
            },
          },
        },
      })
      chain.plugin('ignore').use(webpack.IgnorePlugin, [
        {
          resourceRegExp: /trtc-sdk-v5/, // 忽略与 trtc-sdk-v5 相关的动态 require 警告
        },
      ])
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
    const { CIPluginOpt } = require('@apps/ci/weapp/mall')
    config.plugins.push(['@tarojs/plugin-mini-ci', CIPluginOpt])
  }
  return merge({}, config, require('./prod'))
}
