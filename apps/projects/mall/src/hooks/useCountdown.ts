import React from 'react'
import { useEffect } from 'react'

type COUNT_KEY = {
  /** 天 */
  d?: number
  /** 时 */
  h?: number
  /** 分 */
  m?: number
  /** 秒 */
  s?: number
}

const useCountdown = () => {
  const [count, setCount] = React.useState<COUNT_KEY>({})
  const [time, setTime] = React.useState<number>()

  const countdowm = (param: number) => {
    //获取当前时间
    const date = new Date()
    let nowTime = date.getTime()
    let endTime = param
    //时间差
    let leftTime = endTime - nowTime
    //定义变量 d,h,m,s保存倒计时的时间
    let d, h, m, s
    if (leftTime >= 0) {
      d = Math.floor(leftTime / 1000 / 60 / 60 / 24)
      h = Math.floor((leftTime / 1000 / 60 / 60) % 24)
      m = Math.floor((leftTime / 1000 / 60) % 60)
      s = Math.floor((leftTime / 1000) % 60)
    }
    if (!d && !h && !m && !s) {
      setCount({ d: 0, h: 0, m: 0, s: 0 })
      return
    }
    let resolve = { d, h, m, s }
    setCount({ ...resolve })
    setTimeout(() => {
      countdowm(param)
    }, 1000)
  }
  useEffect(() => {
    if (time) {
      countdowm(time)
    }
  }, [time])

  return {
    count,
    setTime,
  }
}

export default useCountdown
