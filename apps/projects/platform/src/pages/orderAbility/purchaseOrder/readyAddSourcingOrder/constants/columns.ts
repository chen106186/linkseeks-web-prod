import { StandardFormTable } from '@apps/components'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

export const quoteColumns = StandardFormTable.createColumns([
  {
    title: translate('web.resource.order.baojiadanhao'),
    key: 'quoteNo',
    searchField: {
      main: true,
    },
  },
  {
    title: translate('web.resource.order.xunyuanxuqiudanhao'),
    key: 'askPurchaseNo',
    searchField: 'Input',
  },
  {
    title: translate('web.resource.order.baojiadanzhaiyao'),
    key: 'name',
    searchField: {
      type: 'Input',
      name: 'quoteName',
    },
  },
  {
    title: translate('web.resource.order.baojiagongyingshang'),
    key: 'memberName',
    searchField: {
      type: 'Input',
      name: 'supplierMemberName',
    },
  },
  {
    title: translate('web.resource.member.danjushijian'),
    key: 'billTime',
  },
])

export const orderProductColumns = StandardFormTable.createColumns([
  {
    title: translate('web.resource.commodity.ID'),
    key: 'skuId',
  },
  {
    title: translate('web.resource.commodity.name'),
    key: 'name',
  },
  {
    title: translate('web.resource.commodity.category'),
    key: 'category',
  },
  {
    title: translate('web.resource.mall.brand'),
    key: 'brand',
  },
  {
    title: translate('web.common.unit'),
    key: 'unit',
  },
  {
    title: translate('web.resource.order.caigoushuliang'),
    key: 'quantity',
  },
  {
    title: translate('web.resource.deal.caigouqudao'),
    key: 'shopName',
  },
])
