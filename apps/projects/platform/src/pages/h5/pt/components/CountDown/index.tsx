import React from 'react'
import useCountDown, { FormatTime } from './useCountDown'

interface Iprops {
  /** 倒计时秒数 */
  count: number
  /** 格式化 */
  format: 'DD:HH:mm:ss' | 'HH:mm:ss' | 'mm:ss'
  children?: (time: number, formatTime: FormatTime) => React.ReactNode
}

const CountDown: React.FC<Iprops> = (props: Iprops) => {
  const { count, format, children } = props
  const { time, formatedData } = useCountDown(count, format)

  return (
    <div>
      {(typeof children === 'function' && children(time as number, formatedData)) || formatedData.formatTimeString}
    </div>
  )
}

export default CountDown
