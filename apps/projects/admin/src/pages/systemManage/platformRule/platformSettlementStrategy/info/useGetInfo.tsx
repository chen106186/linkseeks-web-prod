import React, { useEffect, useState } from 'react'
import {
  getSettlementPlatformConfigGetPlatformSettlementStrategyDetail,
  GetSettlementPlatformConfigGetPlatformSettlementStrategyDetailResponse,
} from '@apps/apis'
import { message } from 'antd'

type OptionsType = {
  id: number
}

type ValueType = Omit<
  GetSettlementPlatformConfigGetPlatformSettlementStrategyDetailResponse,
  | 'settlementOrderType'
  | 'settlementWay'
  | 'status'
  | 'id'
  | 'settlementPaymentTypeName'
  | 'settlementDays'
  | 'settlementDate'
  | 'estimatedPaymentDate'
> & {
  settlementOrderType: number
  settlementWay: {
    active: number
    otherValues: [number, number]
    payDay: number | null
  }
}

const useGetInfo = (options: OptionsType) => {
  const { id } = options
  const [initialValue, setInitialValue] = useState<ValueType>(null as unknown as ValueType)

  /**
   * 进入详情页之后，初始化数据
   */
  useEffect(() => {
    if (!id) {
      return
    }
    async function getInfo() {
      const res = await getSettlementPlatformConfigGetPlatformSettlementStrategyDetail({ id: `${id}` })
      if (res.code === 1000) {
        setInitialValue({
          name: res.data.name,
          settlementOrderType: +res.data.settlementOrderType,
          memberList: res.data.memberList,
          settlementWay: {
            active: res.data.settlementWay,
            otherValues: [res.data.settlementDays, res.data.settlementDate],
            payDay: res.data.estimatedPaymentDate || null,
          },
          settlementPaymentType: res.data.settlementPaymentType,
          isDefault: +res.data.isDefault,
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
