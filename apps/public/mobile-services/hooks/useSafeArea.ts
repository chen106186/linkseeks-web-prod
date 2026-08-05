import { useEffect, useMemo, useState } from 'react'
import { getSystemInfo as getSystemInfoTaro } from '../utils/taro'
import { IS_WEB } from '../constants'

/**
 * https://docs.taro.zone/docs/apis/base/system/getSystemInfo
 */

/**
 * 获取底部安全距离及系统信息
 */
function useSafeArea() {
  const [systemInfo, setSystemInfo] = useState<Taro.getSystemInfo.Result>(null as unknown as Taro.getSystemInfo.Result)

  useEffect(() => {
    async function getSystemInfo() {
      const res = await getSystemInfoTaro()
      setSystemInfo(res)
    }
    getSystemInfo()
  }, [])
  const cacheSystemInfo = useMemo(() => systemInfo, [systemInfo])

  /** 直接用屏幕距离 - 安全距离 = paddingBottom */
  const safeBottomHeight = useMemo(() => {
    if (systemInfo === null || IS_WEB || !systemInfo.safeArea) {
      return 0
    }
    const {
      screenHeight,
      safeArea: { bottom },
    } = systemInfo
    return screenHeight - bottom
  }, [systemInfo])

  return {
    safeBottomHeight,
    systemInfo: cacheSystemInfo,
  }
  // return useMemo(() => systemInfo, [systemInfo]);
}

export default useSafeArea
