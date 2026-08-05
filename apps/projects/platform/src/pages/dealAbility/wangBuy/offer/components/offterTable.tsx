import React from 'react'
import { Card } from '@linkseeks/ui'
import { getIntl } from '@linkseeks/i18n'
import { Table } from 'antd'
import { ColumnType } from 'antd/lib/table'
import { useWebIntl } from '@apps/locales'

const intl = getIntl()

interface offterTableProps {
  askPurchaseQuoteGoodsResponses: any
}

const OffterTable: React.FC<offterTableProps> = (props: any) => {
  const { askPurchaseQuoteGoodsResponses } = props
  const translate = useWebIntl()

  const columns: ColumnType<any>[] = [
    {
      title: intl.formatMessage({
        id: 'transaction_components.wuliaobianhao',
        defaultMessage: '物料编号',
      }),
      key: 'goodsNo',
      dataIndex: 'goodsNo',
      width: 150,
    },
    {
      title: intl.formatMessage({
        id: 'transaction_components.wuliaomingcheng',
        defaultMessage: '物料名称',
      }),
      key: 'goodsName',
      dataIndex: 'goodsName',
      width: 150,
    },
    {
      title: intl.formatMessage({
        id: 'transaction_components.guigexinghao',
        defaultMessage: '规格型号',
      }),
      key: 'specification',
      dataIndex: 'specification',
      width: 150,
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.pinlei', defaultMessage: '品类' }),
      key: 'categoryName',
      dataIndex: 'categoryName',
      width: 150,
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.pinpai', defaultMessage: '品牌' }),
      key: 'brandName',
      dataIndex: 'brandName',
      width: 150,
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.danwei', defaultMessage: '单位' }),
      key: 'unit',
      dataIndex: 'unit',
      width: 150,
    },
    {
      title: translate('web.resource.deal.guanlianbaojiashangpin'),
      key: 'commodityName',
      dataIndex: 'commodityName',
      width: 150,
    },
    {
      title: translate('web.resource.deal.caigouqudao'),
      key: 'shopName',
      dataIndex: 'shopName',
      width: 150,
    },
    {
      title: translate('web.resource.deal.xunyuanshuliang'),
      key: 'num',
      dataIndex: 'num',
      width: 150,
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.hanshui', defaultMessage: '含税' }),
      key: 'includeTax',
      dataIndex: 'includeTax',
      width: 150,
      render: (text, record) => (text == 1 ? translate('web.common.shi') : translate('web.common.fou')),
    },
    {
      title: intl.formatMessage({ id: 'transaction_components.shuil', defaultMessage: '税率' }),
      dataIndex: 'taxRate',
      key: 'taxRate',
      width: 150,
    },
    {
      title: intl.formatMessage({
        id: 'transaction_components.danjiahanshui',
        defaultMessage: '单价(含税)',
      }),
      key: 'unitPriceWithTax',
      dataIndex: 'unitPriceWithTax',
      width: 150,
    },
    {
      title: translate('web.resource.deal.hanshuizongjia'),
      key: 'totalPriceWithTax',
      dataIndex: 'totalPriceWithTax',
      width: 150,
      render: (text: any) => <>{text}</>,
    },
    {
      title: intl.formatMessage({
        id: 'transaction_components.danjiabuhanshui',
        defaultMessage: '单价(不含税)',
      }),
      key: 'unitPriceWithoutTax',
      dataIndex: 'unitPriceWithoutTax',
      width: 150,
    },
    {
      title: translate('web.resource.deal.buhanshuizongjia'),
      key: 'totalPriceWithoutTax',
      dataIndex: 'totalPriceWithoutTax',
      width: 150,
    },
    {
      title: translate('web.resource.deal.baojiayouxiaoqi'),
      key: 'quoteStartTime',
      dataIndex: 'quoteStartTime',
      width: 200,
      render: (_, record) => (
        <div>
          <div>{record.quoteStartTime}</div>
          <div>-</div>
          <div>{record.quoteEndTime}</div>
        </div>
      ),
    },
  ]

  return (
    <Card id="offterTable" title={intl.formatMessage({ id: 'transaction_components.baojia', defaultMessage: '报价' })}>
      <Table
        columns={columns}
        dataSource={askPurchaseQuoteGoodsResponses}
        scroll={{
          x: 2000,
        }}
      />
    </Card>
  )
}

export default OffterTable
