import { Row } from 'antd'
import moment from 'moment'
import { getIntl } from '@linkseeks/i18n'
import { contractTextVal } from '../../../componentSchema'
import { getWebIntl } from '@apps/locales'
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
    type: initValue.orderTypeName,
    digest: initValue.digest,
    deliverDate: initValue.consignee.deliverDate,
    theInvoiceId: initValue.invoice?.invoiceId || null,
    requisitionNo: initValue.quoteNo,
    requisitionId: initValue.quoteId,
    contractText: contractTextVal(initValue),
  }
}

/** 修改请购单下单 回显商品字段转换 */
export const procurementRenderField = (data) => {
  const _orderProductRequests = data.product.products
  return _orderProductRequests.map((item) => {
    return {
      ...item,
      logistics: item.deliverType,
      id: item.productId,
      // 冗余memberId memberRoleId查询自提地址使用
      memberId: data.vendorMemberId,
      memberRoleId: data.vendorRoleId,
      expectedDelivery: item.expectedDelivery ? moment(item.expectedDelivery) : null,
    }
  })
}

/** 采购请购单下单 字段转换 */
export const procurementProcessField = (value) => {
  value.products = value.products.map((item) => {
    return {
      ...item,
    }
  })
  return value
}

export const orderTypeLabelMap = {
  '3': getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.orderTypeLabel1' }),
  '12': getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.orderTypeLabel2' }),
  '13': getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.orderTypeLabel3' }),
  '14': getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.orderTypeLabel4' }),
}

export const memberColumns: any[] = [
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.memberId', defaultMessage: '供应商ID' }),
    dataIndex: 'memberId',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.name', defaultMessage: '供应商名称' }),
    dataIndex: 'name',
  },
  {
    title: getIntl().formatMessage({
      id: 'purchaseOrder.orderCollect.constant.lifeCycle',
      defaultMessage: '生命周期阶段',
    }),
    dataIndex: 'lifeCycleStageName',
  },
  {
    title: getIntl().formatMessage({
      id: 'purchaseOrder.orderCollect.constant.warehousingTime',
      defaultMessage: '入库时间',
    }),
    dataIndex: 'depositTime',
  },
  // {
  //   title: getIntl().formatMessage({id: 'purchaseOrder.orderCollect.constant.memberTypeName'}),
  //   dataIndex: 'memberTypeName',

  //   key: 'memberTypeName',
  // },
  // {
  //   title: getIntl().formatMessage({id: 'purchaseOrder.orderCollect.constant.roleName'}),
  //   dataIndex: 'roleName',

  //   key: 'roleName',
  // },
  // {
  //   title: getIntl().formatMessage({id: 'purchaseOrder.orderCollect.constant.levelTag'}),
  //   dataIndex: 'levelTag',

  //   key: 'levelTag',
  // },
]

// 采购请购单下单选请购单列
export const requisitionColumns: any[] = [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
    className: 'commonHide',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.requisition.requisitionNo' }),
    dataIndex: 'requisitionNo',
    key: 'requisitionNo',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.requisition.digest' }),
    dataIndex: 'digest',
    key: 'digest',
  },
  {
    title: getIntl().formatMessage({
      id: 'purchaseOrder.orderCollect.requisition.vendorMemberName',
    }),
    dataIndex: 'vendorMemberName',
    key: 'vendorMemberName',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.requisition.deliverTime' }),
    dataIndex: 'advanceDeliveryDate',
    key: 'advanceDeliveryDate',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.requisition.department' }),
    dataIndex: 'department',
    key: 'department',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.requisition.purpose' }),
    dataIndex: 'purpose',
    key: 'purpose',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.requisition.quantity' }),
    dataIndex: 'quantity',
    key: 'quantity',
  },
  {
    title: getIntl().formatMessage({
      id: 'purchaseOrder.orderCollect.requisition.transferQuantity',
    }),
    dataIndex: 'transferQuantity',
    key: 'transferQuantity',
  },
]

// 采购请购单下单 物料列表
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
    title: '行号',
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
    width: 120,
    ellipsis: true,
    key: 'name',
    render: (t, r) => `${t}/${r.spec}`,
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.requisition.category' }),
    dataIndex: 'category',
    width: 100,
    ellipsis: true,
    key: 'category',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.requisition.brand' }),
    dataIndex: 'brand',
    width: 80,
    ellipsis: true,
    key: 'brand',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.requisition.unit' }),
    dataIndex: 'unit',
    width: 60,
    ellipsis: true,
    key: 'unit',
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
    title: '期望交期',
    dataIndex: 'expectedDelivery',
    key: 'expectedDelivery',
    formItem: 'date',
    editable: true,
    width: 128,
  },
  {
    title: '承诺交期',
    dataIndex: 'promisedDeliveryDate',
    key: 'promisedDeliveryDate',
    width: 120,
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.requisition.tax' }),
    dataIndex: 'tax',
    width: 60,
    key: 'tax',
    render: (t) =>
      t ? getIntl().formatMessage({ id: 'purchaseOrder.yes' }) : getIntl().formatMessage({ id: 'purchaseOrder.no' }),
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.requisition.taxRate' }),
    dataIndex: 'taxRate',
    width: 120,
    key: 'taxRate',
    formItem: 'input',
    editable: true,
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
    forceEdit: true,
    key: 'logistics',
    formItem: 'select',
    editable: true,
    width: 120,
    render: (_text, record) => record?.deliverTypeName,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    // width: 160,
    formItem: 'remark',
    editable: true,
    width: 100,
    formItemProps: {
      type: 'text',
      maxLength: 200,
    },
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.operation' }),
    dataIndex: 'ctl',
    width: 128,
    fixed: 'right',
    key: 'ctl',
  },
]
