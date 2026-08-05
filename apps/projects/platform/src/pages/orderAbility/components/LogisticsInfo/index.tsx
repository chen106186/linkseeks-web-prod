import { BaseInfo } from '@/components/BaseInfo'
import { useCallback, useEffect, useMemo } from 'react'
import NoteFactoryService from '../../assets/handles/DeliveryNoteService'
import useLogistics from '../../assets/hooks/useLogistics'
import { DeliveryTypeLabel, LogisticsCarNoLabel, LogisticsCompanyLabel, LogisticsNoLabel } from '../../constants'

const BaseInfoItem = BaseInfo.BaseInfoItem

interface LogisticsInfoProps {
  info: any
  receive?: boolean
}

function getDeliveryType(type?: number) {
  /**
   * 默认是物流
   */
  const deliveryType = new Map([
    [1, '物流'],
    [2, '自提'],
    [3, '无需配送'],
  ])
  if (!deliveryType.has(type)) {
    return deliveryType.get(1)
  }
  return deliveryType.get(type)
}

export default function LogisticsInfoBox({ info, receive = false }: LogisticsInfoProps) {
  const { isLogistics, handleLogisticsShow } = useLogistics()

  useEffect(() => {
    handleLogisticsShow(info?.deliveryType)
  }, [info])

  const showLogistics = useMemo(() => {
    if (isLogistics) {
      return (
        <>
          <BaseInfoItem label={LogisticsNoLabel}>{info?.logisticsNo}</BaseInfoItem>
          <BaseInfoItem label={LogisticsCompanyLabel}>{info?.logisticsCompany}</BaseInfoItem>
          <BaseInfoItem label={LogisticsCarNoLabel}>
            {receive ? info?.carNumbers : info?.executorVO?.carNumbers}
          </BaseInfoItem>
        </>
      )
    }
  }, [isLogistics])

  return (
    <>
      <BaseInfoItem label={DeliveryTypeLabel}>{getDeliveryType(info?.deliveryType)}</BaseInfoItem>
      {showLogistics}
    </>
  )
}
