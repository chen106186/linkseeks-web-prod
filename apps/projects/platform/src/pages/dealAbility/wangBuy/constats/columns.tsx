import { StandardFormTable } from '@apps/components'
import EyePreview from '@/components/EyePreview'
import { getWebIntl } from '@apps/locales'
import { innerStatusList } from './index'

const translate = getWebIntl()

export const commonColumns = StandardFormTable.createColumns([
  {
    title: translate('web.resource.mall.xuqiudanhao'),
    key: 'askPurchaseNo',
    searchField: {
      main: true,
    },
    render: (text: any, record: any) => (
      <EyePreview url={`/dealAbility/wangBuy/list/detail?id=${record.id}`}>{text}</EyePreview>
    ),
  },
  {
    title: translate('web.resource.mall.xuqiuzhaiyao'),
    key: 'name',
    searchField: 'Input',
  },
  {
    title: translate('web.resource.mall.baojiajiezhishijian'),
    key: 'quoteEndTime',
  },
  {
    title: translate('web.resource.afterAbility.applyTime'),
    key: 'billTime',
    searchField: {
      type: 'DateRange',
      showTime: true,
      name: ['billStartTime', 'billEndTime'],
      placeholder: [translate('web.common.kaishishijian'), translate('web.common.jieshushijian')],
    },
  },
  {
    title: translate('web.common.status'),
    key: 'status',
    render: (text: any) => <div>{text && innerStatusList[text]}</div>,
  },
])
