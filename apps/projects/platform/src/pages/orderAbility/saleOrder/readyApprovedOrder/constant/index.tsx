import React from 'react'
import { formatTimeString } from '@/utils'
import { Row } from 'antd'
import { getIntl } from '@linkseeks/i18n'
import { getWebIntl } from '@apps/locales'

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
    label: getIntl().formatMessage({ id: 'saleOrder.xianshangzhifu', defaultMessage: '线上支付' }),
    value: 1,
  },
  {
    label: getIntl().formatMessage({ id: 'saleOrder.xianxiazhifu', defaultMessage: '线下支付' }),
    value: 2,
  },
  {
    label: getIntl().formatMessage({ id: 'saleOrder.shouxinzhifu', defaultMessage: '授信支付' }),
    value: 3,
  },
  {
    label: getIntl().formatMessage({ id: 'saleOrder.huodaofukuan', defaultMessage: '货到付款' }),
    value: 4,
  },
]

export const memberColumns: any[] = [
  {
    title: getIntl().formatMessage({ id: 'saleOrder.huiyuanID', defaultMessage: '会员ID' }),
    dataIndex: 'memberId',

    key: 'memberId',
  },
  {
    title: getIntl().formatMessage({ id: 'saleOrder.huiyuanmingcheng', defaultMessage: '会员名称' }),
    dataIndex: 'name',

    key: 'name',
  },
  {
    title: getIntl().formatMessage({ id: 'saleOrder.gongsileixing', defaultMessage: '公司类型' }),
    dataIndex: 'memberTypeName',

    key: 'memberTypeName',
  },
  {
    title: getIntl().formatMessage({ id: 'saleOrder.gongsijuese', defaultMessage: '公司角色' }),
    dataIndex: 'roleName',

    key: 'roleName',
  },
  {
    title: getIntl().formatMessage({ id: 'saleOrder.gongsidengji', defaultMessage: '公司等级' }),
    dataIndex: 'levelTag',

    key: 'levelTag',
  },
]

export const inquiryColumns: any[] = [
  {
    title: getIntl().formatMessage({ id: 'saleOrder.baojiadanhao', defaultMessage: '报价单号' }),
    dataIndex: 'quotationNo',

    key: 'quotationNo',
  },
  {
    title: getIntl().formatMessage({ id: 'saleOrder.xunjiadanhao', defaultMessage: '询价单号' }),
    dataIndex: 'inquiryListNo',

    key: 'inquiryListNo',
  },
  {
    title: getIntl().formatMessage({ id: 'saleOrder.baojiadanzhaiyao', defaultMessage: '报价单摘要' }),
    dataIndex: 'details',

    key: 'details',
  },
  {
    title: getIntl().formatMessage({ id: 'saleOrder.xunjiahuiyuan', defaultMessage: '询价会员' }),
    dataIndex: 'memberName',

    key: 'memberName',
  },
  {
    title: getIntl().formatMessage({ id: 'saleOrder.danjushijian', defaultMessage: '单据时间' }),
    dataIndex: 'voucherTime',

    key: 'voucherTime',
    render: (_) => formatTimeString(_),
  },
]

