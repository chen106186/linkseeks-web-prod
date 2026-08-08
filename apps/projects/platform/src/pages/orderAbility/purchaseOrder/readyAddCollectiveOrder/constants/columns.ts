import { formatTimeString } from '@/utils'
import { StandardFormTable } from '@apps/components'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

/** 询价需求单 */
export const inquiryColumns = StandardFormTable.createColumns([
  {
    title: translate('web.resource.mall.xuqiudanhao'),
    key: 'purchaseInquiryNo',
    searchField: {
      main: true,
    },
  },
  {
    title: translate('web.resource.deal.xuqiudanzhaiyao'),
    key: 'details',
    searchField: {
      type: 'Input',
    },
  },
  {
    title: translate('web.resource.member.danjushijian'),
    key: 'createTime',
    render: (text: any) => formatTimeString(text),
  },
])

/** 采购竞价单 */
export const inquiryBidColumns = StandardFormTable.createColumns([
  {
    title: translate('web.resource.order.jingjiadanhao'),
    key: 'biddingNo',
    searchField: {
      main: true,
    },
  },
  {
    title: translate('web.resource.member.danjushijian'),
    key: 'createTime',
    render: (text: any) => formatTimeString(text),
  },
  {
    title: translate('web.resource.order.jingjiadanzhaiyao'),
    key: 'details',
    searchField: {
      type: 'Input',
    },
  },
])

/** 询价报价单表格 */
export const quoteColumns = StandardFormTable.createColumns([
  {
    title: translate('web.resource.order.baojiadanhao'),
    key: 'quotedPriceNo',
    // searchField: {
    //   main: true,
    // },
  },
  {
    title: translate('web.resource.order.baojiagongyingshang'),
    key: 'createMemberName',
    // searchField: {
    //   type: 'Input',
    //   name: 'supplierMemberName',
    // },
  },
  {
    title: translate('web.resource.order.baojiadanzhaiyao'),
    key: 'quotedDetails',
    // searchField: {
    //   type: 'Input',
    // },
  },
  {
    title: translate('web.resource.member.danjushijian'),
    key: 'createTime',
    render: (text: any) => formatTimeString(text),
  },
])

/** 采购竞价单表格 */
export const biddingColumns = StandardFormTable.createColumns([
  {
    title: translate('web.resource.order.jingjiadanhao'),
    key: 'biddingQuoteNo',
    searchField: {
      main: true,
    },
  },
  {
    title: translate('web.resource.order.jingjiadanzhaiyao'),
    key: 'biddingDetails',
  },
  {
    title: translate('web.resource.order.shoubiaogongyingshang'),
    key: 'createMemberName',
  },
  {
    title: translate('web.resource.member.danjushijian'),
    key: 'createTime',
    render: (text: any) => formatTimeString(text),
  },
])

export const orderProductColumns = StandardFormTable.createColumns([
  {
    title: translate('web.resource.commodity.ID'),
    key: 'productId',
    fixed: 'left',
    width: 100,
  },
  {
    title: translate('web.resource.commodity.name'),
    key: 'productName',
  },
  {
    title: translate('web.resource.commodity.category'),
    key: 'productCategory',
  },
  {
    title: translate('web.resource.commodity.brand'),
    key: 'productBrand',
  },
  {
    title: translate('web.common.unit'),
    key: 'unit',
  },
  {
    title: translate('web.resource.order.guanlianwuliao'),
    key: 'name',
  },
  {
    title: translate('web.resource.order.caigoushuliang'),
    key: 'purchaseCount',
  },
  {
    title: translate('web.resource.payment.hanshui'),
    key: 'isTax',
    render: (text: any) => {
      return text ? translate('web.common.shi') : translate('web.common.fou')
    },
  },
  {
    title: translate('web.resource.payment.shuilv'),
    key: 'taxProbability',
    render: (text: any) => {
      return `${text}%`
    },
  },
  {
    title: translate('web.resource.order.hanshuidanjia'),
    key: 'taxUnitPrice',
  },
  {
    title: translate('web.resource.order.guanlianshangpinxiaoshoushangcheng'),
    key: 'shopName',
  },
])

export const biddingOrderProductColumns = StandardFormTable.createColumns([
  {
    title: translate('web.resource.commodity.ID'),
    key: 'commoditySkuId',
    fixed: 'left',
    width: 100,
  },
  {
    title: translate('web.resource.commodity.name'),
    key: 'commodityName',
  },
  {
    title: translate('web.resource.commodity.category'),
    key: 'commodityCategory',
  },
  {
    title: translate('web.resource.commodity.brand'),
    key: 'commodityBrand',
  },
  {
    title: translate('web.common.unit'),
    key: 'unit',
  },
  {
    title: translate('web.resource.order.guanlianwuliao'),
    key: 'name',
  },
  {
    title: translate('web.resource.order.caigoushuliang'),
    key: 'purchaseCount',
  },
  {
    title: translate('web.resource.payment.hanshui'),
    key: 'isTax',
    render: (text: any) => {
      return text ? translate('web.common.shi') : translate('web.common.fou')
    },
  },
  {
    title: translate('web.resource.payment.shuilv'),
    key: 'taxRate',
    render: (text: any) => {
      return `${text}%`
    },
  },
  {
    title: translate('web.resource.order.hanshuidanjia'),
    key: 'unitPrice',
  },
  {
    title: translate('web.resource.order.guanlianshangpinxiaoshoushangcheng'),
    key: 'shopName',
  },
])
