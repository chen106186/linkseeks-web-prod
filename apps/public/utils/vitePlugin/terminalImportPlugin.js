import { loadEnv } from 'vite'
import path from 'path'
import os from 'os'

const __dirname = path.resolve()
function terminalImportPlugin({ includedPaths = [], mode, prefix_env } = {}) {
  return {
    name: 'terminal-import-plugin',

    config(config, { mode }) {
      mode = mode
    },

    transform(code, id) {
      if (id.endsWith('.ts') || id.endsWith('.tsx')) {
        const importRegex = /import\s+.*\s+from\s+['"](\.[^'"]+)['"]/g
        const env = loadEnv(mode, path.resolve(__dirname, './env'), prefix_env)
        if (!env) {
          return code
        }
        const terminalType = env.OUT_TERMINAL
        code = code.replace(importRegex, (match, filePath) => {
          // 检查是否在传入的路径列表中
          if (!includedPaths.every((v) => v.test(filePath))) {
            return match
          }

          let terminalFilePath = path.resolve(path.dirname(id), `${filePath}.${terminalType}.ts`)
          // 兼容win 系统
          if (os.platform() === 'win32') {
            terminalFilePath = terminalFilePath.replace(/\\/g, '//')
          }

          try {
            // 检查同名且带有终端类型的文件是否存在
            require.resolve(terminalFilePath)
            return match.replace(filePath, terminalFilePath)
          } catch (error) {
            // 同名且带有终端类型的文件不存在，则继续使用原始文件路径
            return match
          }
        })
      }
      return code
    },
  }
}

export default terminalImportPlugin
