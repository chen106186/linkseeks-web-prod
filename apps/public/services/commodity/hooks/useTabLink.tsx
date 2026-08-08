import { useWebIntl } from '@apps/locales'

/**
 * 头部锚点定位tab
 */
export const useTabLink = () => {
  const translate = useWebIntl()
  const tabItems = [
    { key: '1', label: translate('web.common.jibenxinxi') },
    { key: '2', label: translate('web.resource.commodity.shanpinshezhi') },
    { key: '3', label: translate('web.resource.commodity.shanpinshuxing') },
    { key: '4', label: translate('web.resource.commodity.guigeshezhi') },
    { key: '5', label: translate('web.resource.commodity.shanpintupian') },
    { key: '6', label: translate('web.resource.commodity.shanpinxiangqing') },
    { key: '7', label: translate('web.resource.logistics.wuliuxinxi') },
    { key: '8', label: translate('web.common.qitaxinxi') },
    { key: '9', label: translate('web.resource.commodity.seo') },
  ]

  return {
    tabItems,
  }
}
