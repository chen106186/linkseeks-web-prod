/*
 * @Author: Bill
 * @Date: 2020-10-20 09:59:50
 * @Description: 平台代收账款结算详情
 */

import React, { useRef, useEffect, useState, useMemo } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Card, PageHeader, Descriptions, Button, Tooltip } from 'antd'
import { getIntl, useIntl } from '@linkseeks/i18n'
import { getWebIntl } from '@apps/locales'
import { history } from '@linkseeks/router-manager'
import AvatarWrap from '@/components/AvatarWrap'
import NiceForm from '@/components/NiceForm'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { createFormActions } from '@apps/formily'
import StandardTable from '@/components/StandardTable'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import { detailSchema } from './schema'
import { usePageStatus } from '@/hooks/usePageStatus'
// import StatusTag from '../../components/StatusTag';
import { timeRange } from '@/utils/index'
import moment from 'moment'
import useIsExistsBrokerage from '../../hooks/useIsExistsBrokerage'
import { priceFormat } from '@/utils/numberFomat'
import add from '@/assets/imgs/add.png'
import subtraction from '@/assets/imgs/subtraction.png'
import useInitialValue from '@/hooks/useInitialValue'
import {
  getSettlementPlatformSettlementGetReceivableDetail,
  GetSettlementPlatformSettlementGetReceivableDetailResponse,
  getSettlementPlatformSettlementPageReceivableSettlementDetail,
} from '@apps/apis'
import useBalanceInfo from '../../hooks/useBalanceInfo'
import CustomizeColumn from '@/components/CustomizeColumn'
import ReturnEle from '@/components/ReturnEle'
import { QuestionCircleIcon } from '@linkseeks/icons'

const translate = getWebIntl()

const formActions = createFormActions()
const columns = [
  {
    title: getIntl().formatMessage({ id: 'balance.platformSettlement.accountReceivable.info.columns.orderNo' }),
    dataIndex: 'orderNo',
  },
  {
    title: getIntl().formatMessage({ id: 'balance.platformSettlement.accountReceivable.info.columns.orderAbstract' }),
    dataIndex: 'orderAbstract',
  },
  {
    title: getIntl().formatMessage({
      id: 'balance.platformSettlement.accountReceivable.info.columns.settlementOrderTypeName',
    }),
    dataIndex: 'settlementOrderTypeName',
  },
  {
    title: getIntl().formatMessage({ id: 'balance.platformSettlement.accountReceivable.info.columns.orderTypeName' }),
    dataIndex: 'orderTypeName',
  },
  {
    title: getIntl().formatMessage({ id: 'balance.platformSettlement.accountReceivable.info.columns.orderTime' }),
    dataIndex: 'orderTime',
  },
  {
    title: getIntl().formatMessage({ id: 'balance.platformSettlement.accountReceivable.info.columns.orderAmount' }),
    dataIndex: 'orderAmount',
    render: (text) => `${getIntl().formatMessage({ id: 'common.money' })}${priceFormat(text)}`,
  },
  {
    title: getIntl().formatMessage({ id: 'balance.platformSettlement.accountReceivable.info.columns.payTime' }),
    dataIndex: 'payTime',
  },
  {
    title: translate('web.resource.order.daishoujine'),
    width: 120,
    dataIndex: 'collectAmount',
    render: (text) => (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        {(text !== 0 && <img src={text > 0 ? add : subtraction} width={16} height={16} />) || null}
        <span style={{ marginLeft: '8px' }}>{`${getIntl().formatMessage({ id: 'common.money' })}${priceFormat(
          Math.abs(text),
        )}`}</span>
      </div>
    ),
  },
  {
    title: translate('web.resource.order.pingtaiyongjinbili'),
    dataIndex: 'ratio',
    render: (text, record) => {
      return record.ratio + '%'
    },
  },
  {
    title: '团购佣金',
    dataIndex: 'communityGroupBuyingAmount',
    render: (text) => (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <img src={subtraction} width={16} height={16} />
        <span style={{ marginLeft: '8px' }}>{`${getIntl().formatMessage({ id: 'common.money' })}${priceFormat(
          Math.abs(text),
        )}`}</span>
      </div>
    ),
  },
  {
    title: '分销佣金',
    dataIndex: 'socialDistributionAmount',
    render: (text) => (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <img src={subtraction} width={16} height={16} />
        <span style={{ marginLeft: '8px' }}>{`${getIntl().formatMessage({ id: 'common.money' })}${priceFormat(
          Math.abs(text),
        )}`}</span>
      </div>
    ),
  },
  {
    title: translate('web.resource.order.pingtaiyongjin'),
    dataIndex: 'brokerage',
    render: (text) => (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        {text < 0 && '-'}
        <span>{`${getIntl().formatMessage({ id: 'common.money' })}${priceFormat(Math.abs(text))}`}</span>
      </div>
    ),
  },
  {
    title: (
      <div>
        <span>{translate('web.resource.order.benqijiesuanjine')}</span>
        <Tooltip placement="top" title={translate('web.resource.order.jiesuanjinedengyudaishoushangpinjine')}>
          <QuestionCircleIcon color="#333" size={12} style={{ marginLeft: 4 }} />
        </Tooltip>
      </div>
    ),
    width: 130,
    dataIndex: 'settlementAmount',
    render: (text) => (
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        {(text !== 0 && <img src={text > 0 ? add : subtraction} width={16} height={16} />) || null}
        <span style={{ marginLeft: '8px' }}>{`${getIntl().formatMessage({ id: 'common.money' })}${priceFormat(
          Math.abs(text),
        )}`}</span>
      </div>
    ),
  },
]

