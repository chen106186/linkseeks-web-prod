import { useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import useLogoff from '@apps/services/safety/useLogoff'
import Router from '@/utils/router'
import { showToast } from '@apps/mobile-services/utils/taro'
import { setAsyncStorage } from '@apps/mobile-services/utils/storage'
import { LOGOFF_DATA } from '@/constants/storage'
import { useMobileIntl } from '@apps/locales'

const useLogOff = () => {
  const intl = useIntl()
  const translate = useMobileIntl()
  const { isRead, handleSubmitCheck, toggleReadStatus, failKeyList } = useLogoff()

  const jumpToWebView = (items) => {
    Router.navigateTo('basicSetting/webView', { id: items.id, columnType: items.columnType })
  }

  const handleNext = () => {
    if (!isRead) {
      return showToast({
        title: intl.formatMessage({ id: 'user.logOff.index.select.tips', defaultMessage: '请先阅读并同意协议' }),
      })
    }
    handleSubmitCheck()
  }

  useEffect(() => {
    if (Array.isArray(failKeyList)) {
      if (failKeyList.length > 0) {
        setAsyncStorage(LOGOFF_DATA, failKeyList)
        Router.navigateTo('basicSetting/logOffFail')
      } else {
        Router.navigateTo('basicSetting/logOffReason')
      }
    }
  }, [failKeyList])

  const data = [
    `1. ${intl.formatMessage({ id: 'user.logOff.index.data.1', defaultMessage: '账号当前为有效状态' })}`,
    `2. ${intl.formatMessage({ id: 'user.logOff.index.data.2', defaultMessage: '账号内无未完成状态订单' })}`,
    `3. ${intl.formatMessage({ id: 'user.logOff.index.data.3', defaultMessage: '账号内无未完成状态售后记录' })}`,
    `4. ${intl.formatMessage({ id: 'user.logOff.index.data.4', defaultMessage: '账号无供应商/商家角色' })}`,
    `5. ${intl.formatMessage({ id: 'user.logOff.index.data.5', defaultMessage: '账号无任何纠纷' })}`,
    `6. ${intl.formatMessage({
      id: 'user.logOff.index.data.6',
      defaultMessage: '账号的平台账号余额和商家店铺账号余额均为0',
    })}`,
    `7. ${intl.formatMessage({
      id: 'user.logOff.index.data.7',
      defaultMessage: '账号内无未完成的应收应付结算记录，无未还款的授信记录',
    })}`,
    `8. ${intl.formatMessage({ id: 'user.logOff.index.data.8', defaultMessage: '账号没有待平台审核处理的投诉' })}`,
    `9. ${intl.formatMessage({
      id: 'user.logOff.index.data.9',
      defaultMessage: '账号内无用户子账号或者用户子账号均已停用',
    })}`,
    `10. ${translate('mobile.resource.user.zhanghaoruoweipingtaishangjiaxuxiajiaquanbushangpin')}`,
  ]

  return {
    data,
    isRead,
    jumpToWebView,
    toggleReadStatus,
    handleNext,
  }
}

export default useLogOff