export const paymentInformationColumns: any[] = [
  {
    title: getIntl().formatMessage({ id: 'saleOrder.zhifucishu', defaultMessage: '支付次数' }),
    dataIndex: 'payCount',

    key: 'payCount',
  },
  {
    title: getIntl().formatMessage({ id: 'saleOrder.zhifuhuanjie', defaultMessage: '支付环节' }),
    dataIndex: 'payNode',

    key: 'payNode',
  },
  {
    title: getIntl().formatMessage({ id: 'saleOrder.waibuzhuangtai', defaultMessage: '外部状态' }),
    dataIndex: 'externalState',

    key: 'externalState',
  },
  {
    title: getIntl().formatMessage({ id: 'saleOrder.zhifubili', defaultMessage: '支付比例' }),
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
    title: getIntl().formatMessage({ id: 'saleOrder.zhifujine', defaultMessage: '支付金额' }),
    dataIndex: 'payPrice',

    key: 'payPrice',
  },
  {
    title: getIntl().formatMessage({ id: 'saleOrder.zhifufangshi', defaultMessage: '支付方式' }),
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
    title: getIntl().formatMessage({ id: 'saleOrder.zhifuqudao', defaultMessage: '支付渠道' }),
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
    title: getIntl().formatMessage({ id: 'saleOrder.shangpinmingcheng', defaultMessage: '商品名称' }),
    dataIndex: 'name',

    key: 'name',
  },
  {
    title: getIntl().formatMessage({ id: 'saleOrder.pinlei', defaultMessage: '品类' }),
    dataIndex: 'customerCategoryName',

    key: 'customerCategoryName',
  },
  {
    title: getIntl().formatMessage({ id: 'saleOrder.pinpai', defaultMessage: '品牌' }),
    dataIndex: 'brandName',

    key: 'brandName',
  },
  {
    title: getIntl().formatMessage({ id: 'saleOrder.danwei', defaultMessage: '单位' }),
    dataIndex: 'unitName',

    key: 'unitName',
  },
  {
    title: getIntl().formatMessage({ id: 'saleOrder.danjia（yuan）', defaultMessage: '单价（元）' }),
    dataIndex: 'unitPrice',
    align: 'left',
    key: 'unitPrice',
    render: (text) => <PriceComp priceSection={text} />,
  },
  {
    title: getIntl().formatMessage({ id: 'saleOrder.huiyuanzhekou', defaultMessage: '会员折扣' }),
    dataIndex: 'memberPrice',

    key: 'memberPrice',
    render: (text, record) => (record.isMemberPrice ? text : null),
  },
  {
    title: getIntl().formatMessage({ id: 'saleOrder.caigoushuliang', defaultMessage: '采购数量' }),
    dataIndex: 'purchaseCount',

    key: 'purchaseCount',
    formItem: 'input',
    editable: true,
    width: 140,
  },
  {
    title: getIntl().formatMessage({ id: 'saleOrder.hanshui', defaultMessage: '含税' }),
    dataIndex: 'none',

    key: 'none',
    render: () => translate('web.common.shi'),
  },
  {
    title: getIntl().formatMessage({ id: 'saleOrder.jine', defaultMessage: '金额' }),
    dataIndex: 'price',

    key: 'price',
  },
  // 接口调用
  {
    title: getIntl().formatMessage({ id: 'saleOrder.peisongfangshi', defaultMessage: '配送方式' }),
    dataIndex: 'logistics',

    key: 'logistics',
    render: (text) => text.render || '',
  },
  {
    title: getIntl().formatMessage({ id: 'saleOrder.caozuo', defaultMessage: '操作' }),
    dataIndex: 'ctl',

    key: 'ctl',
  },
]

export const mergeOrderColumns: any[] = [
  {
    title: getIntl().formatMessage({ id: 'saleOrder.dingdanhao', defaultMessage: '订单号' }),
    dataIndex: 'orderNo',

    key: 'orderNo',
  },
  {
    title: getIntl().formatMessage({ id: 'saleOrder.dingdanzhaiyao', defaultMessage: '订单摘要' }),
    dataIndex: 'orderThe',

    key: 'orderThe',
  },
  {
    title: getIntl().formatMessage({ id: 'saleOrder.caigoushangmingcheng', defaultMessage: '采购商名称' }),
    dataIndex: 'supplyMembersName',

    key: 'supplyMembersName',
  },
  {
    title: getIntl().formatMessage({ id: 'saleOrder.xiadanshijian', defaultMessage: '下单时间' }),
    dataIndex: 'createTime',

    key: 'createTime',
  },
  {
    title: getIntl().formatMessage({ id: 'saleOrder.huodongshijian', defaultMessage: '活动时间' }),
    dataIndex: 'none',

    key: 'none',
  },
  {
    title: getIntl().formatMessage({ id: 'saleOrder.huodongmingcheng', defaultMessage: '活动名称' }),
    dataIndex: 'none',

    key: 'none',
  },
]
