import React from 'react'
import { formatTimeString } from '@/utils'
import { Row } from 'antd'
import { getIntl } from '@linkseeks/i18n'
import { getWebIntl } from '@apps/locales'

const intl = getIntl()
const translate = getWebIntl()
// 简单控制价格区间的组件
// @todo 后续需要优化, 样式，目录文件等。
const PriceComp = (props) => {
  const { priceSection = {} } = props
  const priceTransKeys = Object.keys(priceSection)
  // 出现0-0 表示没有单价区间范围
  if (priceTransKeys.length === 1 && priceTransKeys[0] === '0-0') {
    return (
      <span style={{ color: '#E63F3B' }}>
        {`${translate('web.common.currencySymbol')}` + priceSection[priceTransKeys[0]]}
      </span>
    )
  }
  return (
    <div>
      {priceTransKeys.map((v) => (
        <Row key={v} justify="space-between">
          <span style={{ color: '#606266' }}>{v.replace('-', '~')}:</span>
          <span style={{ color: '#E63F3B', marginLeft: 40 }}>
            {translate('web.common.currencySymbol')}
            {priceSection[v]}
          </span>
        </Row>
      ))}
    </div>
  )
}

export enum OrderModalType {
  /**
   *  购物车下单
   */
  PURCHASE_ORDER = 5,

  /**
   *  手工下单
   */
  HAND_ORDER,

  /**
   *  询价报价下单
   */
  INQUIRY_QUOTATION_ORDER,
  /**
   * 需求报价下单
   */
  DEMAND_QUOTATION_ORDER,
  /**
   * 合并订单下单
   */
  CONSOLIDATED_ORDER,

  /**
   *  渠道直采购物车下单
   */
  CHANNEL_DIRECT_PURCHASE_ORDER,

  /**
   *  渠道直采手工下单
   */
  CHANNEL_DIRECT_MINING_ORDER,

  /**
   *  渠道现货购物车下单
   */
  CHANNEL_SPOT_PURCHASE_ORDER,

  /**
   *  渠道现货手工下单
   */
  CHANNEL_SPOT_MANUAL_ORDER,
}

/***********控制订单模式联动其他字段的数组集合 *******/
export const orderCombination = {
  // 需从外部页面传入参数生成的订单联动, 用于禁用下单模式的手动选择
  queryPageOrderModal: [
    OrderModalType.PURCHASE_ORDER,
    OrderModalType.CHANNEL_DIRECT_PURCHASE_ORDER,
    OrderModalType.CHANNEL_SPOT_PURCHASE_ORDER,
  ],
  // 是否显示报价单字段
  showQuotationNoOrder: [
    OrderModalType.INQUIRY_QUOTATION_ORDER,
    OrderModalType.DEMAND_QUOTATION_ORDER,
    OrderModalType.CONSOLIDATED_ORDER,
  ],
  // 是否显示报价单按钮
  showQuotationNoOrderBtn: [
    OrderModalType.INQUIRY_QUOTATION_ORDER,
    OrderModalType.DEMAND_QUOTATION_ORDER,
    OrderModalType.CONSOLIDATED_ORDER,
  ],
  // 是否显示供应会员按钮
  showSupplyMembersNameBtn: [
    OrderModalType.HAND_ORDER,
    OrderModalType.CHANNEL_DIRECT_MINING_ORDER,
    OrderModalType.CHANNEL_SPOT_MANUAL_ORDER,
    OrderModalType.CONSOLIDATED_ORDER,
  ],
}

// 支付方式
export const payTypeLabel = [
  {
    label: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.payTypeLabel1' }),
    value: 1,
  },
  {
    label: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.payTypeLabel2' }),
    value: 2,
  },
  {
    label: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.payTypeLabel3' }),
    value: 3,
  },
  {
    label: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.payTypeLabel4' }),
    value: 4,
  },
]

export const memberColumns: any[] = [
  {
    title: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.memberColumns.memberId' }),
    dataIndex: 'memberId',

    key: 'memberId',
  },
  {
    title: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.memberColumns.name' }),
    dataIndex: 'name',

    key: 'name',
  },
  {
    title: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.memberColumns.memberTypeName' }),
    dataIndex: 'memberTypeName',

    key: 'memberTypeName',
  },
  {
    title: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.memberColumns.roleName' }),
    dataIndex: 'roleName',

    key: 'roleName',
  },
  {
    title: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.memberColumns.levelTag' }),
    dataIndex: 'levelTag',

    key: 'levelTag',
  },
]

