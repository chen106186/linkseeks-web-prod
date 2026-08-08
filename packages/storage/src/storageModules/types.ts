export interface StorageModuleProps {
  servicePrefix?: string
  storageKey: string
  storageInstance?: StorageProps

  /**
   * 储存key的分隔符 默认为 _
   */
  storageSplit?: string

  /**
   * 加密类型，默认为none
   */
  cryptoType?: 'base64' | 'aes' | 'none'

  /**
   * 将get返回的结果进行转化
   */
  transformResult?(data: any): any
}

export interface StorageProps {
  setItem(key: string, value: any, options?: any): void
  getItem(key: string, options?: any): any
  removeItem(key: string, options?: any): void
}
