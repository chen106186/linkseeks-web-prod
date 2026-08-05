import { formatTimeString } from '@/utils'
import { Row } from 'antd'
import { OrderModalType } from '@/constants/order'
import { getIntl } from '@linkseeks/i18n'
import { COLUMNS_ACTION_WIDTH } from '@/constants/table'
import moment from 'moment'
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

/** 修改合同下单 初始值转换 */
export const procurmentRenderInit = (initValue: any, products?: any[]) => {
  return {
    ...initValue.requirement,
    vendorMemberId: initValue.vendorMemberId,
    vendorMemberName: initValue.vendorMemberName,
    vendorRoleId: initValue.vendorRoleId,
    products,
    // product: initValue.product,
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
    hasContract: initValue.hasContract,
    contractNo: initValue.contract.contractNo,
    contract: { ...initValue.contract },
    currencyType: initValue.currencyType,
    paymentType: initValue.paymentType,
    versions: initValue.versions,
    contractText: contractTextVal(initValue),
  }
}

/** 修改采购合同下单 回显商品字段转换 */
export const procurementRenderField = (data) => {
  const _orderProductRequests = data?.product?.products || []
  return _orderProductRequests.map((item) => {
    return {
      ...item,
      // 此id为sukId
      relevanceProductId: item.quotedSkuId,
      // relevanceSkuId: item.quotedSkuId,
      relevanceProductName: item.quotedName,
      relevanceProductBrand: item.quotedBrand,
      relevanceProductCategory: item.quotedCategory,
      relevanceProductSpec: item.quotedSpec,
      logistics: item.deliverType,
      id: item.productId,
      code: item.productNo,
      type: item.spec,
      // 冗余memberId memberRoleId查询自提地址使用
      memberId: data.vendorMemberId,
      memberRoleId: data.vendorRoleId,
      expectedDelivery: item.expectedDelivery ? moment(item.expectedDelivery) : null,
    }
  })
}

/** 采购合同下单 字段转换 */
export const procurementProcessField = (value) => {
  value.products = value.products.map((item) => {
    return {
      ...item,
      productId: item.id,
      productNo: item.code,
      // 关联商品信息
      // quotedProductId: item.relevanceProductId,
      quotedSkuId: item.relevanceProductId,
      quotedName: item.relevanceProductName,
      quotedSpec: item.relevanceProductType,
      quotedCategory: item.relevanceProductCategory,
      quotedBrand: item.relevanceProductBrand,
    }
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
    OrderModalType.PURCHASE_REQUISITION_CONTRACT_ORDER,
    OrderModalType.FRAME_CONTRACT_ORDER,
  ],
  // 是否显示选择采购合同按钮
  showPurchaseContractBtn: [
    OrderModalType.PURCHASE_ENQUIRY_CONTRACT_ORDER,
    OrderModalType.PURCHASE_TENDER_CONTRACT_ORDER,
    OrderModalType.PURCHASE_BIDDING_CONTRACT_ORDER,
    OrderModalType.PURCHASE_REQUISITION_CONTRACT_ORDER,
    OrderModalType.FRAME_CONTRACT_ORDER,
  ],
}

export const orderTypeLabelMap = {
  '3': getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.orderTypeLabel1' }),
  '12': getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.orderTypeLabel2' }),
  '13': getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.orderTypeLabel3' }),
  '14': getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.orderTypeLabel4' }),
  '16': getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.orderTypeLabel5' }),
}

export const memberColumns: any[] = [
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.memberId' }),
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

// 采购合同下单选合同列
export const contractColumns: any[] = [
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.contractColumns.contractNo' }),
    dataIndex: 'contractNo',
    key: 'contractNo',
    width: COLUMNS_ACTION_WIDTH,
  },
  {
    title: getIntl().formatMessage({
      id: 'purchaseOrder.orderCollect.contractColumns.contractAbstract',
    }),
    dataIndex: 'contractAbstract',
    key: 'contractAbstract',
    width: 256,
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.contractColumns.startTime' }),
    dataIndex: 'startTime',
    key: 'startTime',
    width: 120,
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.contractColumns.endTime' }),
    dataIndex: 'endTime',
    key: 'endTime',
    width: 120,
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.contractColumns.partyBName' }),
    dataIndex: 'partyBName',
    key: 'partyBName',
    width: 192,
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.contractColumns.freeAmount' }),
    dataIndex: 'freeAmount',
    key: 'freeAmount',
    width: COLUMNS_ACTION_WIDTH,
    render: (t) => `${t.toFixed(2)}`,
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.contractColumns.sourceType' }),
    dataIndex: 'sourceTypeName',
    key: 'sourceTypeName',
    width: 96,
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.contractColumns.sourceNo' }),
    dataIndex: 'sourceNo',
    key: 'sourceNo',
    width: 96,
  },
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
    width: 0,
    className: 'commonHide',
  },
].map((column) => ({ ...column, ellipsis: true }))

