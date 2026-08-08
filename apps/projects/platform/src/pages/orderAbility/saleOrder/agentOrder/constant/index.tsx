import { formatTimeString } from '@/utils'
import { Row } from 'antd'
import { AddressPop } from '@/pages/orderAbility/components/addressPop'
import { getIntl } from '@linkseeks/i18n'

// 简单控制价格区间的组件
// @todo 后续需要优化, 样式，目录文件等。
export const PriceComp = (props) => {
  const { priceSection = {} } = props
  const priceTransKeys = Object.keys(priceSection || {})
  // 出现0-0 表示没有单价区间范围
  if (priceTransKeys.length === 1 && priceTransKeys[0] === '0-0') {
    return (
      <span style={{ color: '#E63F3B' }}>
        {getIntl().formatMessage({ id: 'common.money' }) + priceSection[priceTransKeys[0]]}
      </span>
    )
  }
  return (
    <div>
      {priceTransKeys.map((v) => (
        <Row key={v} justify="space-between">
          <span style={{ color: '#606266' }}>{v.replace('-', '~')}:</span>
          <span style={{ color: '#E63F3B', marginLeft: 40 }}>
            {getIntl().formatMessage({ id: 'common.money' })}
            {priceSection[v]}
          </span>
        </Row>
      ))}
    </div>
  )
}

/**代客下单 初始值转换 */
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
    quoteNo: initValue.quoteNo,
    quoteId: initValue.quoteId,
    shopId: initValue.shopId,
    payments: initValue.payments,
  }
}

/** 代客下单 回显商品字段转换 */
export const procurementRenderField = (data) => {
  const _orderProductRequests = data.product.products
  return _orderProductRequests.map((item) => {
    return {
      ...item,
      commodityId: item.productId,
      productId: item.skuId,
      productName: item.name,
      logistics: item.deliverType,
      deliveryType: item.deliverType,
      unitPrice: item.price,
      purchaseCount: item.quantity,
      taxInclusive: item.tax,
      money: item.amount,
      imgUrl: item.logo,
      stockCount: item.stock,
      // 冗余memberId memberRoleId查询自提地址使用
      memberId: data.vendorMemberId,
      memberRoleId: data.vendorRoleId,
      // 冗余运费
      freight: data.product.freight,
      // 冗余shopId orderMode查询支付方式使用
      shopId: data.shopId,
      orderMode: data.orderMode,
      // 转换上游字段
      upperMemberId: item.supplyMemberId,
      upperMemberName: item.supplyMemberName,
      upperMemberRoleId: item.supplyRoleId,
    }
  })
}

/** 代客下单提交 字段转换 */
export const procurementProcessField = (value) => {
  value.products = value.products.map((item) => {
    return {
      ...item,
      productId: item.commodityId,
      skuId: item.id,
      logo: item.mainPic,
      quantity: item.purchaseCount,
      logisticsTemplateId: item.logistics.templateId,
      weight: item.logistics.weight,
      stock: item.stockCount,
      discount: item.isMemberPrice ? item.memberPrice : 1, // 字段需求 无折扣为1
      price: item.isMemberPrice
        ? Number((item.money / item.purchaseCount / item.memberPrice).toFixed(2))
        : Number((item.money / item.purchaseCount).toFixed(2)),
      tax: item.taxRate > 0,
      vendorMemberId: item.memberId,
      vendorRoleId: item.memberRoleId,
      vendorMemberName: item.memberName,
      // 上游字段
      supplyMemberId: item.upperMemberId,
      supplyRoleId: item.upperMemberRoleId,
      supplyMemberName: item.upperMemberName,
      crossBorder: item.isCrossBorder,
    }
  })
  return value
}

export const memberColumns: any[] = [
  {
    title: getIntl().formatMessage({ id: 'saleOrder.huiyuanID', defaultMessage: '会员ID' }),
    dataIndex: 'memberId',

    key: 'memberId',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.name' }),
    dataIndex: 'name',

    key: 'name',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.memberTypeName' }),
    dataIndex: 'memberTypeName',

    key: 'memberTypeName',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.roleName' }),
    dataIndex: 'roleName',

    key: 'roleName',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.levelTag' }),
    dataIndex: 'levelTag',

    key: 'levelTag',
  },
]

export const paymentInformationColumns: any[] = [
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.batchNo' }),
    dataIndex: 'batchNo',
    key: 'batchNo',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.payNode' }),
    dataIndex: 'payNode',
    key: 'payNode',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.outerStatusName' }),
    dataIndex: 'outerStatusName',
    key: 'outerStatusName',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.payRate' }),
    dataIndex: 'payRate',
    key: 'payRate',
    editable: true,
    forceEdit: true,
    formItem: 'input',
    formItemProps: {
      addonAfter: '%',
      // disabled: true
    },
    width: 200,
    render: (text) => text + '%',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.payPrice' }),
    dataIndex: 'payPrice',
    key: 'payPrice',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.payType' }),
    dataIndex: 'payType',
    key: 'payType',
    formItem: 'select',
    editable: true,
    forceEdit: true,
    formItemProps: {
      options: [],
    },
    width: 200,
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.payChannel' }),
    dataIndex: 'payChannel',
    key: 'payChannel',
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
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.productName' }),
    dataIndex: 'productName',

    key: 'productName',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.category' }),
    dataIndex: 'category',

    key: 'category',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.brand' }),
    dataIndex: 'brand',

    key: 'brand',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.unit' }),
    dataIndex: 'unit',

    key: 'unit',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.unitPrice' }),
    dataIndex: 'price',
    align: 'left',
    key: 'price',
    formItem: 'input',
    editable: true,
    width: 140,
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.memberPrice' }),
    dataIndex: 'memberPrice',
    key: 'memberPrice',
    render: (text, record) => (record.isMemberPrice && text ? text * 100 + '%' : null),
  },
  // {
  //   title: '库存',
  //   dataIndex: 'stockCount',
  //
  //   key: 'stockCount',
  // },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.purchaseCount' }),
    dataIndex: 'purchaseCount',

    key: 'purchaseCount',
    formItem: 'input',
    editable: true,
    width: 140,
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.taxInclusive' }),
    dataIndex: 'taxInclusive',

    key: 'taxInclusive',
    render: (t, r) =>
      r.taxRate
        ? getIntl().formatMessage({ id: 'purchaseOrder.yes' })
        : getIntl().formatMessage({ id: 'purchaseOrder.no' }),
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.taxRate' }),
    dataIndex: 'taxRate',

    key: 'taxRate',
    render: (t, r) => (t ? `${t}%` : null),
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.money' }),
    dataIndex: 'money',

    key: 'money',
  },
  // 接口调用
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.deliveryType' }),
    dataIndex: 'deliveryType',

    key: 'deliveryType',
    render: (t, r) => {
      const text_arr = [
        '',
        getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.deliveryType1' }),
        <AddressPop pickInfo={r.logistics.render}>
          {getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.deliveryType2' })}
        </AddressPop>,
        getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.deliveryType3' }),
        getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.deliveryType5' }),
      ]
      return text_arr[t]
    },
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.operation' }),
    dataIndex: 'ctl',

    key: 'ctl',
  },
]
