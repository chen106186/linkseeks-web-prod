import React, { useRef, useMemo } from 'react'
import { PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { ActionType } from '@apps/components/src/web/StandardFormTable/types'
import { Card, message } from 'antd'
import { usePageStatus } from '@/hooks/usePageStatus'
import useInitialValue from '@/pages/manufactureManage/common/hooks/useInitialValue'
import type {
  GetSettlementPlatformCouponSettlementGetPayableDetailRequest,
  GetSettlementPlatformCouponSettlementGetPayableDetailResponse,
  GetSettlementPlatformCouponSettlementPagePayableSettlementDetailRequest,
} from '@apps/apis'
import {
  getSettlementPlatformCouponSettlementGetPayableDetail,
  getSettlementPlatformCouponSettlementPagePayableSettlementDetail,
  getSettlementPlatformCouponSettlementPayableExport,
} from '@apps/apis'
import { numFormat, priceFormat } from '@/utils/numberFomat'
import { formatTimeString } from '@/utils'
import CustomizeColumn from '@/components/CustomizeColumn'
import { columns } from './common/columns'
import moment from 'moment'

const ScoreInfo: React.FC = () => {
  const ref = useRef({} as ActionType)
  const { id } = usePageStatus()
  const { initialValue } = useInitialValue<
    GetSettlementPlatformCouponSettlementGetPayableDetailResponse,
    GetSettlementPlatformCouponSettlementGetPayableDetailRequest
  >(getSettlementPlatformCouponSettlementGetPayableDetail, { id: id.toString() })
  // const { formatData } = useFormatSearch();

  const fetchListData = async (params: GetSettlementPlatformCouponSettlementPagePayableSettlementDetailRequest) => {
    const format = 'YYYY-MM-DD'
    const postData = {
      ...params,
      settlementId: id,
      orderStartTime: params.orderStartTime ? formatTimeString(params.orderStartTime, format) : null,
      orderEndTime: params.orderEndTime ? formatTimeString(params.orderEndTime, format) : null,
      payStartTime: params.payStartTime ? formatTimeString(params.payStartTime, format) : null,
      payEndTime: params.payEndTime ? formatTimeString(params.payEndTime, format) : null,
    }
    const res = await getSettlementPlatformCouponSettlementPagePayableSettlementDetail(postData as any)
    return res.data
  }

  const basicInfoColumns = useMemo(() => {
    return [
      {
        title: '结算方',
        value: initialValue?.settlementName,
      },
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

  const createDownloadLink = (blob: Blob, fileName: string) => {
    const url = window.URL.createObjectURL(blob)
    const downloadElement = document.createElement('a')
    downloadElement.style.display = 'none'
    downloadElement.href = url
    downloadElement.download = fileName
    document.body.appendChild(downloadElement)
    downloadElement.click()
    document.body.removeChild(downloadElement)
    window.URL.revokeObjectURL(url)
  }

  const handleExport = async () => {
    const loadingMsg = message.loading('正在导出', 0)
    const { response } = await getSettlementPlatformCouponSettlementPayableExport({ settlementId: id } as any, {
      responseType: 'blob',
      getResponse: true,
      ctlType: 'none',
    })
    loadingMsg()
    const blob = new Blob([response.data as any])
    const downloadFilename = `${moment().format('YYYY-MM-DD HH:mm:ss')}.xlsx` //设置导出的文件名
    createDownloadLink(blob, downloadFilename)
  }

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

export default ScoreInfo