// 合同下单 物料列表
export const materialInfoColumns: any[] = [
  {
    title: '行号',
    dataIndex: 'lineNumber',
    key: 'lineNumber',
    width: 60,
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.code' }),
    dataIndex: 'productNo',
    key: 'productNo',
    width: COLUMNS_ACTION_WIDTH,
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.name1' }),
    dataIndex: 'name',
    key: 'name',
    width: 192,
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.name2' }),
    dataIndex: 'spec',
    key: 'spec',
    width: 160,
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.category' }),
    dataIndex: 'category',
    key: 'category',
    width: COLUMNS_ACTION_WIDTH,
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.brand' }),
    dataIndex: 'brand',
    key: 'brand',
    width: COLUMNS_ACTION_WIDTH,
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.unit' }),
    dataIndex: 'unit',
    key: 'unit',
    width: 64,
  },
  // {
  //   title: getIntl().formatMessage({id: 'purchaseOrder.orderCollect.constant.relevanceProductId'}),
  //   dataIndex: 'relevanceProductId',
  //   key: 'relevanceProductId',
  //   render: (t, r) => t ? `${t}/${r.relevanceProductName || ''}/${r.relevanceProductType || ''}/${r.relevanceProductCategory || ''}/${r.relevanceProductBrand || ''}` : ''
  // },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.price' }),
    dataIndex: 'price',
    align: 'left',
    key: 'price',
    width: 96,
    render: (t) => (t ? `${Number(t).toFixed(2)}` : null),
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.quantity' }),
    dataIndex: 'quantity',
    key: 'quantity',
    formItem: 'input',
    editable: true,
    width: COLUMNS_ACTION_WIDTH,
  },
  {
    title: '期望交期',
    dataIndex: 'expectedDelivery',
    key: 'expectedDelivery',
    formItem: 'date',
    editable: true,
    width: 142,
  },
  {
    title: '承诺交期',
    dataIndex: 'promisedDeliveryDate',
    key: 'promisedDeliveryDate',
    width: 120,
  },
  {
    title: `${getIntl().formatMessage({
      id: 'purchaseOrder.orderCollect.constant.taxInclusive',
    })}/${getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.taxRate' })}`,
    dataIndex: 'tax',
    key: 'tax',
    width: 96,
    render: (t, r) =>
      t
        ? `${getIntl().formatMessage({ id: 'purchaseOrder.yes' })}${r.taxRate ? '/' + r.taxRate + '%' : ''}`
        : getIntl().formatMessage({ id: 'purchaseOrder.no' }),
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.readyAddOrder.productInfoColumns.price' }),
    dataIndex: 'amount',
    key: 'amount',
    width: COLUMNS_ACTION_WIDTH,
    render: (t) => (t ? `${Number(t).toFixed(2)}` : null),
  },
  // 接口调用
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.logistics' }),
    dataIndex: 'logistics',
    key: 'logistics',
    width: COLUMNS_ACTION_WIDTH + 22,
    formItem: 'select',
    editable: true,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    width: 160,
    formItem: 'remark',
    editable: true,
    formItemProps: {
      type: 'text',
      maxLength: 200,
    },
  },
  {
    title: 'ID',
    dataIndex: 'productId',
    key: 'productId',
    width: COLUMNS_ACTION_WIDTH,
    className: 'commonHide',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.operation' }),
    dataIndex: 'ctl',
    key: 'ctl',
    width: 0,
    align: 'center',
  },
].map((column) => ({ ...column, ellipsis: true }))

