import React from 'react'
import { Card } from '@linkseeks/ui'
import { history } from '@linkseeks/router-manager'
import { getIntl } from '@linkseeks/i18n'
import { Button, Table } from 'antd'
import { ColumnType } from 'antd/lib/table'
import { PostTradeAskPurchasePageQuoteResponseDetail } from '@apps/apis'
const intl = getIntl()
interface basiceTableProps {
  askPurchaseQuoteGoodsResponses: PostTradeAskPurchasePageQuoteResponseDetail[]
}

const BasiceTable: React.FC<basiceTableProps> = (props: any) => {
  const { askPurchaseQuoteGoodsResponses } = props
  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({
        id: 'transaction_components.baojiadanhao',
        defaultMessage: '报价单号',
      }),
      key: 'quoteNo',
      dataIndex: 'quoteNo',
    },
    {
      title: intl.formatMessage({
        id: 'transaction_components.baojiadanzhaiyao',
        defaultMessage: '报价单摘要',
      }),
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: intl.formatMessage({
        id: 'transaction_components.baojiahuiyuan',
        defaultMessage: '报价会员',
      }),
      key: 'memberName',
      dataIndex: 'memberName',
    },
    {
      title: intl.formatMessage({
        id: 'transaction_components.baojiashijian',
        defaultMessage: '报价时间',
      }),
      key: 'billTime',
      dataIndex: 'billTime',
    },
    {
      title: intl.formatMessage({
        id: 'transaction_components.baojiazonge',
        defaultMessage: '报价总额',
      }),
      key: 'totalPriceWithTax',
      dataIndex: 'totalPriceWithTax',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.bizhong', defaultMessage: '币种' }),
      key: 'currencyName',
      dataIndex: 'currencyName',
    },
    {
      title: intl.formatMessage({
        id: 'transaction_components.lianxiren',
        defaultMessage: '联系人',
      }),
      key: 'contactName',
      dataIndex: 'contactName',
    },
    {
      title: intl.formatMessage({
        id: 'transaction_components.lianxidianhua',
        defaultMessage: '联系电话',
      }),
      key: 'contactMobile',
      dataIndex: 'contactMobile',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.caozuo', defaultMessage: '操作' }),
      key: 'details',
      dataIndex: 'details',
      render: (text: any, record: any) => {
        return (
          <Button type="link" onClick={() => history.push(`/dealAbility/wangBuy/quoteDetail?id=${record.id || 2}`)}>
            {'查看报价单'}
          </Button>
        )
      },
    },
  ]

  return (
    <Card id="basiceTable" title="报价单详情">
      <Table columns={columns} dataSource={askPurchaseQuoteGoodsResponses} pagination={false} />
    </Card>
  )
}

export default BasiceTable
