import { getWebIntl } from '@apps/locales'
import { getIntl } from '@linkseeks/i18n'

const translate = getWebIntl()
/** 新增销售发货单 初始值转换 */
export const procurmentRenderInit = (initValue: any) => {
  return {
    detailList: initValue.detailList,
    receipts: getIntl().formatMessage({ id: 'saleOrder.dingdan', defaultMessage: '订单' }),
    receiptsType: getIntl().formatMessage({ id: 'saleOrder.xiaoshoufahuodan', defaultMessage: '销售发货单' }),
    orderId: initValue.orderId,
    orderNo: initValue.orderNo,
    buyerMemberName: initValue.buyerMemberName,
    buyerMemberId: initValue.buyerMemberId,
    buyerRoleId: initValue.buyerRoleId,
    address: initValue.consignee,
    // digest: initValue.digest,
    inventoryName: initValue.inventoryName,
    inventoryRole: initValue.inventoryRole,
    remark: initValue.remark,
  }
}

/** 新增销售发货单 回显物料/商品字段转换 */
export const procurementRenderField = (data) => {
  const _orderProductRequests = data.detailList
  return _orderProductRequests.map((item) => {
    return {
      ...item,
      id: item.productId,
    }
  })
}

/** 新增销售发货单提交 字段转换 */
export const procurementProcessField = (value) => {
  value.detailList = value.detailList.map((item) => {
    return {
      ...item,
      productId: item.id,
    }
  })
  return value
}

const intl = getIntl()
// 单据明细 商品列表
export const productInfoColumns: any[] = [
  {
    title: 'ID',
    dataIndex: 'id',

    key: 'id',
    className: 'commonHide',
  },
  {
    title: intl.formatMessage({ id: 'saleOrder.shangpinmingcheng', defaultMessage: '商品名称' }),
    dataIndex: 'name',

    key: 'name',
  },
  {
    title: intl.formatMessage({ id: 'saleOrder.pinlei', defaultMessage: '品类' }),
    dataIndex: 'category',

    key: 'category',
  },
  {
    title: intl.formatMessage({ id: 'saleOrder.pinpai', defaultMessage: '品牌' }),
    dataIndex: 'brand',

    key: 'brand',
  },
  {
    title: intl.formatMessage({ id: 'saleOrder.danwei', defaultMessage: '单位' }),
    dataIndex: 'unit',

    key: 'unit',
  },
  {
    title: intl.formatMessage({ id: 'saleOrder.dinggoushuliang', defaultMessage: '订单数量' }),
    dataIndex: 'orderQuantity',

    key: 'orderQuantity',
  },
  {
    title: `${translate('web.common.danjia')}(${translate('web.common.currencySymbol')})`,
    dataIndex: 'price',
    align: 'left',
    key: 'price',
  },
  {
    title: intl.formatMessage({ id: 'saleOrder.fahuoshuliang', defaultMessage: '发货数量' }),
    dataIndex: 'deliveryQuantity',

    key: 'deliveryQuantity',
    formItem: 'input',
    editable: true,
  },
  {
    title: `${translate('web.resource.order.fahuojine')}(${translate('web.common.currencySymbol')})`,
    dataIndex: 'amount',

    key: 'amount',
    // render: (t, r) => t ? `${Number(t).toFixed(2)}` : null
  },
  {
    title: intl.formatMessage({ id: 'saleOrder.caozuo', defaultMessage: '操作' }),
    dataIndex: 'ctl',

    key: 'ctl',
  },
]
