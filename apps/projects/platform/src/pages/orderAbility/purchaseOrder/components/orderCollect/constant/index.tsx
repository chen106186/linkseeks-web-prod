import React from 'react'
import { Row } from 'antd'
import { DELIVERY_TYPE, OrderModalType } from '@/constants/order'
import { formatTimeString } from '@/utils'
import { GlobalConfig } from '@/global/config'
import { AddressPop } from '@/pages/orderAbility/components/addressPop'
import { getIntl } from '@linkseeks/i18n'
import { getWebIntl } from '@apps/locales'
const translate = getWebIntl()
const intl = getIntl()
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

/** 修改采购合同下单 回显字段转换 */
export const procurementRenderField = (_orderProductRequests) => {
  return _orderProductRequests.map((item) => {
    return {
      ...item,
      relevanceProductId: item.productId,
      relevanceProductName: item.productName,
      relevanceProductBrand: item.brand,
      relevanceProductCategory: item.category,
      logistics: item.logistics.deliveryType,
      // id: item.materialId,
      code: item.materialCode,
      name: item.materialName,
      type: item.materialType,
      category: item.materialCategory,
      brand: item.materialBrand,
    }
  })
}

/** 采购合同下单 字段转换 */
export const procurementProcessField = (value) => {
  value.orderProductRequests = value.orderProductRequests.map((item) => {
    // @todo 查询商品对应的最小起订数
    // const { data, code } = await getProductCommodityGetCommodity({id: item.relevanceProductId})
    // delete item.id
    return {
      ...item,
      productId: item.relevanceProductId,
      productName: item.relevanceProductName,
      brand: item.relevanceProductBrand,
      category: item.relevanceProductCategory,
      unit: item.unit,
      price: item.unitPrice,
      deliveryType: item.logistics.deliveryType,
      // @todo 后端暂无返回 写死1
      minOrder: 1,
      // 物料信息
      // materialId: item.id,
      materialCode: item.code,
      materialName: item.name,
      materialType: item.type,
      materialCategory: item.category,
      materialBrand: item.brand,
    }
  })
  return value
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
  // 是否显示选择采购合同按钮
  showPurchaseContract: [
    OrderModalType.PURCHASE_ENQUIRY_CONTRACT_ORDER,
    OrderModalType.PURCHASE_TENDER_CONTRACT_ORDER,
    OrderModalType.PURCHASE_BIDDING_CONTRACT_ORDER,
  ],
  // 是否显示供应会员按钮
  showSupplyMembersNameBtn: [
    OrderModalType.HAND_ORDER,
    OrderModalType.CHANNEL_DIRECT_MINING_ORDER,
    OrderModalType.CHANNEL_SPOT_MANUAL_ORDER,
    OrderModalType.CONSOLIDATED_ORDER,
  ],
  // 渠道会员专属下单类型
  channelMemberOrderModal: [
    OrderModalType.CHANNEL_DIRECT_PURCHASE_ORDER,
    OrderModalType.CHANNEL_DIRECT_MINING_ORDER,
    OrderModalType.CHANNEL_SPOT_PURCHASE_ORDER,
    OrderModalType.CHANNEL_SPOT_MANUAL_ORDER,
  ],
}

export const orderTypeLabelMap = () => {
  let tempObject: { [key: number]: string } = {}
  GlobalConfig['web']['orderMode'].map((item) => {
    tempObject[item['value']] = item['label']
  })
  return tempObject
}

// 支付方式
export const payTypeLabel = [
  {
    label: translate('web.resource.payment.xianshangzhifu'),
    value: 1,
  },
  {
    label: translate('web.resource.payment.xianxiazhifu'),
    value: 2,
  },
  {
    label: translate('web.resource.payment.shouxingzhifu'),
    value: 3,
  },
  {
    label: translate('web.resource.payment.huodaofukuang'),
    value: 4,
  },
  {
    label: translate('web.resource.payment.zhangqi'),
    value: 5,
  },
  {
    label: translate('web.resource.payment.yuejie'),
    value: 6,
  },
  {
    label: translate('web.resource.payment.hetongneiqingsuan'),
    value: 7,
  },
]

