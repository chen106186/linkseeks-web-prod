import { formatTimeString } from '@/utils'
import { Row } from 'antd'
import moment from 'moment'
import { getIntl } from '@linkseeks/i18n'
import { getWebIntl } from '@apps/locales'
import { contractTextVal } from '../../../componentSchema'

const translate = getWebIntl()

// 简单控制价格区间的组件
// @todo 后续需要优化, 样式，目录文件等。
export const PriceComp = (props) => {
  const { priceSection = {} } = props
  const priceTransKeys = Object.keys(priceSection || {})
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

export const orderTypeLabelMap = {
  '17': getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.materialOrder.type1' }),
  '18': getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.materialOrder.type2' }),
}

/** 修改请购单下单 初始值转换 */
export const procurmentRenderInit = (initValue: any) => {
  return {
    ...initValue.requirement,
    vendorMemberId: initValue.vendorMemberId,
    vendorMemberName: initValue.vendorMemberName,
    vendorRoleId: initValue.vendorRoleId,
    product: initValue.product,
    deliveryAddresId: initValue.consignee.consigneeId,
    hasInvoice: initValue.hasInvoice,
    orderId: initValue.orderId,
    orderKind: initValue.orderKind,
    orderMode: initValue.orderMode,
    orderModeName: initValue.orderModeName,
    type: orderTypeLabelMap[initValue.orderMode],
    currencyType: initValue.currencyType,
    paymentType: initValue.paymentType,
    digest: initValue.digest,
    deliverDate: initValue.consignee.deliverDate,
    theInvoiceId: initValue.invoice?.invoiceId || null,
    contractText: contractTextVal(initValue),
  }
}

/** 修改请购单下单 回显商品字段转换 */
export const procurementRenderField = (data) => {
  const _orderProductRequests = data.product.products
  return _orderProductRequests.map((item) => {
    // delete item.expectedDelivery
    return {
      ...item,
      logistics: item.deliverType,
      expectedDelivery: item.expectedDelivery ? moment(item.expectedDelivery) : null,
      id: item.productId,
      // 冗余memberId memberRoleId查询自提地址使用
      memberId: data.vendorMemberId,
      memberRoleId: data.vendorRoleId,
    }
  })
}

/** 采购请购单下单 字段转换 */
export const procurementProcessField = (value) => {
  value.products = value.products.map((item) => {
    return {
      ...item,
      expectedDelivery: formatTimeString(item.expectedDelivery, 'YYYY-MM-DD'),
    }
  })
  return value
}

export const memberColumns: any[] = [
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.memberId1' }),
    dataIndex: 'memberId',

    key: 'memberId',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.name3' }),
    dataIndex: 'name',

    key: 'name',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.fade' }),
    dataIndex: 'lifeCycleStageName',

    key: 'lifeCycleStageName',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.enter.time' }),
    dataIndex: 'depositTime',

    key: 'depositTime',
  },
]

// 采购物料下单 物料列表
export const materialInfoColumns: any[] = [
  // {
  //   title: 'ID',
  //   dataIndex: 'id',
  //   key: 'id',
  //   className: 'commonHide',
  // },
  // {
  //   title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.requisition.productId' }),
  //   dataIndex: 'productId',
  //   key: 'productId',
  //   className: 'commonHide',
  // },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.materialOrder.lineNumber' }),
    dataIndex: 'lineNumber',
    key: 'lineNumber',
    width: 80,
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.requisition.productNo' }),
    dataIndex: 'productNo',
    key: 'productNo',
    width: 80,
    ellipsis: true,
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.requisition.name' }),
    dataIndex: 'name',
    key: 'name',
    width: 120,
    ellipsis: true,
    render: (t, r) => `${t}/${r.spec}`,
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.requisition.category' }),
    dataIndex: 'category',
    key: 'category',
    width: 100,
    ellipsis: true,
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.requisition.brand' }),
    dataIndex: 'brand',
    key: 'brand',
    width: 80,
    ellipsis: true,
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.requisition.unit' }),
    dataIndex: 'unit',
    key: 'unit',
    width: 60,
    ellipsis: true,
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.requisition.price' }),
    dataIndex: 'price',
    align: 'left',
    key: 'price',
    formItem: 'input',
    editable: true,
    width: 128,
    render: (_text) => _text,
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.requisition.quantity1' }),
    dataIndex: 'quantity',
    key: 'quantity',
    formItem: 'input',
    editable: true,
    width: 128,
  },
  {
    title: translate('web.resource.order.qiwangjiaoqi'),
    dataIndex: 'expectedDelivery',
    key: 'expectedDelivery',
    formItem: 'date',
    width: 180,
    editable: true,
  },
  {
    title: translate('web.resource.order.chengnuojiaoqi'),
    dataIndex: 'promisedDeliveryDate',
    key: 'promisedDeliveryDate',
    width: 120,
  },
  {
    title: `${getIntl().formatMessage({
      id: 'purchaseOrder.orderCollect.requisition.tax',
    })}/${getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.materialOrder.taxRate' })}`,
    dataIndex: 'taxRate',
    key: 'taxRate',
    formItem: 'input',
    editable: true,
    width: 120,
    formItemProps: {
      suffix: '%',
    },
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.requisition.amount' }),
    dataIndex: 'amount',
    width: 100,
    key: 'amount',
    render: (t) => (t ? `${Number(t).toFixed(2)}` : null),
  },
  // 接口调用
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.requisition.logistics' }),
    dataIndex: 'logistics',
    key: 'logistics',
    formItem: 'select',
    width: 120,
    editable: true,
  },
  {
    title: getIntl().formatMessage({
      id: 'purchaseOrder.orderCollect.materialOrder.remark',
      defaultMessage: '标准',
    }),
    dataIndex: 'remark',
    key: 'remark',
    width: 100,
    formItem: 'input',
    editable: true,
    formItemProps: {
      type: 'text',
      maxLength: 200,
    },
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.operation' }),
    dataIndex: 'ctl',
    key: 'ctl',
    width: 128,
    fixed: 'right',
  },
]
