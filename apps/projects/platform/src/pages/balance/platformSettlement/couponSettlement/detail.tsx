import React, { useRef, useState, useEffect, useMemo } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Card, PageHeader, Descriptions, Button, message } from 'antd'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { getWebIntl } from '@apps/locales'
import { history } from '@linkseeks/router-manager'
import NiceForm from '@/components/NiceForm'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { createFormActions } from '@apps/formily'
import StandardTable from '@/components/StandardTable'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { detailSchema } from './schema'
import moment from 'moment'
import { usePageStatus } from '@/hooks/usePageStatus'
import useInitialValue from '@/hooks/useInitialValue'
import useBalanceInfo from '../../hooks/useBalanceInfo'
import {
  getSettlementPlatformCouponSettlementGetReceivableDetail,
  GetSettlementPlatformCouponSettlementGetReceivableDetailResponse,
  getSettlementPlatformCouponSettlementPageReceivableSettlementDetail,
  getSettlementPlatformCouponSettlementReceivableExport,
} from '@apps/apis'
import CustomizeColumn from '@/components/CustomizeColumn'
import { priceFormat } from '@/utils/numberFomat'
import ReturnEle from '@/components/ReturnEle'

const intl = getIntl()
const translate = getWebIntl()
const formActions = createFormActions()

const columns = [
  {
    title: intl.formatMessage({ id: 'balance.platformSettlement.integral.info.columns.orderNo' }),
    dataIndex: 'orderNo',
  },
  {
    title: intl.formatMessage({ id: 'balance.platformSettlement.integral.info.columns.orderAbstract' }),
    dataIndex: 'orderAbstract',
  },
  {
    title: intl.formatMessage({ id: 'balance.platformSettlement.integral.info.columns.settlementOrderTypeName' }),
    dataIndex: 'settlementOrderTypeName',
  },
  {
    title: intl.formatMessage({ id: 'balance.platformSettlement.integral.info.columns.orderTime' }),
    dataIndex: 'orderTime',
  },
  {
    title: intl.formatMessage({ id: 'balance.platformSettlement.integral.info.columns.orderTypeName' }),
    dataIndex: 'orderTypeName',
  },
  {
    title: intl.formatMessage({ id: 'balance.common.columns.productNoticecolumns.orderAmount' }),
    dataIndex: 'orderAmount',
    render: (text) => `${intl.formatMessage({ id: 'common.money' })}${priceFormat(text)}`,
  },
  {
    title: translate('web.resource.balance.youhuiquanjine'),
    dataIndex: 'couponAmount',
    render: (text) => `${intl.formatMessage({ id: 'common.money' })}${priceFormat(text)}`,
  },
  { title: intl.formatMessage({ id: 'balance.coupon.couponNo' }), dataIndex: 'couponNo' },
  {
    title: intl.formatMessage({ id: 'balance.platformSettlement.integral.info.columns.payTime' }),
    dataIndex: 'payTime',
  },
  {
    title: intl.formatMessage({ id: 'balance.platformSettlement.integral.info.columns.settlementAmount' }),
    dataIndex: 'settlementAmount',
  },
]

const Info: React.FC = () => {
  const ref = useRef<any>({})
  const intl = useIntl()
  const { id, preview } = usePageStatus()
  const params = useMemo(() => {
    return id ? { id: id.toString() } : null
  }, [id])
  const { loading, initialValue } = useInitialValue<
    GetSettlementPlatformCouponSettlementGetReceivableDetailResponse,
    { id: string }
  >(getSettlementPlatformCouponSettlementGetReceivableDetail, params)
  const { infoList } = useBalanceInfo(initialValue, { type: 'score' })

  const fetchListData = async (params) => {
    const postData = {
      settlementId: id,
      ...params,
    }
    const res = await getSettlementPlatformCouponSettlementPageReceivableSettlementDetail(postData)
    return res.data
  }

  /**
   * 搜索
   */
  const handleSearch = (values) => {
    console.log(values)
    ref.current.reload({ ...values })
  }

  const handleExport = async () => {
    const loadingMsg = message.loading('正在导出', 0)
    const { response } = await getSettlementPlatformCouponSettlementReceivableExport({ settlementId: id } as any, {
      responseType: 'blob',
      getResponse: true,
    })
    loadingMsg()
    let blob = new Blob([response.data as any])
    let downloadFilename = `${moment().format('YYYY-MM-DD HH:mm:ss')}.xlsx` //设置导出的文件名
    createDownloadLink(blob, downloadFilename)
  }

  const createDownloadLink = (blob: Blob, fileName: string) => {
    let url = window.URL.createObjectURL(blob)
    let downloadElement = document.createElement('a')
    downloadElement.style.display = 'none'
    downloadElement.href = url
    downloadElement.download = fileName
    document.body.appendChild(downloadElement)
    downloadElement.click()
    document.body.removeChild(downloadElement)
    window.URL.revokeObjectURL(url)
  }

  return (
    <PageHeaderWrapper
      title={intl.formatMessage({
        id: 'balance.platformSettlement.integral.info.title',
        data: initialValue?.settlementNo,
      })}
    >
      <div style={{ marginBottom: '16px' }}>
        <CustomizeColumn data={infoList} title="" column={3} />
      </div>
      <Card>
        <StandardTable
          tableProps={{
            rowKey: (record) => `${record.orderNo}-${record.payTime}`,
          }}
          columns={columns}
          currentRef={ref}
          fetchTableData={(params: any) => fetchListData(params)}
          keepAlive={false}
          controlRender={
            <NiceForm
              actions={formActions}
              components={{
                ExportBtn: () => {
                  return (
                    <div>
                      <Button onClick={handleExport}>
                        {intl.formatMessage({ id: 'balance.platformSettlement.integral.info.exportBtn' })}
                      </Button>
                    </div>
                  )
                },
              }}
              effects={($, actions) => {
                useStateFilterSearchLinkageEffect($, actions, 'megaLayout.topLayout.orderNo', FORM_FILTER_PATH)
              }}
              schema={detailSchema}
              onSubmit={handleSearch}
            />
          }
        />
      </Card>
    </PageHeaderWrapper>
  )
}

export default Info
