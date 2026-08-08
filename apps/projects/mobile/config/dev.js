
module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
  },
  mini: {
    webpackChain: (chain, webpack) => {
      chain.merge({
        plugin: {
          install: {
            plugin: require('terser-webpack-plugin'),
            args: [{
              terserOptions: {
                compress: true, // 默认使用terser压缩
                output: {
                  // 微信开发者工具会将 `?.1` 误解析为可选链语法
                  keep_numbers: true,
                  beautify: true,
                },
                // mangle: false,
                keep_classnames: true, // 不改变class名称
                keep_fnames: true // 不改变函数名称
              }
            }]
          }
        }
      })

      chain.merge({
        plugin: {
          install: {
            plugin: require('case-sensitive-paths-webpack-plugin'),
          }
        }
      })
    }
  },
  h5: {}
}
