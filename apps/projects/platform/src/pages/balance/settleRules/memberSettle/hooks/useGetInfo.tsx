import React, { useEffect, useState } from 'react'
import {
  getSettlementPlatformConfigGetMemberSettlementStrategyDetail,
  GetSettlementPlatformConfigGetMemberSettlementStrategyDetailResponse,
} from '@apps/apis'
import { message } from 'antd'

type OptionsType = {
  id: number
}

type ValueType = Omit<
  GetSettlementPlatformConfigGetMemberSettlementStrategyDetailResponse,
  | 'settlementOrderType'
  | 'settlementWay'
  | 'status'
  | 'id'
  | 'settlementPaymentTypeName'
  | 'settlementDays'
  | 'settlementDate'
  | 'estimatedPaymentDate'
> & {
  settlementOrderType: string
  settlementWay: {
    active: number
    otherValues: [number, number]
    payDay: number | null
  }
}

const useGetInfo = (options: OptionsType) => {
  const { id } = options
  const [initialValue, setInitialValue] = useState<ValueType>(null)

  /**
   * 进入详情页之后，初始化数据
   */
  useEffect(() => {
    if (!id) {
      return
    }
    async function getInfo() {
      const res = await getSettlementPlatformConfigGetMemberSettlementStrategyDetail({ id: `${id}` })
      if (res.code === 1000) {
        setInitialValue({
          name: res.data.name,
          settlementOrderType: res.data.settlementOrderType.toString(),
          memberList: res.data.memberList,
          settlementWay: {
            active: res.data.settlementWay,
            otherValues: [res.data.settlementDays, res.data.settlementDate],
            payDay: res.data.estimatedPaymentDate || null,
          },
          settlementPaymentType: res.data.settlementPaymentType,
        })
      } else {
        message.error({ content: res.message })
      }
    }
    getInfo()
  }, [])

  return { initialValue }
}

export default useGetInfo
