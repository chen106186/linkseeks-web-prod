import { Row } from 'antd'
import { getIntl } from '@linkseeks/i18n'

// 简单控制价格区间的组件
export const PriceComp = (props) => {
  const { priceSection = {} } = props
  const priceTransKeys = Object.keys(priceSection || {})
  // 出现0-0 表示没有单价区间范围
  if (priceTransKeys.length === 1 && priceTransKeys[0] === '0-0') {
    return (
      <span style={{ color: '#E63F3B' }}>
        {intl.formatMessage({ id: 'common.money' }) + priceSection[priceTransKeys[0]]}
      </span>
    )
  }
  return (
    <div>
      {priceTransKeys.map((v) => (
        <Row key={v} justify="space-between">
          <span style={{ color: '#606266' }}>{v.replace('-', '~')}:</span>
          <span style={{ color: '#E63F3B', marginLeft: 40 }}>
            {intl.formatMessage({ id: 'common.money' })}
            {priceSection[v]}
          </span>
        </Row>
      ))}
    </div>
  )
}

/**新增物流单 初始值转换 */
export const procurmentRenderInit = (initValue: any) => {
  return {
    // shipmentOrderId: initValue.deliveryNo,
    shipmentOrderCode: initValue.deliveryNo,
    relevanceOrderId: initValue.orderId,
    relevanceOrderCode: initValue.orderNo,
    memberName: initValue.buyerMemberName,
    receiverAddress: initValue.consignee,
    receiverAddressId: initValue.consignee.consigneeId,
    receiverName: initValue.consignee.consignee,
    receiverPhone: initValue.consignee.phone,
    receiverFullAddress: initValue.consignee.areaName + initValue.consignee.address,
    freight: intl.formatMessage({ id: 'saleOrder.weibaojia', defaultMessage: '未报价' }),
  }
}

/** 新增物流单 回显商品字段转换 */
export const procurementRenderField = (data) => {
  const _orderProductRequests = data.detailList
  return _orderProductRequests.map((item) => {
    return {
      ...item,
      productName: item.name,
      // 订单中amount是金额 物流单里面amount是商品数量
      amount: item.deliveryQuantity,
    }
  })
}

/** 新增物流单 字段转换 */
export const procurementProcessField = (value) => {
  value.detailList = value.detailList.map((item) => {
    return {
      ...item,
      productId: item.id,
      productName: item.name,
      categoryName: item.category,
      brandName: item.brand,
      unitName: item.unit,
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
  },
  {
    title: intl.formatMessage({ id: 'saleOrder.shangpinmingcheng', defaultMessage: '商品名称' }),
    dataIndex: 'productName',

    key: 'productName',
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
    title: intl.formatMessage({ id: 'saleOrder.shuliang', defaultMessage: '数量' }),
    dataIndex: 'amount',

    key: 'amount',
    formItem: 'input',
    editable: true,
    width: 140,
  },
  {
    title: intl.formatMessage({ id: 'saleOrder.xiangshu', defaultMessage: '箱数' }),
    dataIndex: 'carton',

    key: 'carton',
    formItem: 'input',
    editable: true,
    width: 140,
  },
  {
    title: intl.formatMessage({ id: 'saleOrder.zhongliang', defaultMessage: '重量' }),
    dataIndex: 'weight',

    key: 'weight',
    formItem: 'input',
    editable: true,
    width: 140,
  },
  {
    title: intl.formatMessage({ id: 'saleOrder.tiji', defaultMessage: '体积' }),
    dataIndex: 'volume',

    key: 'volume',
    formItem: 'input',
    editable: true,
    width: 140,
  },
  {
    title: intl.formatMessage({ id: 'saleOrder.caozuo', defaultMessage: '操作' }),
    dataIndex: 'ctl',

    key: 'ctl',
  },
]
