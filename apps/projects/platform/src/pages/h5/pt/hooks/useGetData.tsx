import { useEffect, useState } from 'react'
import { postMarketingMobileActivityOrderGroupPurchaseDetail } from '@apps/apis'

type Options = {
  id: number
}

type InfoType = {
  /** 状态（1：拼团中，2：拼团成功，3：拼团失败） */
  status: 1 | 2 | 3 | (number & {})
  /** 成团人数 */
  assembleNum: number
  /** 参团人数 */
  num: number
  /** 结束时间（秒），如果为-1则无时效限制 */
  itemList: {
    isMaster: 0 | 1 | (number & {})
    logo: string
    memberName: string
  }[]
  endTime: number
  /** 是否在团里 */
  isJoin: boolean
}

function useGetData(options: Options) {
  const [info, setInfo] = useState<null | InfoType>(null)

  useEffect(() => {
    async function getData() {
      const { code, data } = await postMarketingMobileActivityOrderGroupPurchaseDetail(
        { id: options.id },
        { ctlType: 'none' },
      )
      if (code === 1000) {
        setInfo(data as InfoType)
      }
    }
    if (options.id) {
      getData()
    }
  }, [])

  return { info }
}

export default useGetData
