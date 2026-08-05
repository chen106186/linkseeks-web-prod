import { formatTimeString } from '@/utils'
import { Row } from 'antd'
import { DELIVERY_TYPE, OrderModalType } from '@/constants/order'
import { AddressPop } from '@/pages/orderAbility/components/addressPop'
import { getIntl } from '@linkseeks/i18n'
import { getLogisticsShipperAddressGet } from '@apps/apis'
import { getWebIntl } from '@apps/locales'
const translate = getWebIntl()
export const filterProductDataById = (data, targetData) => {
  return targetData.reduce(async (prev: any[], next) => {
    const { logistics } = next
    // 由于自选商品和购物车商品字段不一致，需手动同步

    next.brand = next.brand || next.brandName
    next.category = next.category || next.customerCategoryName
    next.unit = next.unit || next.unitName
    next.productName = next.productName || next.name
    next.deliverType = next.logistics.sendAddress // 保证和详情编辑字段一致

    if (logistics.deliveryType === 2 && logistics.sendAddress) {
      const { code, data } = await getLogisticsShipperAddressGet(
        {
          id: logistics.sendAddress,
        },
        { ttl: 60 * 1000, useCache: true },
      )
      logistics.render = { ...data, deliveryType: logistics.deliveryType }
    } else {
      logistics.render = DELIVERY_TYPE[logistics.deliveryType]
    }

    // 配送方式外置, 用于接口字段冗余
    next.deliveryType = logistics.deliveryType

    // id 存在集合中， 采用target中的数据， 否则采用data中的数据
    const findResult = data.find((v) => v.id === next.id)

    // 由于迭代时，会出现promise的 已完成状态， 需转换一下，实现异步转同步化
    if (!Array.isArray(prev)) {
      prev = await prev
    }
    if (findResult) {
      // 已经选中过这一项, 则需要采用原有的商品列表
      prev.push(findResult)
    } else {
      prev.push(next)
    }

    return prev
  }, [])
}

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

/** 修改b2b询价报价下单 初始值转换 */
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

/** 修改b2b询价报价下单 回显商品字段转换 */
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

/** B2B询价报价下单 字段转换 */
export const procurementProcessField = (value) => {
  value.products = value.products.map((item) => {
    let obj = {
      ...item,
      productId: item.commodityId,
      skuId: item.productId,
      name: item.productName,
      logo: item.imgUrl,
      quantity: item.purchaseCount,
      logisticsTemplateId: item.logistics.templateId,
      weight: item.logistics.weight,
      stockId: item.upperCommoditySkuId,
      stock: item.stockCount,
      // 上游字段
      supplyMemberId: item.upperMemberId,
      supplyRoleId: item.upperMemberRoleId,
      supplyMemberName: item.upperMemberName,
    }
    delete obj.imgUrl
    delete obj.logistics
    return obj
  })
  return value
}

/***********控制订单模式联动其他字段的数组集合 *******/
export const orderCombination = {
  // 是否显示报价单字段
  showQuotationField: [OrderModalType.INQUIRY_QUOTATION_ORDER],
  // 是否显示报价单按钮
  showQuotationSelectBtn: [OrderModalType.INQUIRY_QUOTATION_ORDER],
  // 是否显示采购合同字段
  showPurchaseContractField: [
    OrderModalType.PURCHASE_ENQUIRY_CONTRACT_ORDER,
    OrderModalType.PURCHASE_TENDER_CONTRACT_ORDER,
    OrderModalType.PURCHASE_BIDDING_CONTRACT_ORDER,
  ],
  // 是否显示选择采购合同按钮
  showPurchaseContractBtn: [
    OrderModalType.PURCHASE_ENQUIRY_CONTRACT_ORDER,
    OrderModalType.PURCHASE_TENDER_CONTRACT_ORDER,
    OrderModalType.PURCHASE_BIDDING_CONTRACT_ORDER,
  ],
}

export const orderTypeLabelMap = {
  '3': getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.orderTypeLabel1' }),
  '12': getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.orderTypeLabel2' }),
  '13': getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.orderTypeLabel3' }),
  '14': getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.orderTypeLabel4' }),
}

export const inquiryColumns: any[] = [
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.quotationNo' }),
    dataIndex: 'quotationNo',

    key: 'quotationNo',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.inquiryListNo' }),
    dataIndex: 'inquiryListNo',

    key: 'inquiryListNo',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.details' }),
    dataIndex: 'details',

    key: 'details',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.offerMemberName' }),
    dataIndex: 'offerMemberName',

    key: 'offerMemberName',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.voucherTime' }),
    dataIndex: 'voucherTime',

    key: 'voucherTime',
    render: (_) => formatTimeString(_),
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
      disabled: true,
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
    dataIndex: 'productId',

    key: 'productId',
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
    dataIndex: 'unitPrice',
    align: 'left',
    key: 'unitPrice',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.stockCount' }),
    dataIndex: 'stockCount',

    key: 'stockCount',
  },
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
