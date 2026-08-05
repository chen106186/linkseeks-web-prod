import { fileURLToPath } from 'url'
import fs from 'fs'
import path from 'path'

// 获取当前模块的文件路径
const __filename = fileURLToPath(import.meta.url)

// 获取当前模块的目录路径
const __dirname = path.dirname(__filename)

// 缓存文件路径
const cacheFilePath = path.join(__dirname, 'cache.json')

export function readCache() {
  if (fs.existsSync(cacheFilePath)) {
    const data = fs.readFileSync(cacheFilePath, 'utf-8')
    return JSON.parse(data)
  }
  return {}
}

// 写入缓存文件
export function writeCache(cache) {
  fs.writeFileSync(cacheFilePath, JSON.stringify(cache), 'utf-8')
}

// 设置缓存
export function setCache(key, value, ttl = 60) {
  // ttl: time to live in seconds
  const cache = readCache()
  const expires = Date.now() + ttl * 1000 // 计算过期时间
  cache[key] = { value, expires }
  writeCache(cache)
}

// 获取缓存
export function getCache(key) {
  const cache = readCache()
  const cachedItem = cache[key]
  if (cachedItem) {
    if (Date.now() < cachedItem.expires) {
      return cachedItem.value
    } else {
      delete cache[key] // 删除过期缓存
      writeCache(cache)
    }
  }
  return null
}

// 删除缓存
export function deleteCache(key) {
  const cache = readCache()
  if (cache[key]) {
    delete cache[key]
    writeCache(cache)
  }
}
