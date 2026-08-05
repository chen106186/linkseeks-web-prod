import { useState, useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import Router from '@/utils/router'
import { getAsyncStorage } from '@apps/mobile-services/utils/storage'
import { LOGOFF_DATA } from '@/constants/storage'
import { useMobileIntl } from '@apps/locales'

const useLogOffFail = () => {
  const [data, setData] = useState<any[]>([])
  const intl = useIntl()
  const translate = useMobileIntl()
  const failItem = [
    {
      key: 'memberStatus',
      title: intl.formatMessage({ id: 'user.logOff.index.data.1', defaultMessage: '账号当前为有效状态' }),
      describe: intl.formatMessage({
        id: 'user.logOff.index.data.1.tips',
        defaultValue: '异常：您的当前账号处于冻结状态，请联系客服处理',
      }),
    },
    {
      key: 'notCompleteOrder',
      title: intl.formatMessage({ id: 'user.logOff.index.data.2', defaultMessage: '账号内无未完成状态订单' }),
      describe: intl.formatMessage({
        id: 'user.logOff.index.data.2.tips',
        defaultValue: '异常：您的账号内有未完成的订单，请先完成订单交易后再操作',
      }),
    },
    {
      key: 'notCompleteAfterSale',
      title: intl.formatMessage({ id: 'user.logOff.index.data.3', defaultMessage: '账号内无未完成状态售后记录' }),
      describe: intl.formatMessage({
        id: 'user.logOff.index.data.3.tips',
        defaultValue: '异常：您的账号内有未完成的售后，请先完成售后处理后再操作',
      }),
    },
    {
      key: 'notCompleteStore',
      title: intl.formatMessage({ id: 'user.logOff.index.data.4', defaultMessage: '账号无供应商/商家角色' }),
      describe: intl.formatMessage({
        id: 'user.logOff.index.data.4.tips',
        defaultValue: '异常：您的当前账号存在经营中的店铺，请将店铺关闭或下架后注销',
      }),
    },
    {
      key: 'notCompleteDispute',
      title: intl.formatMessage({ id: 'user.logOff.index.data.5', defaultMessage: '账号无任何纠纷' }),
      describe: intl.formatMessage({
        id: 'user.logOff.index.data.5.tips',
        defaultValue: '异常：您的当前账号存在纠纷，请联系平台处理',
      }),
    },
    {
      key: 'accountBalance',
      title: intl.formatMessage({
        id: 'user.logOff.index.data.6',
        defaultMessage: '账号的平台账号余额和商家店铺账号余额均为0',
      }),
      describe: intl.formatMessage({
        id: 'user.logOff.index.data.6.tips',
        defaultValue: '异常：您的平台或店铺账号尚有余额，请先提现再操作',
      }),
    },
    {
      key: 'notCompleteSettlement',
      title: intl.formatMessage({
        id: 'user.logOff.index.data.7',
        defaultMessage: '账号内无未完成的应收应付结算记录，无未还款的授信记录',
      }),
      describe: intl.formatMessage({
        id: 'user.logOff.index.data.7.tips',
        defaultValue: '异常：您的账号内有未完成的应收应付结算数据，请先完成结算再操作',
      }),
    },
    {
      key: 'notCompleteComplaint',
      title: intl.formatMessage({ id: 'user.logOff.index.data.8', defaultMessage: '账号没有待平台审核处理的投诉' }),
      describe: intl.formatMessage({
        id: 'user.logOff.index.data.8.tips',
        defaultValue: '异常：您的账号内有正在处理的投诉事件，请先待投诉事件完成后再操作',
      }),
    },
    {
      key: 'shelvesStatus',
      title: translate('mobile.resource.user.zhanghaoruoweipingtaishangjiaxuxiajiaquanbushangpin'),
      describe: translate('mobile.resource.user.nindezhanghaocunzaishangpinweixiajiaqingqbczhouzaicaozuo'),
    },
  ]

  useEffect(() => {
    getAsyncStorage(LOGOFF_DATA).then((res) => {
      setData(
        failItem.filter((item) => {
          return res.includes(item.key)
        }),
      )
    })
  }, [])

  const onFail = () => {
    Router.navigateBack({ delta: 2 })
  }

  return {
    data,
    onFail,
  }
}

export default useLogOffFail
