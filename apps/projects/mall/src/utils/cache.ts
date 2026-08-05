// 创建一个缓存管理器
class CacheManager<T> {
  private cache: Map<string, T>

  constructor() {
    this.cache = new Map()
  }

  // 设置缓存数据
  public set(key: string, value: T): void {
    this.cache.set(key, value)
  }

  // 获取缓存数据
  public get(key: string): T | undefined {
    return this.cache.get(key)
  }

  // 检查缓存是否存在
  public has(key: string): boolean {
    return this.cache.has(key)
  }

  // 清除缓存
  public clear(): void {
    this.cache.clear()
  }
}

// 创建一个全局的缓存实例
export default new CacheManager<any>()

export const getRequestCookie = (name: string, cookie: string) => {
  const value = `; ${cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift()
  }
}
