import { MemoryStorageModule } from '@linkseeks/storage'
import { useRef } from 'react'

export interface cacheQueryType {
  sort?: any
  filter?: any
  search?: any
  pagination?: any
  // 筛选状态
  filterState?: boolean
}

export interface cacheQueryOptions {}

const tableCacheQueryMemory = new MemoryStorageModule<cacheQueryType>()

/**
 * 缓存查询参数
 *
 */
const useCacheQuery = () => {
  const cacheDataRef = useRef(tableCacheQueryMemory)

  const setCacheData = (key: string, value: cacheQueryType) => {
    const result = getCacheData(key)
    if (result) {
      cacheDataRef.current.setItem(key, {
        ...result,
        ...value,
      })
    } else {
      cacheDataRef.current.setItem(key, value)
    }
  }

  const getCacheData = (key: string) => {
    return cacheDataRef.current.getItem(key)
  }

  const getAllCacheData = () => {
    return cacheDataRef.current.getAllItems()
  }

  const removeCacheData = (key: string) => {
    cacheDataRef.current.removeItem(key)
  }

  const removeAllCacheData = () => {
    cacheDataRef.current.removeAllItem()
  }

  return {
    setCacheData,
    getCacheData,
    getAllCacheData,
    removeCacheData,
    removeAllCacheData,
  }
}

export default useCacheQuery
