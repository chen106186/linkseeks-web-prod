import { formatTimeString } from '@/utils'
import { Row } from 'antd'
import { OrderModalType, PurchaseOrderOutWorkStateTexts } from '@/constants'

/**
 * 销售订单状态枚举
 */
export enum SALE_ORDER_STATUS {
  PREVIEW_ORDER = -1,
  READY_APPROVED_ORDER,
  ONE_LEVEL_APPROVED_ORDER,
  TWO_LEVEL_APPROVED_ORDER,
  CONFIRM_ORDER,
  CONFIRM_PAY_RESULT_ORDER,
  ADD_SALE_ORDER,
  ADD_LOG_ORDER,
  CONFIRM_DELIVE_GOODS_ORDER,
  CONFIRM_RETURN_ORDER,
  RETURN_DOCUMENT_ORDER,
}

export const SALE_ORDER_STATUS_TITLE = {
  '-1': '查看订单',
  0: '待审核订单',
  1: '审核订单（一级）',
  2: '审核订单（二级）',
  3: '确认订单',
  4: '订单确认支付结果',
  5: '新增销售发货单',
  6: '新增物流单',
  7: '订单发货确认',
  8: '确认回单',
  9: '订单归档',
}

// 简单控制价格区间的组件
// @todo 后续需要优化, 样式，目录文件等。
const PriceComp = (props) => {
  const { priceSection = {} } = props
  const priceTransKeys = Object.keys(priceSection)
  // 出现0-0 表示没有单价区间范围
  if (priceTransKeys.length === 1 && priceTransKeys[0] === '0-0') {
    return <span style={{ color: '#E63F3B' }}>{'￥' + priceSection[priceTransKeys[0]]}</span>
  }
  return (
    <div>
      {priceTransKeys.map((v) => (
        <Row key={v} justify="space-between">
          <span style={{ color: '#606266' }}>{v.replace('-', '~')}:</span>
          <span style={{ color: '#E63F3B', marginLeft: 40 }}>￥{priceSection[v]}</span>
        </Row>
      ))}
    </div>
  )
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

export const orderTypeLabel = [
  '',
  '询价采购',
  '需求采购',
  '现货采购',
  '集采',
  '积分兑换',
  '渠道直采',
  '渠道现货',
  '渠道积分兑换',
]

// 订单种类 *NEW
export enum OrderKindType {
  /**
   *  采购订单
   */
  PURCHASE_ORDER = 1,

  /**
   * SRM订单
   */
  SRM_ORDER = 2,

  /**
   * B2B订单
   */
  B2B_ORDER = 3,
}

// 支付方式
export const payTypeLabel = [
  {
    label: '线上支付',
    value: 1,
  },
  {
    label: '线下支付',
    value: 2,
  },
  {
    label: '授信支付',
    value: 3,
  },
  {
    label: '货到付款',
    value: 4,
  },
]

export const memberColumns: any[] = [
  {
    title: '会员ID',
    dataIndex: 'memberId',
    align: 'center',
    key: 'memberId',
  },
  {
    title: '会员名称',
    dataIndex: 'name',
    align: 'center',
    key: 'name',
  },
  {
    title: '公司类型',
    dataIndex: 'memberTypeName',
    align: 'center',
    key: 'memberTypeName',
  },
  {
    title: '公司角色',
    dataIndex: 'roleName',
    align: 'center',
    key: 'roleName',
  },
  {
    title: '公司等级',
    dataIndex: 'levelTag',
    align: 'center',
    key: 'levelTag',
  },
]

export const inquiryColumns: any[] = [
  {
    title: '报价单号',
    dataIndex: 'quotationNo',
    align: 'center',
    key: 'quotationNo',
  },
  {
    title: '询价单号',
    dataIndex: 'inquiryListNo',
    align: 'center',
    key: 'inquiryListNo',
  },
  {
    title: '报价单摘要',
    dataIndex: 'details',
    align: 'center',
    key: 'details',
  },
  {
    title: '询价会员',
    dataIndex: 'memberName',
    align: 'center',
    key: 'memberName',
  },
  {
    title: '单据时间',
    dataIndex: 'voucherTime',
    align: 'center',
    key: 'voucherTime',
    render: (_) => formatTimeString(_),
  },
]

export const paymentInformationColumns: any[] = [
  {
    title: '支付次数',
    dataIndex: 'payCount',
    align: 'center',
    key: 'payCount',
  },
  {
    title: '支付环节',
    dataIndex: 'payNode',
    align: 'center',
    key: 'payNode',
  },
  {
    title: '外部状态',
    dataIndex: 'externalState',
    align: 'center',
    key: 'externalState',
    render: (text) => PurchaseOrderOutWorkStateTexts[text],
  },
  {
    title: '支付比例',
    dataIndex: 'payRatio',
    key: 'payRatio',
    editable: true,
    forceEdit: true,
    formItem: 'input',
    formItemProps: {
      addonAfter: '%',
    },
    width: 200,
    render: (text) => text + '%',
  },
  {
    title: '支付金额',
    dataIndex: 'payPrice',
    align: 'center',
    key: 'payPrice',
  },
  {
    title: '支付方式',
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
    title: '支付渠道',
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
    align: 'center',
    key: 'id',
  },
  {
    title: '商品名称',
    dataIndex: 'name',
    align: 'center',
    key: 'name',
  },
  {
    title: '品类',
    dataIndex: 'customerCategoryName',
    align: 'center',
    key: 'customerCategoryName',
  },
  {
    title: '品牌',
    dataIndex: 'brandName',
    align: 'center',
    key: 'brandName',
  },
  {
    title: '单位',
    dataIndex: 'unitName',
    align: 'center',
    key: 'unitName',
  },
  {
    title: '单价（元）',
    dataIndex: 'unitPrice',
    align: 'left',
    key: 'unitPrice',
    render: (text) => <PriceComp priceSection={text} />,
  },
  {
    title: '会员折扣',
    dataIndex: 'memberPrice',
    align: 'center',
    key: 'memberPrice',
    render: (text, record) => (record.isMemberPrice ? text : null),
  },
  {
    title: '采购数量',
    dataIndex: 'purchaseCount',
    align: 'center',
    key: 'purchaseCount',
    formItem: 'input',
    editable: true,
    width: 140,
  },
  {
    title: '含税',
    dataIndex: 'none',
    align: 'center',
    key: 'none',
    render: () => '是',
  },
  {
    title: '金额',
    dataIndex: 'price',
    align: 'center',
    key: 'price',
  },
  // 接口调用
  {
    title: '配送方式',
    dataIndex: 'logistics',
    align: 'center',
    key: 'logistics',
    render: (text) => (text && text.render) || '',
  },
  {
    title: '操作',
    dataIndex: 'ctl',
    align: 'center',
    key: 'ctl',
  },
]

export const mergeOrderColumns: any[] = [
  {
    title: '订单号',
    dataIndex: 'orderNo',
    align: 'center',
    key: 'orderNo',
  },
  {
    title: '订单摘要',
    dataIndex: 'orderThe',
    align: 'center',
    key: 'orderThe',
  },
  {
    title: '采购商名称',
    dataIndex: 'supplyMembersName',
    align: 'center',
    key: 'supplyMembersName',
  },
  {
    title: '下单时间',
    dataIndex: 'createTime',
    align: 'center',
    key: 'createTime',
  },
  {
    title: '活动时间',
    dataIndex: 'none',
    align: 'center',
    key: 'none',
  },
  {
    title: '活动名称',
    dataIndex: 'none',
    align: 'center',
    key: 'none',
  },
]
