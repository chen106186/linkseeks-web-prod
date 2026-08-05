export abstract class BaseRepository {
  cache: Record<string, { data?: any; error?: any }> = {}

  /**
   * 当多个并发请求同时请求同一个key时，只会有一个请求被执行，其他请求都会等待该请求的结果，并从缓存中获取结果。
   *
   * 如果请求失败，则将错误标记为缓存对象的error属性，而不会影响其他请求
   */
  async getData<T>(key: string, request: () => Promise<T>): Promise<T> {
    if (this.cache[key]) {
      if (this.cache[key].error) {
        throw this.cache[key].error
      } else {
        return this.cache[key].data
      }
    }

    try {
      const promise = request()
      this.cache[key] = { data: promise }

      const data = await promise
      this.cache[key].data = data

      delete this.cache[key]

      return data
    } catch (err) {
      this.cache[key] = { error: err }
      throw err
    }
  }
}