export const inquiryColumns: any[] = [
  {
    title: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.inquiryColumns.quotationNo' }),
    dataIndex: 'quotationNo',

    key: 'quotationNo',
  },
  {
    title: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.inquiryColumns.requisitionFormNo' }),
    dataIndex: 'requisitionFormNo',

    key: 'requisitionFormNo',
  },
  {
    title: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.inquiryColumns.quotationSummary' }),
    dataIndex: 'quotationSummary',

    key: 'quotationSummary',
  },
  {
    title: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.inquiryColumns.demandMembers' }),
    dataIndex: 'demandMembers',

    key: 'demandMembers',
  },
  {
    title: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.inquiryColumns.documentsTime' }),
    dataIndex: 'documentsTime',

    key: 'documentsTime',
    render: (_) => formatTimeString(_),
  },
]

export const paymentInformationColumns: any[] = [
  {
    title: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.paymentInformationColumns.payCount' }),
    dataIndex: 'payCount',

    key: 'payCount',
  },
  {
    title: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.paymentInformationColumns.payNode' }),
    dataIndex: 'payNode',

    key: 'payNode',
  },
  {
    title: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.paymentInformationColumns.externalState' }),
    dataIndex: 'externalState',

    key: 'externalState',
  },
  {
    title: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.paymentInformationColumns.payRatio' }),
    dataIndex: 'payRatio',
    key: 'payRatio',
    editable: true,
    forceEdit: true,
    formItem: 'input',
    formItemProps: {
      addonAfter: '%',
    },
    width: 200,
  },
  {
    title: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.paymentInformationColumns.payPrice' }),
    dataIndex: 'payPrice',

    key: 'payPrice',
    render: (t) => `${translate('web.common.currencySymbol')}${t}`,
  },
  {
    title: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.paymentInformationColumns.payWay' }),
    dataIndex: 'payWay',
    key: 'payWay',
    formItem: 'select',
    editable: true,
    forceEdit: true,
    formItemProps: {
      options: [],
    },
    width: 200,
  },
  {
    title: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.paymentInformationColumns.channel' }),
    dataIndex: 'channel',
    key: 'channel',
    formItem: 'select',
    editable: true,
    forceEdit: true,
    width: 200,
  },
]

// 商品列表
export const productInfoColumns: any[] = [
  {
    title: 'ID',
    dataIndex: 'id',

    key: 'id',
  },
  {
    title: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.productInfoColumns.name' }),
    dataIndex: 'name',

    key: 'name',
  },
  {
    title: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.productInfoColumns.customerCategoryName' }),
    dataIndex: 'customerCategoryName',

    key: 'customerCategoryName',
  },
  {
    title: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.productInfoColumns.brandName' }),
    dataIndex: 'brandName',

    key: 'brandName',
  },
  {
    title: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.productInfoColumns.unitName' }),
    dataIndex: 'unitName',

    key: 'unitName',
  },
  {
    title: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.productInfoColumns.unitPrice' }),
    dataIndex: 'unitPrice',
    align: 'left',
    key: 'unitPrice',
    render: (text) => <PriceComp priceSection={text} />,
  },
  {
    title: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.productInfoColumns.memberPrice' }),
    dataIndex: 'memberPrice',

    key: 'memberPrice',
    render: (text, record) => (record.isMemberPrice ? text : null),
  },
  {
    title: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.productInfoColumns.purchaseCount' }),
    dataIndex: 'purchaseCount',

    key: 'purchaseCount',
    formItem: 'input',
    editable: true,
    width: 140,
  },
  {
    title: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.productInfoColumns.none' }),
    dataIndex: 'none',

    key: 'none',
    render: () => intl.formatMessage({ id: 'purchaseOrder.yes' }),
  },
  {
    title: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.productInfoColumns.price' }),
    dataIndex: 'price',

    key: 'price',
    render: (t) => `${translate('web.common.currencySymbol')}${t}`,
  },
  // 接口调用
  {
    title: intl.formatMessage({ id: 'purchaseOrder.readyAddOrder.productInfoColumns.logistics' }),
    dataIndex: 'logistics',

    key: 'logistics',
    render: (text) => text.render || '',
  },
  {
    title: intl.formatMessage({ id: 'purchaseOrder.operation' }),
    dataIndex: 'ctl',

    key: 'ctl',
  },
]
