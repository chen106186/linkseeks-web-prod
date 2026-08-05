import { getCommodityMobileShopMobileShopSelect } from '@apps/apis'
import { useRequestApi } from '@linkseeks/hooks'
import Taro from '@tarojs/taro'
import { useMemo } from 'react'

const LOCAL_MALL_KEY = 'local_mall_key'

// 获取本地商城信息，如果本地存在，就不会使用默认的
export const getLocalMallInfo = () => {
  try {
    const currentMall = Taro.getStorageSync(LOCAL_MALL_KEY)
    if (currentMall) {
      return JSON.parse(currentMall)
    } else {
      return null
    }
  } catch (err) {
    return null
  }
}

export const setLocalMallInfo = (mallInfo: any) => {
  try {
    const currentMallStr = JSON.stringify(mallInfo)
    Taro.setStorageSync(LOCAL_MALL_KEY, currentMallStr)
  } catch (err) {
    console.log(err, '写入商城信息失败')
  }
}
/**
 * 初始化联营商城信息
 * 这里是通过远程接口获取，用于初始化
 */
export const useEnterMallInfo = (environment) => {
  // 2是代表移动端环境
  const { data, loading } = useRequestApi(getCommodityMobileShopMobileShopSelect, {
    defaultParams: [{ environment }],
  })

  const mallList = useMemo(() => {
    return data?.shopSelectList || []
  }, [data])

  const defaultCurrentMall = useMemo(() => {
    return mallList?.[0] || {}
  }, [mallList])

  return {
    mallList,
    mallLoading: loading,
    defaultCurrentMall,
  }
}
