import React, { Fragment, useCallback, useEffect, useState } from 'react'
import Card from '@/components/DetailLayout/components/card'

import { getIntl } from '@linkseeks/i18n'
import { Table } from 'antd'
import { format } from 'util'
import EyePreview from '@/components/EyePreview'
import { ColumnType } from 'antd/lib/table'
import { EyeAuthButton } from '@apps/components'
const intl = getIntl()
interface basiceTableProps {}

const BasiceTable: React.FC<basiceTableProps> = (props: any) => {
  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({
        id: 'transaction_components.baojiadanhao',
        defaultMessage: '报价单号',
      }),
      key: 'inquiryListNo',
      dataIndex: 'inquiryListNo',
      render: (text: any, record: any) => (
        <EyeAuthButton
          type="link"
          url={`/memberCenter/transactionAbility/productInquiry/waitAddInquiry/preview?id=${record.id}`}
        >
          {text}
        </EyeAuthButton>
      ),
    },
    {
      title: intl.formatMessage({
        id: 'transaction_components.baojiadanzhaiyao',
        defaultMessage: '报价单摘要',
      }),
      key: 'details',
      dataIndex: 'details',
    },
    {
      title: intl.formatMessage({
        id: 'transaction_components.baojiahuiyuan',
        defaultMessage: '报价会员',
      }),
      key: 'deliveryTime',
      dataIndex: 'deliveryTime',
      render: (text: any) => format(text),
    },
    {
      title: intl.formatMessage({
        id: 'transaction_components.baojiashijian',
        defaultMessage: '报价时间',
      }),
      key: 'quotationAsTime',
      dataIndex: 'quotationAsTime',
      render: (text: any) => format(text),
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.bizhong', defaultMessage: '币种' }),
      key: 'interiorState',
      dataIndex: 'interiorState',
    },
    {
      title: intl.formatMessage({
        id: 'transaction_components.baojiazonge',
        defaultMessage: '报价总额',
      }),
      key: 'details',
      dataIndex: 'details',
    },
    {
      title: intl.formatMessage({
        id: 'transaction_components.lianxiren',
        defaultMessage: '联系人',
      }),
      key: 'details',
      dataIndex: 'details',
    },
    {
      title: intl.formatMessage({
        id: 'transaction_components.lianxidianhua',
        defaultMessage: '联系电话',
      }),
      key: 'details',
      dataIndex: 'details',
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.caozuo', defaultMessage: '操作' }),
      key: 'details',
      dataIndex: 'details',
    },
  ]

  return (
    <Card
      id="basiceTable"
      title={intl.formatMessage({
        id: 'transaction_components.baojiagongyingshangxinxi',
        defaultMessage: '报价供应商信息',
      })}
    >
      <Table columns={columns} dataSource={[]} />
    </Card>
  )
}

export default BasiceTable
