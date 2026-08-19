import { defineConfig, loadEnv, splitVendorChunkPlugin } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react-swc'
import copyPlugin from 'rollup-plugin-copy'
import viteTransformCSSModulesPlugin from '@apps/utils/vitePlugin/transformLess2module'
import terminalImportPlugin from '@apps/utils/vitePlugin/terminalImportPlugin'
import AppConfig from '@apps/config'

//环境变量的前缀
const prefix_env = 'OUT_'

export default ({ mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, './env'), prefix_env)
  const defaultDefine = AppConfig.getEnvDefine()
  const BACK_GATEWAY = defaultDefine.OUT_BACK_GATEWAY
  console.log('代理的api网关：', BACK_GATEWAY)

  return defineConfig({
    build: {
      terserOptions: {
        compress: {
          drop_console: true, // 生产环境移除console
        },
      },
      rollupOptions: {
        plugins: [
          // @ts-ignore
          copyPlugin({
            targets: [
              {
                src: ['./server.js', './pm2Build.js', './package.json', './fileCache.js', './logger.js'],
                dest: 'dist-mall',
              },
            ],
          }),
        ],
      },
    },
    define: {
      'process.env': {
        ...env,
        ...defaultDefine,
      },
    },
    server: {
      allowedHosts: true,
      proxy: {
        '/api': {
          target: BACK_GATEWAY,
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/api/, ''),
        },
        '/receiver': {
          target: 'http://10.0.1.212:8002',
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/receiver/, ''),
        },
      },
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
    },
    ssr: {
      noExternal: ['react-helmet-async', '@ant-design/plots', '@antv/*', 'tslib'],
    },
    plugins: [
      react(),
      viteTransformCSSModulesPlugin(),
      terminalImportPlugin({ includedPaths: [/request$/], mode, prefix_env }),
      splitVendorChunkPlugin(),
    ],
    resolve: {
      alias: [
        {
          find: /^~/,
          replacement: '',
        },
        {
          find: '@',
          replacement: path.resolve(__dirname, 'src'),
        },
      ],
    },
    envDir: 'env',
    envPrefix: prefix_env,
  })
}
