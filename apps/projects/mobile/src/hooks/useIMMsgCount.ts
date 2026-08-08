import { getSupportTimGetUnreadMsgNum } from '@apps/apis'
import { useEffect, useRef, useState } from 'react'

export const useIMMsgCount = (auth) => {
  const [unReadCount, setUnReadCount] = useState(0)
  const intervalTimer = useRef<any>(null)

  const intervalUnRead = async () => {
    // 接口报错了之后 就清除定时器，不再请求
    if (!auth) {
      // 未登录不发起请求
      clearUnReadInterval()
      return
    }
    try {
      const { data: unReadCount, code } = await getSupportTimGetUnreadMsgNum({}, { ctlType: 'none' })
      if (code !== 1000) {
        // 未配置IM不发起请求
        clearUnReadInterval()
        return
      }
      setUnReadCount(unReadCount)
    } catch (err) {
      clearUnReadInterval()
    } finally {
      if (intervalTimer.current) {
        intervalTimer.current = setTimeout(() => {
          intervalUnRead()
        }, 5000)
      }
    }
  }

  const dispatchUnRead = async () => {
    clearUnReadInterval()
    intervalTimer.current = true
    await intervalUnRead()
    intervalUnRead()
  }

  const clearUnReadInterval = () => {
    clearInterval(intervalTimer.current)
    intervalTimer.current = null
  }

  useEffect(() => {
    return () => {
      clearUnReadInterval()
    }
  }, [])

  return {
    unReadCount,
    dispatchUnRead,
    clearUnReadInterval,
  }
}
