import React, { useRef } from 'react'
import { PageHeaderWrapper, StandardFormTable } from '@apps/components'
import { getOrderPlatformManagePayConfirmPage } from '@apps/apis'
import { formatTimeString } from '@/utils'
import type { ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { useSelfTable } from './model/useSelfTable'
import useSelectOptions from './services/hooks/useSelectOptions'

// 待确认支付结果订单
const ReadyConfirmPayList: React.FC = () => {
  const ref = useRef({} as ActionType)
  const { columns } = useSelfTable()
  const selectData = useSelectOptions()

  const fetchData = async (params) => {
    const payload = { ...params }
    if (payload.startDate) {
      payload.startDate = formatTimeString(payload.startDate, 'YYYY-MM-DD')
    }
    if (payload.endDate) {
      payload.endDate = formatTimeString(payload.endDate, 'YYYY-MM-DD')
    }
    const { data } = await getOrderPlatformManagePayConfirmPage(payload)
    return data
  }

  return (
    <PageHeaderWrapper>
      <StandardFormTable
        columns={columns}
        autoScrollX
        request={(params) => fetchData(params)}
        rowKey="orderNo"
        actionRef={ref}
        searchSelectMaps={selectData}
      />
    </PageHeaderWrapper>
  )
}

export default ReadyConfirmPayList