export const memberColumns: any[] = [
  {
    title: translate('web.resource.member.memberSupperId'),
    dataIndex: 'memberId',

    key: 'memberId',
  },
  {
    title: translate('web.resource.member.memberSupperName'),
    dataIndex: 'name',

    key: 'name',
  },
  {
    title: translate('web.resource.member.companyType'),
    dataIndex: 'memberTypeName',

    key: 'memberTypeName',
  },
  {
    title: translate('web.resource.member.companyRole'),
    dataIndex: 'roleName',

    key: 'roleName',
  },
  {
    title: translate('web.resource.member.companyLevel'),
    dataIndex: 'levelTag',

    key: 'levelTag',
  },
]

export const inquiryColumns: any[] = [
  {
    title: translate('web.resource.order.baojiadanhao'),
    dataIndex: 'quotationNo',

    key: 'quotationNo',
  },
  {
    title: translate('web.resource.order.xunjiadanhao'),
    dataIndex: 'inquiryListNo',

    key: 'inquiryListNo',
  },
  {
    title: translate('web.resource.order.baojiadanzhaiyao'),
    dataIndex: 'details',

    key: 'details',
  },
  {
    title: translate('web.resource.order.baojiahuiyuan'),
    dataIndex: 'offerMemberName',

    key: 'offerMemberName',
  },
  {
    title: translate('web.resource.member.danjushijian'),
    dataIndex: 'voucherTime',

    key: 'voucherTime',
    render: (_) => formatTimeString(_),
  },
]

// 采购合同下单选合同列
export const contractColumns: any[] = [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
    className: 'commonHide',
  },
  {
    title: translate('web.resource.contract.No'),
    dataIndex: 'contractNo',
    key: 'contractNo',
  },
  {
    title: translate('web.resource.contract.zhaiyao'),
    dataIndex: 'contractAbstract',
    key: 'contractAbstract',
  },
  {
    title: translate('web.resource.contract.shengxiao_shixiao_time'),
    dataIndex: 'startTime',
    key: 'startTime',
    render: (t, r) => (
      <>
        <p>{t}</p>
        <p>{r.endTime}</p>
      </>
    ),
  },
  {
    title: translate('web.resource.contract.hetongyifang'),
    dataIndex: 'partyBName',
    key: 'partyBName',
  },
  {
    title: translate('web.resource.contract.hetongshengyujine'),
    dataIndex: 'freeAmount',
    key: 'freeAmount',
  },
  {
    title: translate('web.resource.contract.xunyuanleixing'),
    dataIndex: 'sourceType',
    key: 'sourceType',
    render: (t, r) => {
      if (t === 1) return translate('web.resource.order.caigouxunjia')
      if (t === 2) return translate('web.resource.order.caigouzhaobiao')
      if (t === 3) return translate('web.resource.order.caigoujingjia')
    },
  },
  {
    title: translate('web.resource.contract.duiyingdanju'),
    dataIndex: 'sourceNo',
    key: 'sourceNo',
  },
]

