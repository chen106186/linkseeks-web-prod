import { useWebIntl } from '@apps/locales'
import { useIntl } from '@linkseeks/i18n'

export const useTabsItems = () => {
  const translate = useWebIntl()
  const tabsItems = [
    {
      key: '0',
      label: translate('web.common.all'),
    },
    {
      key: '1, 2, 3',
      label: translate('web.resource.mall.toBeReviewed'),
    },
    {
      key: '4',
      label: translate('web.resource.order.verifySuccess'),
    },
    {
      key: '5',
      label: translate('web.common.yishangjia'),
    },
    {
      key: '6',
      label: translate('web.common.yixiajia'),
    },
  ]
  return {
    tabsItems,
  }
}
