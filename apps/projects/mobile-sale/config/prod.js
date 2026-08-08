module.exports = {
  env: {
    NODE_ENV: '"production"',
  },
  defineConstants: {},
  mini: {},
  h5: {
    /**
     * 如果h5端编译后体积过大，可以使用webpack-bundle-analyzer插件对打包体积进行分析。
     * 参考代码如下：
     * webpackChain (chain) {
     *   chain.plugin('analyzer')
     *     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
     * }
     */
    output: {
      filename: '[name].[hash].js',
      chunkFilename: '[name].[chunkhash].js',
    },
    imageUrlLoaderOption: {
      limit: 5000,
      name: 'static/images/[name].[hash].[ext]',
    },
    miniCssExtractPluginOption: {
      filename: 'css/[name].[hash].css',
      chunkFilename: 'css/[name].[chunkhash].css',
    },
  },
}
