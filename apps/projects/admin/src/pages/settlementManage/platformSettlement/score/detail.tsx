import React, { useRef, useMemo } from 'react'
import { PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { Card } from 'antd'
import { usePageStatus } from '@/hooks/usePageStatus'
import useInitialValue from '@/pages/manufactureManage/common/hooks/useInitialValue'
import { formatTimeString } from '@/utils'
import type { GetSettlementPlatformScoreSettlementGetPayableDetailResponse } from '@apps/apis'
import {
  getSettlementPlatformScoreSettlementGetPayableDetail,
  getSettlementPlatformScoreSettlementPagePayableSettlementDetail,
} from '@apps/apis'
import { numFormat, priceFormat } from '@/utils/numberFomat'
import CustomizeColumn from '@/components/CustomizeColumn'
import { columns } from './common/columns'

const ScoreInfo: React.FC = () => {
  const ref = useRef({} as ActionType)
  const { id } = usePageStatus()
  const { initialValue } = useInitialValue<GetSettlementPlatformScoreSettlementGetPayableDetailResponse, any>(
    getSettlementPlatformScoreSettlementGetPayableDetail as any,
    { id: id.toString() },
  )

  const fetchListData = async (params) => {
    const format = 'YYYY-MM-DD'
    const { sourceDate, sourceDate2, ...rest } = params
    const payload: any = {
      settlementId: id,
      ...rest,
    }
    if (sourceDate) {
      const [startDate, endDate] = sourceDate.split(',')
      payload.orderStartTime = formatTimeString(+startDate, format)
      payload.orderEndTime = formatTimeString(+endDate, format)
    }
    if (sourceDate2) {
      const [startDate, endDate] = sourceDate2.split(',')
      payload.payStartTime = formatTimeString(+startDate, format)
      payload.payEndTime = formatTimeString(+endDate, format)
    }
    const res = await getSettlementPlatformScoreSettlementPagePayableSettlementDetail(payload as any)
    return res.data
  }

  const basicInfoColumns = useMemo(() => {
    return [
      {
        title: '结算日期',
        value: initialValue?.settlementDate,
      },
      {
        title: '结算单数',
        value: initialValue && numFormat(initialValue.totalCount),
      },
      {
        title: '结算状态',
        value: initialValue?.statusName,
      },
      {
        title: '结算方式',
        value: initialValue?.settlementWayName,
      },
      {
        title: '结算金额',
        value: `${initialValue && priceFormat(initialValue?.amount)}`,
      },
    ]
  }, [initialValue])

  return (
    <PageHeaderWrapper title={`结算单号：${initialValue?.settlementNo}`}>
      <CustomizeColumn data={basicInfoColumns} title="" column={3} />
      <Card style={{ marginTop: '12px' }}>
        <StandardFormTable
          columns={columns}
          autoScrollX
          request={(params) => fetchListData(params)}
          rowKey="orderNo"
          actionRef={ref}
          // searchButtons={[
          //   {
          //     children: '导出',
          //   },
          // ]}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default ScoreInfo
