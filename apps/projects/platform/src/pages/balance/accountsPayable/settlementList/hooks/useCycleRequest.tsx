import { postSettlementMemberSettlementCommunicationPayResult } from '@apps/apis'
import React, { useEffect, useRef, useState } from 'react'

type Options = {
  /** 间隔秒 */
  offsetTime: number
  /** 达到多少次就停止 */
  endCount: number
}

const useCycleRequest = (options: Options) => {
  const { offsetTime = 3, endCount = 10 } = options || {}
  const times = useRef(0)
  const interval = useRef<null | ReturnType<typeof setInterval>>(null)
  const [result, setResult] = useState(null)

  const start = (fn: (params) => Promise<any>, params) => {
    interval.current = setInterval(async () => {
      // const res = await postSettlementMemberSettlementCommunicationPayResult();
      const res = await fn(params)
      setResult(res)
      times.current += 1
      if (times.current > endCount) {
        cancel()
      }
    }, offsetTime * 1000)
  }

  const cancel = () => {
    if (interval.current) {
      clearInterval(interval.current)
    }
  }

  useEffect(() => {
    return () => {
      cancel()
    }
  }, [])

  return { cycleStart: start, cycleCancel: cancel, result }
}

export default useCycleRequest
