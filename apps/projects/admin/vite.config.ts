import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
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
    base: mode === 'production' ? '/admin/' : '/',
    build: {
      // rollupOptions: {
      //   output: {
      //     // 疑似可以解决线上环境 构建后会出现文件404情况
      //     // https://github.com/vitejs/vite/issues/6773
      //     // 但似乎官方并没有解决
      //     entryFileNames: 'assets/[name].js',
      //   },
      // },
    },
    define: {
      'process.env': {
        ...env,
        ...defaultDefine,
      },
    },
    server: {
      host: true,
      port: 4399,
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
    plugins: [
      react(),
      viteTransformCSSModulesPlugin(),
      /**
       * 对项目进行tree shaking， 注意这里只对开发环境生效。
       * 要自行进行备注需要tree shaking的包
       * 生产环境本身就已经进行了tree shaking， 这里是vite和webpack的差异
       */
      terminalImportPlugin({ includedPaths: [/request$/], mode, prefix_env }),
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