const Info: React.FC = () => {
  const ref = useRef<any>({})
  const intl = useIntl()
  const { id, preview } = usePageStatus()
  const { retColumn } = useIsExistsBrokerage(columns, ['ratio'])
  const params = useMemo(() => {
    return id ? { id: id.toString() } : null
  }, [id])
  const { loading, initialValue } = useInitialValue<
    GetSettlementPlatformSettlementGetReceivableDetailResponse,
    { id: string }
  >(getSettlementPlatformSettlementGetReceivableDetail, params)
  const { infoList } = useBalanceInfo(initialValue, { type: 'platform' })

  const fetchListData = async (params) => {
    const postData = {
      settlementId: id,
      ...params,
    }
    ///settle/accounts/platform/settlement/pageReceivableSettlementDetail
    const res = await getSettlementPlatformSettlementPageReceivableSettlementDetail(postData)
    return res.data
  }

  /**
   * 搜索
   */
  const handleSearch = (values) => {
    const format = 'YYYY-MM-DD'
    const { payTime, orderTime, ...rest } = values
    const payTimeRange = payTime ? timeRange(values.payTime) : null
    const payStartTime = payTimeRange ? moment(payTimeRange.st).format(format) : null
    const payEndTime = payTimeRange ? moment(payTimeRange.et).format(format) : null
    const orderTimeRange = orderTime ? timeRange(values.orderTime) : null
    const orderStartTime = orderTimeRange ? moment(orderTimeRange.st).format(format) : null
    const orderEndTime = orderTimeRange ? moment(orderTimeRange.et).format(format) : null

    ref.current.reload({ ...rest, payStartTime, payEndTime, orderStartTime, orderEndTime })
  }

  return (
    <PageHeaderWrapper
      title={intl.formatMessage({
        id: 'balance.platformSettlement.accountReceivable.info.title',
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
          columns={retColumn}
          currentRef={ref}
          fetchTableData={(params: any) => fetchListData(params)}
          controlRender={
            <NiceForm
              actions={formActions}
              expressionScope={{
                exportBtn: (
                  <div>
                    {/* <Button>{intl.formatMessage({ id: 'balance.platformSettlement.accountReceivable.info.exportBtn' })}</Button> */}
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
