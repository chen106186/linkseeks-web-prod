import { getWebIntl } from '@apps/locales'
import { getIntl } from '@linkseeks/i18n'
const translate = getWebIntl()
/** 新增采购收货单 初始值转换 */
export const procurmentRenderInit = (initValue: any) => {
  return {
    vendorMemberId: initValue.vendorMemberId,
    vendorMemberName: initValue.vendorMemberName,
    vendorRoleId: initValue.vendorRoleId,
    product: initValue.product,
    receipts: getIntl().formatMessage({ id: 'saleOrder.dingdan', defaultMessage: '订单' }),
    receiptsType: getIntl().formatMessage({ id: 'saleOrder.xiaoshoufahuodan', defaultMessage: '销售发货单' }),
    orderId: initValue.orderId,
    orderNo: initValue.orderNo,
    memberName: initValue.vendorMemberName,
    address: `${initValue.consignee.consignee}/${initValue.consignee.phone}/${initValue.consignee.areaName}${initValue.consignee.address}`,
    digest: initValue.digest,
  }
}

/** 新增采购收货单 回显物料字段转换 */
export const procurementRenderField = (data) => {
  const _orderProductRequests = data.product.products
  return _orderProductRequests.map((item) => {
    return {
      ...item,
      id: item.productId,
      code: item.productNo,
      type: item.spec,
      memberId: data.vendorMemberId,
      memberRoleId: data.vendorRoleId,
    }
  })
}

/** 新增采购收货单 字段转换 */
export const procurementProcessField = (value) => {
  value.products = value.products.map((item) => {
    return {
      ...item,
      productId: item.id,
      productNo: item.code,
      spec: item.type,
    }
  })
  return value
}

const intl = getIntl()

// 商品列表
export const productInfoColumns: any[] = [
  {
    title: 'ID',
    dataIndex: 'id',

    key: 'id',
    className: 'commonHide',
  },
  {
    title: intl.formatMessage({ id: 'purchaseOrder.shangpinmingcheng', defaultMessage: '商品名称' }),
    dataIndex: 'name',

    key: 'name',
  },
  {
    title: intl.formatMessage({ id: 'purchaseOrder.pinlei', defaultMessage: '品类' }),
    dataIndex: 'category',

    key: 'category',
  },
  {
    title: intl.formatMessage({ id: 'purchaseOrder.pinpai', defaultMessage: '品牌' }),
    dataIndex: 'brand',

    key: 'brand',
  },
  {
    title: intl.formatMessage({ id: 'purchaseOrder.danwei', defaultMessage: '单位' }),
    dataIndex: 'unit',

    key: 'unit',
  },
  {
    title: intl.formatMessage({ id: 'purchaseOrder.dinggoushuliang', defaultMessage: '订购数量' }),
    dataIndex: 'quantity',

    key: 'quantity',
  },
  {
    title: `${translate('web.common.danjia')}(${translate('web.common.currencySymbol')})`,
    dataIndex: 'price',
    align: 'left',
    key: 'price',
  },
  {
    title: intl.formatMessage({ id: 'purchaseOrder.fahuoshuliang', defaultMessage: '收货数量' }),
    dataIndex: 'count',

    key: 'count',
    formItem: 'input',
    editable: true,
  },
  {
    title: `${translate('web.resource.commodity.shouhuojine')}(${translate('web.common.currencySymbol')})`,
    dataIndex: 'amount',

    key: 'amount',
    // render: (t, r) => t ? `${Number(t).toFixed(2)}` : null
  },
  {
    title: intl.formatMessage({ id: 'purchaseOrder.caozuo', defaultMessage: '操作' }),
    dataIndex: 'ctl',

    key: 'ctl',
  },
]
