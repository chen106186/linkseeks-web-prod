import { useState, useEffect } from 'react'
import { systemInfo } from '@apps/mobile-services/utils/taro'

const useStatusBarHeight = () => {
  const [statusBarHeight, setStatusBarHeight] = useState<number>(44)

  useEffect(() => {
    const initStatusBarHeight = () => {
      setStatusBarHeight(systemInfo.statusBarHeight || 0)
    }

    initStatusBarHeight()
  }, [])

  return {
    statusBarHeight,
  }
}

export default useStatusBarHeight