// 合同下单 物料列表（请购单合同情况下）
export const materialInfoColumnsByRequisition: any[] = [
  {
    title: '行号',
    dataIndex: 'lineNumber',
    key: 'lineNumber',
    width: 60,
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.code' }),
    dataIndex: 'productNo',
    key: 'productNo',
    width: COLUMNS_ACTION_WIDTH,
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.name1' }),
    dataIndex: 'name',
    key: 'name',
    width: 192,
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.name2' }),
    dataIndex: 'spec',
    key: 'spec',
    width: 160,
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.category' }),
    dataIndex: 'category',
    key: 'category',
    width: COLUMNS_ACTION_WIDTH,
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.brand' }),
    dataIndex: 'brand',
    key: 'brand',
    width: COLUMNS_ACTION_WIDTH,
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.unit' }),
    dataIndex: 'unit',
    key: 'unit',
    width: 64,
  },
  // {
  //   title: getIntl().formatMessage({id: 'purchaseOrder.orderCollect.constant.relevanceProductId'}),
  //   dataIndex: 'relevanceProductId',
  //   key: 'relevanceProductId',
  //   render: (t, r) => t ? `${t}/${r.relevanceProductName || ''}/${r.relevanceProductType || ''}/${r.relevanceProductCategory || ''}/${r.relevanceProductBrand || ''}` : ''
  // },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.price' }),
    dataIndex: 'price',
    align: 'left',
    key: 'price',
    width: 96,
    render: (t) => (t ? `${Number(t).toFixed(2)}` : null),
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.quantity' }),
    dataIndex: 'quantity',
    key: 'quantity',
    width: COLUMNS_ACTION_WIDTH,
  },
  {
    title: '期望交期',
    dataIndex: 'expectedDelivery',
    key: 'expectedDelivery',
    formItem: 'date',
    width: 180,
    editable: true,
  },
  {
    title: '承诺交期',
    dataIndex: 'promisedDeliveryDate',
    key: 'promisedDeliveryDate',
    width: 120,
  },
  {
    title: `${getIntl().formatMessage({
      id: 'purchaseOrder.orderCollect.constant.taxInclusive',
    })}/${getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.taxRate' })}`,
    dataIndex: 'tax',
    key: 'tax',
    width: 96,
    render: (t, r) =>
      t
        ? `${getIntl().formatMessage({ id: 'purchaseOrder.yes' })}${r.taxRate ? '/' + r.taxRate + '%' : ''}`
        : getIntl().formatMessage({ id: 'purchaseOrder.no' }),
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.readyAddOrder.productInfoColumns.price' }),
    dataIndex: 'amount',
    key: 'amount',
    width: COLUMNS_ACTION_WIDTH,
    render: (t) => (t ? `${Number(t).toFixed(2)}` : null),
  },
  // 接口调用
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.orderCollect.constant.logistics' }),
    dataIndex: 'logistics',
    key: 'logistics',
    width: COLUMNS_ACTION_WIDTH + 22,
    formItem: 'select',
    editable: true,
  },
  {
    title: '关联单据',
    dataIndex: 'relative',
    key: 'relative',
    width: COLUMNS_ACTION_WIDTH,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    width: 160,
    formItem: 'remark',
    editable: true,
    formItemProps: {
      type: 'text',
      maxLength: 200,
    },
  },
  {
    title: 'ID',
    dataIndex: 'productId',
    key: 'productId',
    width: COLUMNS_ACTION_WIDTH,
    className: 'commonHide',
  },
  {
    title: getIntl().formatMessage({ id: 'purchaseOrder.operation' }),
    dataIndex: 'ctl',
    key: 'ctl',
    width: 0,
    align: 'center',
  },
].map((column) => ({ ...column, ellipsis: true }))

// 关联请购单 列表
export const requisitionColumns: any[] = [
  {
    title: '请购单号',
    dataIndex: 'requisitionNo',
    key: 'requisitionNo',
    width: COLUMNS_ACTION_WIDTH,
  },
  {
    title: '请购单摘要',
    dataIndex: 'digest',
    key: 'digest',
    width: 256,
  },
  {
    title: '供应会员',
    dataIndex: 'vendorMemberName',
    key: 'vendorMemberName',
    width: 160,
  },
  {
    title: '请购部门',
    dataIndex: 'department',
    key: 'department',
    width: 96,
  },
  {
    title: '请购人',
    dataIndex: 'requisitioner',
    key: 'requisitioner',
    width: 72,
  },
  {
    title: '预交日期',
    dataIndex: 'advanceDeliveryDate',
    key: 'advanceDeliveryDate',
    width: 96,
  },
  {
    title: '配送方式',
    dataIndex: 'deliveryMethodName',
    key: 'deliveryMethodName',
    width: 80,
  },
  {
    title: '配送地址',
    dataIndex: 'deliveryAddress',
    key: 'deliveryAddress',
    width: 256,
  },
  {
    title: '物料编号',
    dataIndex: 'productNo',
    key: 'productNo',
    width: 96,
  },
  {
    title: '物料名称',
    dataIndex: 'name',
    key: 'name',
    width: 176,
  },
  {
    title: '请购数量',
    dataIndex: 'quantity',
    key: 'quantity',
    width: 96,
  },
  {
    title: '下单数量',
    dataIndex: 'orderQuantity',
    key: 'orderQuantity',
    width: 96,
  },
].map((column) => ({ ...column, ellipsis: true }))
