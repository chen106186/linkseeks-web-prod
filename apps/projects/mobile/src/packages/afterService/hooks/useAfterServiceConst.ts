import { useIntl } from '@linkseeks/i18n'

const useAfterServiceConst = () => {
  const intl = useIntl()
  const navOptions = [
    // {
    //   value: 2,
    //   content: intl.formatMessage({ id: 'exchangeTodo.exchangeApply.nav', defaultMessage: '换货' }),
    // },
    {
      value: 1,
      content: intl.formatMessage({ id: 'refundTodo.refundApply.nav', defaultMessage: '退货' }),
    },
    // {
    //   value: 3,
    //   content: intl.formatMessage({ id: 'repairTodo.repairApply.nav', defaultMessage: '维修' }),
    // },
  ]

  const OTHER_REASON_KEY = intl.formatMessage({
    id: 'afterTodo.components.reasonPopup.other',
    defaultMessage: '其他原因',
  })

  const OTHER_LOGISTICS_COMPANY_KEY = intl.formatMessage({
    id: 'afterRecords.chooseLogisticsCompany.other',
    defaultMessage: '其他',
  })

  return {
    navOptions,
    OTHER_REASON_KEY,
    OTHER_LOGISTICS_COMPANY_KEY,
  }
}

export default useAfterServiceConst