export const paymentInformationColumns: any[] = [
  {
    title: translate('web.resource.payment.zhifucishu'),
    dataIndex: 'payCount',
    //
    key: 'payCount',
  },
  {
    title: translate('web.resource.payment.zhifuhuangjie'),
    dataIndex: 'payNode',
    //
    key: 'payNode',
  },
  {
    title: translate('web.common.waibuzhuangtai'),
    dataIndex: 'externalState',
    //
    key: 'externalState',
  },
  {
    title: translate('web.resource.payment.zhifubili'),
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
    title: translate('web.resource.payment.zhifujine'),
    dataIndex: 'payPrice',
    //
    key: 'payPrice',
  },
  {
    title: translate('web.resource.payment.zhifufangshi'),
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
    title: translate('web.resource.payment.zhifuqudao'),
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
  // to fix: 这里通过commodityId判断询报价手工类型会出错
  {
    title: 'ID',
    dataIndex: 'productId',

    key: 'productId',
    // render: (t, r) => {
    //   if(r?.commodityId) {
    //     return r.id
    //   } else  {
    //     return r.productId
    //   }
    // }
  },
  {
    title: translate('web.resource.commodity.name'),
    dataIndex: 'productName',

    key: 'productName',
  },
  {
    title: translate('web.resource.commodity.category'),
    dataIndex: 'category',

    key: 'category',
  },
  {
    title: translate('web.resource.commodity.brand'),
    dataIndex: 'brand',

    key: 'brand',
  },
  {
    title: translate('web.common.unit'),
    dataIndex: 'unit',

    key: 'unit',
  },
  // to fix: 这里通过commodityId判断询报价手工类型会出错 之前有commodityId是手工
  {
    title: translate('web.common.danjia_unit'),
    dataIndex: 'unitPrice',
    align: 'left',
    key: 'unitPrice',
  },
  {
    title: translate('web.resource.payment.huiyuanzhekou'),
    dataIndex: 'memberPrice',

    key: 'memberPrice',
    render: (text, record) => (record.isMemberPrice && text ? text * 100 + '%' : null),
  },
  {
    title: translate('web.resource.order.caigoushuliang'),
    dataIndex: 'purchaseCount',

    key: 'purchaseCount',
    formItem: 'input',
    editable: true,
    width: 140,
  },
  {
    title: translate('web.resource.payment.hanshui'),
    dataIndex: 'taxInclusive',

    key: 'taxInclusive',
    render: (t, r) => (r.taxRate ? translate('web.common.shi') : translate('web.common.fou')),
  },
  {
    title: translate('web.resource.payment.shuilv'),
    dataIndex: 'taxRate',

    key: 'taxRate',
    render: (t, r) => (t ? `${t}%` : null),
  },
  {
    title: translate('web.resource.payment.jine'),
    dataIndex: 'money',

    key: 'money',
  },
  // 接口调用
  {
    title: translate('web.resource.logistics.peisongfangshi'),
    dataIndex: 'logistics',

    key: 'logistics',
    render: (t, r) => {
      if (r.logistics?.deliveryType === 1) return translate('web.resource.logistics.wuliu1')
      else if (r.logistics?.deliveryType === 2)
        return <AddressPop pickInfo={t}>{DELIVERY_TYPE[t.deliveryType]}</AddressPop>
      else if (r.logistics?.deliveryType === 3) return translate('web.resource.logistics.wuliu2')
    },
  },
  {
    title: translate('web.common.control'),
    dataIndex: 'ctl',

    key: 'ctl',
  },
]

// 合同下单 物料列表
export const materialInfoColumns: any[] = [
  {
    title: 'ID',
    dataIndex: 'id',

    key: 'id',
    className: 'commonHide',
  },
  {
    title: translate('web.resource.commodity.wuliaoId'),
    dataIndex: 'materialId',

    key: 'materialId',
    className: 'commonHide',
  },
  {
    title: translate('web.resource.commodity.wuliaobianhao'),
    dataIndex: 'code',

    key: 'code',
  },
  {
    title: translate('web.resource.commodity.wuliaomingcheng_guige'),
    dataIndex: 'name',

    key: 'name',
    render: (t, r) => `${t}/${r.type}`,
  },
  {
    title: translate('web.resource.commodity.category'),
    dataIndex: 'category',

    key: 'category',
  },
  {
    title: translate('web.resource.commodity.brand'),
    dataIndex: 'brand',

    key: 'brand',
  },
  {
    title: translate('web.common.unit'),
    dataIndex: 'unit',

    key: 'unit',
  },
  {
    title: translate('web.resource.commodity.guanlian'),
    dataIndex: 'relevanceProductId',

    key: 'relevanceProductId',
    render: (t, r) =>
      `${t}/${r.relevanceProductName || ''}/${r.relevanceProductCategory || ''}/${r.relevanceProductBrand || ''}`,
  },
  {
    title: translate('web.common.danjia_unit'),
    dataIndex: 'price',
    align: 'left',
    key: 'price',
  },
  // {
  //   title: '供方库存',
  //   dataIndex: 'inventory',
  //
  //   key: 'inventory',
  // },
  {
    title: translate('web.resource.order.caigoushuliang'),
    dataIndex: 'purchaseCount',

    key: 'purchaseCount',
    formItem: 'input',
    editable: true,
    width: 80,
  },
  {
    title: translate('web.resource.payment.hanshui'),
    dataIndex: 'taxInclusive',

    key: 'taxInclusive',
    render: (t, r) => (t ? translate('web.common.shi') : translate('web.common.fou')),
  },
  {
    title: translate('web.resource.payment.shuilv'),
    dataIndex: 'taxRate',

    key: 'taxRate',
    render: (t, r) => (t ? `${t}%` : null),
  },
  {
    title: translate('web.resource.payment.jine'),
    dataIndex: 'money',

    key: 'money',
  },
  // 接口调用
  {
    title: translate('web.resource.logistics.peisongfangshi'),
    dataIndex: 'logistics',

    key: 'logistics',
    formItem: 'select',
    editable: true,
    width: 80,
    // render: (t, r) => {
    //   if(r.logistics?.deliveryType === 1)
    //     return "物流（默认）"
    //   else if(r.logistics?.deliveryType === 2)
    //     return "自提"
    //   else if(r.logistics?.deliveryType === 3)
    //     return "无需配送"
    // }
  },
  {
    title: translate('web.common.control'),
    dataIndex: 'ctl',

    key: 'ctl',
  },
]

// 合并订单父级表格列
export const mergeParentTableColumns: any[] = [
  {
    title: translate('web.resource.order.orderNo'),
    dataIndex: 'orderNo',

    key: 'orderNo',
    // @todo 此时以采购商的角色查看供应商的订单详情，合理性有待商榷
    render: (t, r) => (
      <a target="blank" href={`/orderAbility/purchaseOrder/orderList/detail?id=${r.id}`}>
        {t}
      </a>
    ),
  },
  {
    title: translate('web.resource.order.dingdanzhaiyao'),
    dataIndex: 'orderThe',

    key: 'orderThe',
  },
  {
    title: translate('web.resource.member.caigoushangmingchen'),
    dataIndex: 'memberName',

    key: 'memberName',
  },
  {
    title: translate('web.resource.order.xiadanshijian'),
    dataIndex: 'createTime',

    key: 'createTime',
    render: (text) => formatTimeString(text),
  },
  {
    title: translate('web.resource.order.huodongshijian'),
    dataIndex: 'none',

    key: 'none',
  },
  {
    title: translate('web.resource.order.huodongmingchen'),
    dataIndex: 'none',

    key: 'none',
  },
]

// 合并订单子级表格列
export const mergeChildrenTableColumns: any[] = [
  {
    title: 'ID',
    dataIndex: 'productId',

    key: 'productId',
  },
  {
    title: translate('web.resource.commodity.name'),
    dataIndex: 'productName',

    key: 'productName',
  },
  {
    title: translate('web.resource.commodity.category'),
    dataIndex: 'category',

    key: 'category',
  },
  {
    title: translate('web.resource.commodity.brand'),
    dataIndex: 'brand',

    key: 'brand',
  },
  {
    title: translate('web.common.unit'),
    dataIndex: 'unit',

    key: 'unit',
  },
  {
    title: translate('web.common.danjia'),
    dataIndex: 'price',

    key: 'price',
  },
  {
    title: translate('web.resource.order.yuandingdanshuliang'),
    dataIndex: 'purchaseCount',

    key: 'purchaseCount',
  },
  {
    title: translate('web.resource.order.yuandingdanjine'),
    dataIndex: 'id',

    key: 'id',
    render: (t, r) => `${translate('web.common.currencySymbol')}${(r.purchaseCount * 100 * (r.price * 100)) / 10000}`,
  },
]
