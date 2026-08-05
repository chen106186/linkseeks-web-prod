import { useCountDown, useRequest } from '@linkseeks/hooks'
import { useEffect, useMemo, useState } from 'react'
interface PhoneVerifyOptions {
  // 用户发送验证码的接口
  api: any

  // 验证码重置时间 单位 秒, 默认60秒
  codeResetTime?: number

  // 变化间隔，通常是1秒
  interval?: number
  onSendSuccess?(): void
  onSendError?(res: any): void

  // 结束时触发
  onEnd?(): void
}
/**
 * 短信验证码hook
 *
 * 用法: 传入一个获取短信的api参数即可，可通过返回值，countdown 监听数值变化
 */
const usePhoneVerify = <T>(options: PhoneVerifyOptions = { api: () => {} }) => {
  const { api, onEnd, codeResetTime = 60, onSendSuccess, onSendError } = options
  const [targetDate, setTargetDate] = useState(0)
  const { run, loading } = useRequest<any, any>(api, {
    manual: true,
    onSuccess(res) {
      if (res.code === 1000) {
        onSendSuccess && onSendSuccess()
      } else {
        onSendError && onSendError(res)
      }
      // 每次将外部传入的时间和现在时间累加
      const nowTime = new Date().getTime()
      const resetTime = codeResetTime * 1000
      setTargetDate(nowTime + resetTime)
    },
  })

  const [countdown] = useCountDown({ onEnd, targetDate })

  const start = async (payload?: any) => {
    if (payload) {
      run(payload)
    } else {
      run()
    }
  }

  const reset = () => {
    setTargetDate(0)
  }

  return {
    countdown: Math.round(countdown / 1000),
    // 发送时的loading，可用于按钮
    sendLoading: loading,
    /**
     * 是否可以发送
     * 通常也可用来控制按钮是否可点击
     */
    canSend: countdown === 0,
    start,
    reset,
  }
}

export default usePhoneVerify
