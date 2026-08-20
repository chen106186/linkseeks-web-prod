module.exports = {
  env: {
    NODE_ENV: '"development"',
  },
  defineConstants: {},
  mini: {
    webpackChain: (chain, webpack) => {
      chain.optimization.minimize(true)
      chain.optimization.minimizer('terser').use(require('terser-webpack-plugin'), [
        {
          terserOptions: {
            compress: true,
            output: {
              keep_numbers: true,
              beautify: false,
            },
            keep_classnames: false,
            keep_fnames: false,
          },
        },
      ])

      chain.merge({
        plugin: {
          install: {
            plugin: require('case-sensitive-paths-webpack-plugin'),
          },
        },
      })
    },
  },
  h5: {},
}
