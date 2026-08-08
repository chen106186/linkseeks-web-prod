export default {
  esm: 'rollup',
  cjs: 'rollup',
  cssModules: {
    generateScopedName: '[local]___[hash:base64:5]',
    globalModulePaths: [/\.global.less$/],
  },
  // extraRollupPlugins: [url({ limit: 100000 * 3, emitFiles: true, })],
  // injectCSS: false,
  // extraBabelPlugins: [
  //   ['babel-plugin-import', {
  //     libraryName: 'antd',
  //     libraryDirectory: 'es',
  //     style: true,
  //   }],
  // ],
}
