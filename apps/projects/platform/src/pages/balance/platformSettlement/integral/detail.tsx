/*
 * @Author: Bill
 * @Date: 2020-10-20 10:54:00
 * @Description: 积分结算详情页
 */

import React, { useRef, useState, useEffect, useMemo } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Card, PageHeader, Descriptions, Button } from 'antd'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import AvatarWrap from '@/components/AvatarWrap'
import NiceForm from '@/components/NiceForm'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { createFormActions } from '@apps/formily'
import StandardTable from '@/components/StandardTable'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { detailSchema } from './schema'
import { timeRange } from '@/utils/index'
import moment from 'moment'
import { usePageStatus } from '@/hooks/usePageStatus'
import useInitialValue from '@/hooks/useInitialValue'
import useBalanceInfo from '../../hooks/useBalanceInfo'
import {
  getSettlementPlatformScoreSettlementGetReceivableDetail,
  GetSettlementPlatformScoreSettlementGetReceivableDetailResponse,
  getSettlementPlatformScoreSettlementPageReceivableSettlementDetail,
} from '@apps/apis'
import CustomizeColumn from '@/components/CustomizeColumn'
import ReturnEle from '@/components/ReturnEle'

const formActions = createFormActions()

const columns = [
  {
    title: getIntl().formatMessage({ id: 'balance.platformSettlement.integral.info.columns.orderNo' }),
    dataIndex: 'orderNo',
  },
  {
    title: getIntl().formatMessage({ id: 'balance.platformSettlement.integral.info.columns.orderAbstract' }),
    dataIndex: 'orderAbstract',
  },
  {
    title: getIntl().formatMessage({ id: 'balance.platformSettlement.integral.info.columns.settlementOrderTypeName' }),
    dataIndex: 'settlementOrderTypeName',
  },
  {
    title: getIntl().formatMessage({ id: 'balance.platformSettlement.integral.info.columns.orderTime' }),
    dataIndex: 'orderTime',
  },
  {
    title: getIntl().formatMessage({ id: 'balance.platformSettlement.integral.info.columns.orderTypeName' }),
    dataIndex: 'orderTypeName',
  },
  {
    title: getIntl().formatMessage({ id: 'balance.platformSettlement.integral.info.columns.orderScore' }),
    dataIndex: 'orderScore',
  },
  {
    title: getIntl().formatMessage({ id: 'balance.platformSettlement.integral.info.columns.payScore' }),
    dataIndex: 'payScore',
  },
  {
    title: getIntl().formatMessage({ id: 'balance.platformSettlement.integral.info.columns.payTime' }),
    dataIndex: 'payTime',
  },
  {
    title: getIntl().formatMessage({ id: 'balance.platformSettlement.integral.info.columns.ratio' }),
    dataIndex: 'ratio',
    render: (text, record) => {
      return record.ratio + '%'
    },
  },
  {
    title: getIntl().formatMessage({ id: 'balance.platformSettlement.integral.info.columns.settlementAmount' }),
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
    GetSettlementPlatformScoreSettlementGetReceivableDetailResponse,
    { id: string }
  >(getSettlementPlatformScoreSettlementGetReceivableDetail, params)
  const { infoList } = useBalanceInfo(initialValue, { type: 'score' })

  const fetchListData = async (params) => {
    const postData = {
      settlementId: id,
      ...params,
    }
    const res = await getSettlementPlatformScoreSettlementPageReceivableSettlementDetail(postData)
    return res.data
  }

  /**
   * 搜索
   */
  const handleSearch = (values) => {
    const format = 'YYYY-MM-DD'
    const { payTime, orderTime, ...rest } = values
    // 支付时间
    const payTimeRange = payTime ? timeRange(values.payTime) : null
    const payStartTime = payTimeRange ? moment(payTimeRange.st).format(format) : null
    const payEndTime = payTimeRange ? moment(payTimeRange.et).format(format) : null
    // 订单时间
    const orderTimeRange = orderTime ? timeRange(values.orderTime) : null
    const orderStartTime = orderTimeRange ? moment(orderTimeRange.st).format(format) : null
    const orderEndTime = orderTimeRange ? moment(orderTimeRange.et).format(format) : null

    ref.current.reload({ ...rest, payStartTime, payEndTime, orderStartTime, orderEndTime })
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
          controlRender={
            <NiceForm
              actions={formActions}
              expressionScope={{
                exportBtn: (
                  <div>
                    {/* <Button>{intl.formatMessage({ id: 'balance.platformSettlement.integral.info.exportBtn' })}</Button> */}
                  </div>
                ),
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
