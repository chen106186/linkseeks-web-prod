import React, { useRef, useMemo } from 'react'
import { PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { Card } from 'antd'
import { usePageStatus } from '@/hooks/usePageStatus'
import useInitialValue from '@/pages/manufactureManage/common/hooks/useInitialValue'
import type { GetSettlementPlatformSettlementGetPayableDetailResponse } from '@apps/apis'
import {
  getSettlementPlatformSettlementReceivableExport,
  getSettlementPlatformSettlementGetPayableDetail,
  getSettlementPlatformSettlementPagePayableSettlementDetail,
} from '@apps/apis'
import { pendingReceiveColumns } from './columns'
import useIsExistsBrokerage from '../hooks/useIsExistsBrokerage'
import CustomizeColumn from '@/components/CustomizeColumn'
import { numFormat, priceFormat } from '@/utils/numberFomat'
import { downFileByBuffer } from '@/utils'
import { formatTimeString } from '@/utils'
import StatusTag from '@/components/StatusTag'

const Info: React.FC = () => {
  const ref = useRef({} as ActionType)
  const { id } = usePageStatus()
  const fetchParams = useRef<any>({})
  const { initialValue } = useInitialValue<GetSettlementPlatformSettlementGetPayableDetailResponse, any>(
    getSettlementPlatformSettlementGetPayableDetail as any,
    { id: id.toString() },
  )
  const { filterColumns } = useIsExistsBrokerage()

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

    fetchParams.current = { ...payload }
    const res = await getSettlementPlatformSettlementPagePayableSettlementDetail(payload)
    return res.data
  }

  const frozonColumns = useMemo(() => filterColumns(pendingReceiveColumns, ['radio']), [])
  const basicInfoColumns = useMemo(() => {
    return [
      {
        title: '结算日期',
        value: initialValue?.settlementDate,
      },
      {
        title: '单据数量',
        value: initialValue && numFormat(initialValue.totalCount),
      },
      {
        title: '结算状态',
        value: <StatusTag title={initialValue?.statusName} type="primary"></StatusTag>,
      },
      {
        title: '结算方式',
        value: initialValue?.settlementWayName,
      },
      {
        title: '代收金额',
        value: priceFormat(initialValue?.collectAmount || 0),
      },
      {
        title: '平台佣金',
        value: priceFormat(initialValue?.brokerage || 0),
      },
      {
        title: '结算金额',
        value: `${initialValue && priceFormat(initialValue?.amount)}`,
      },
    ]
  }, [initialValue])

  const handleExport = async () => {
    const p = { ...fetchParams.current }
    delete p.current
    delete p.pageSize
    let exportParams = ''
    Object.keys(p).forEach((item) => {
      if (p[item]) {
        exportParams += `&${item}=${p[item]}`
      }
    })

    getSettlementPlatformSettlementReceivableExport(
      { ...fetchParams.current },
      { responseType: 'blob', getResponse: true },
    ).then((res: any) => {
      const { response } = res
      if (response.status == 200) {
        const filename = decodeURIComponent(response.headers.get('content-disposition').split('=')[1])
        const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' })
        downFileByBuffer(blob, filename)
      }
    })
  }

  return (
    <PageHeaderWrapper title={`结算单号: ${initialValue?.settlementNo}`}>
      <CustomizeColumn data={basicInfoColumns} title="" column={3} />
      <Card style={{ marginTop: '12px' }}>
        <StandardFormTable
          columns={frozonColumns}
          autoScrollX
          request={(params) => fetchListData(params)}
          rowKey="detailId"
          actionRef={ref}
          // searchButtons={[
          //   {
          //     children: '导出',
          //     onClick() {
          //       handleExport()
          //     },
          //   },
          // ]}
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default Info
