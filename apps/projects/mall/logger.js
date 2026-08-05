import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const LOG_DIR = path.join(__dirname, './logs')
const MAX_LOG_LINES = 1000
const ROTATION_SUFFIX = '.1'

// 确保日志目录存在
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true })
}

const logger = {
  info(message) {
    const logMessage = `[INFO] ${message}`
    this._writeLog(logMessage)
    if (process.env.NODE_ENV !== 'production') {
      console.log(logMessage)
    }
  },

  error(message, error) {
    const errorMessage = error ? `[ERROR] ${message}\n${error.stack}` : `[ERROR] ${message}`
    this._writeLog(errorMessage)
    if (process.env.NODE_ENV !== 'production') {
      console.error(errorMessage)
    }
  },

  warn(message) {
    const logMessage = `[WARN] ${message}`
    this._writeLog(logMessage)
    if (process.env.NODE_ENV !== 'production') {
      console.warn(logMessage)
    }
  },

  _writeLog(message) {
    const date = new Date().toISOString().split('T')[0]
    const timestamp = new Date().toISOString()
    const logFile = path.join(LOG_DIR, `app-${date}.log`)
    const logMessage = `[${timestamp}] ${message}\n`

    try {
      // 检查日志文件是否存在
      if (fs.existsSync(logFile)) {
        const content = fs.readFileSync(logFile, 'utf-8')
        const lines = content.split('\n').filter(Boolean)

        if (lines.length >= MAX_LOG_LINES) {
          // 如果超过最大行数，将当前日志文件备份
          const backupFile = logFile + ROTATION_SUFFIX
          if (fs.existsSync(backupFile)) {
            fs.unlinkSync(backupFile)
          }
          fs.renameSync(logFile, backupFile)

          // 创建新的日志文件
          fs.writeFileSync(logFile, logMessage)
        } else {
          // 追加日志
          fs.appendFileSync(logFile, logMessage)
        }
      } else {
        // 如果文件不存在，直接写入
        fs.writeFileSync(logFile, logMessage)
      }
    } catch (err) {
      console.error('写入日志失败:', err)
    }
  },

  // 清理旧日志文件
  _cleanOldLogs() {
    try {
      const files = fs.readdirSync(LOG_DIR)
      const today = new Date().toISOString().split('T')[0]

      files.forEach((file) => {
        const filePath = path.join(LOG_DIR, file)
        const stats = fs.statSync(filePath)

        // 如果是7天前的日志文件，删除它
        if (stats.isFile() && file.startsWith('app-')) {
          const fileDate = file.replace('app-', '').replace('.log', '').replace(ROTATION_SUFFIX, '')
          const diffDays = (new Date(today) - new Date(fileDate)) / (1000 * 60 * 60 * 24)

          if (diffDays > 7) {
            fs.unlinkSync(filePath)
          }
        }
      })
    } catch (err) {
      console.error('清理旧日志失败:', err)
    }
  },
}

// 每天凌晨执行一次日志清理
const now = new Date()
const night = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0)
const msToMidnight = night.getTime() - now.getTime()

setTimeout(() => {
  logger._cleanOldLogs()
  setInterval(logger._cleanOldLogs, 24 * 60 * 60 * 1000)
}, msToMidnight)

export default logger
