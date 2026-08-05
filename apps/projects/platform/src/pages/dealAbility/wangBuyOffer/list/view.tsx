import React, { useRef, useState } from 'react'
import Table from '@/components/TableLayout'
import { getIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { ColumnType } from 'antd/lib/table/interface'
import moment from 'moment'
import { Button, Typography } from '@linkseeks/ui'
import { wangBuyScema } from './schema/wangBuyScema'
import { postTradeAskPurchaseQuotePage } from '@apps/apis'
import { sourcingStatusList, quoteStatusList } from '../../wangBuy/constats'
import { EyeAuthButton, UrlAuthButton } from '@apps/components'
import { useWebIntl } from '@apps/locales'

const intl = getIntl()

const index = () => {
  const reload = useRef<any>({})
  const format = (text, fmt?: string) => {
    return <>{moment(text).format(fmt || 'YYYY-MM-DD HH:mm:ss')}</>
  }
  const translate = useWebIntl()
  const [rowkeys, setRowKeys] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({
        id: 'transaction_components.xuqiudanhao',
        defaultMessage: '需求单号',
      }),
      key: 'askPurchaseNo',
      dataIndex: 'askPurchaseNo',
      render: (text: any, record: any) => (
        <EyeAuthButton type="link" url={`/dealAbility/wangBuyOffer/list/detail?id=${record.askPurchaseId}`}>
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: intl.formatMessage({
        id: 'transaction_components.xuqiuzhaiyao',
        defaultMessage: '需求摘要',
      }),
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: translate('web.resource.deal.xuqiudanzhuangtai'),
      key: 'outerStatus',
      dataIndex: 'outerStatus',
      render: (text: any) => text && sourcingStatusList[text],
    },
    {
      title: intl.formatMessage({
        id: 'transaction_components.caigoushangmingcheng',
        defaultMessage: '采购商名称',
      }),
      key: 'purchaseMemberName',
      dataIndex: 'purchaseMemberName',
    },
    {
      title: intl.formatMessage({
        id: 'transaction_components.baojiajiezhishijian',
        defaultMessage: '报价截止时间',
      }),
      key: 'quoteEndTime',
      dataIndex: 'quoteEndTime',
      render: (text: any) => format(text),
    },
    {
      title: intl.formatMessage({
        id: 'transaction_components.baojiadanhao',
        defaultMessage: '报价单号',
      }),
      key: 'quoteNo',
      dataIndex: 'quoteNo',
      width: 150,
      render: (text: any, record: any) => {
        if (text) {
          return (
            <EyeAuthButton
              type="link"
              url={`/dealAbility/wangBuyOffer/inquiryOffer/waitAddOffer/detail?id=${record.quoteId}`}
            >
              {text}
            </EyeAuthButton>
          )
        }
        return '-'
      },
    },
    {
      title: intl.formatMessage({
        id: 'transaction_components.baojiashijian',
        defaultMessage: '报价时间',
      }),
      key: 'quoteTime',
      dataIndex: 'quoteTime',
      render: (text: any) => {
        return text ? format(text) : '-'
      },
    },
    {
      title: translate('web.resource.deal.baojiadanzhuangtai'),
      key: 'innerStatus',
      dataIndex: 'innerStatus',
      render: (text: any) => text && quoteStatusList[text],
    },
    {
      title: intl.formatMessage({ id: 'dealAbility.caozuo' }),
      key: 'options',
      width: 120,
      fixed: 'right',
      dataIndex: 'options',
      render: (text: any, record: any) => {
        return (
          <>
            {record?.outerStatus === 2 && !record?.innerStatus && (
              <UrlAuthButton code="/dealAbility/wangBuyOffer/inquiryOffer/waitAddOffer/add">
                <Button
                  type="link"
                  onClick={() =>
                    history.push(`/dealAbility/wangBuyOffer/inquiryOffer/waitAddOffer/add?id=${record.askPurchaseId}`)
                  }
                >
                  {intl.formatMessage({
                    id: 'transaction_components.baojia',
                    defaultMessage: '报价',
                  })}
                </Button>
              </UrlAuthButton>
            )}
          </>
        )
      },
    },
  ]

  const fetchData = (params) => {
    const payload = {
      ...params,
    }

    if (payload.outerStatus && typeof payload.outerStatus === 'string') {
      payload.outerStatusList = payload.outerStatus.split(',')
      payload.outerStatus = undefined
    }

    return new Promise((resolve) => {
      postTradeAskPurchaseQuotePage(payload, { ctlType: 'none' }).then((res) => {
        resolve(res)
      })
    })
  }

  return (
    <Table
      selectedRow
      reload={reload}
      schema={wangBuyScema}
      columns={columns}
      rowKey="askPurchaseId"
      activeKey="askPurchaseId"
      effects="askPurchaseNo"
      fetch={fetchData}
      fetchRowkeys={(e) => setRowKeys(e)}
    />
  )
}
export default index
