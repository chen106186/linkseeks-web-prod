import { useState } from 'react'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import { showToast, showLoading, hideLoading, preload } from '@apps/mobile-services/utils/taro'
import { COUNTRY_PHONE_CODE, COUNTRY_PHONE_LENGTH } from '@/constants'
import { encryptedByAES, decryptedByAES } from '@linkseeks/crypto'
import { getManageContentNoticeFindWithOutContent, postMemberMobileLogin, postMemberMobileLoginPhone } from '@apps/apis'
import useStores from '@/store/useStores'
import { loginSuccess, loginSuccessSetData } from '../features'
import { useLoginInfo } from '../contexts'
import { useLoginValidate } from './useLoginValidate'
import { setAsyncStorage } from '@apps/mobile-services/utils/storage'
import { useMobileIntl } from '@apps/locales'
import { postMemberMobileWeixinMiniAppLogin } from '@apps/apis'
import { getStorageSync } from '@apps/mobile-services/utils/taro'
import { DISTRIBUTION_INVITER_ACCOUNT } from '@/constants/storage'

type FunctionItem = {
  /**
   * 标题
   */
  title: string
  columnType: number
  /* 富文本 */
  content: string
  status: string
  id: string
  top: string
}

const useLogin = () => {
  const intl = useIntl()
  const {
    userStore: { shopAndSite, setUserInfo },
  } = useStores()
  const translate = useMobileIntl()
  const { setUpdatePwdToggle, setLoginData, setDayCount } = useLoginInfo()
  const loginTypeText = [
    intl.formatMessage({ id: 'user.yijiandenglu', defaultMessage: '一键登录' }),
    intl.formatMessage({ id: 'user.mimadenglu', defaultMessage: '密码登录' }),
    intl.formatMessage({ id: 'user.shoujihaomadenglu', defaultMessage: '手机号码登录' }),
  ]
  const [current, setCurrent] = useState(0)
  const [toggle, setToggle] = useState<boolean>(false) // 显示手机号模态框
  const [isOpenToggle, setIsOpenToggle] = useState(false)
  const [telCode, setCode] = useState(COUNTRY_PHONE_CODE) // 手机区号
  const [phoneLength, setPhoneLength] = useState(COUNTRY_PHONE_LENGTH)
  const [agree, setAgree] = useState<boolean>(false)
  const [columnTypeList, setColumnTypeList] = useState<FunctionItem[][]>([])
  const { multiAccountVisible, multiAccInfoRespList, dispatchLoginValidate, toggleMultiAccountVisible } =
    useLoginValidate()

  const Confirm = (flag) => {
    setToggle(flag)
    setIsOpenToggle(false)
  }

  /* 协议 */
  const findAllByColumnType = () => {
    getManageContentNoticeFindWithOutContent({ columnType: '2' }).then((res: any) => {
      if (res.code === 1000) {
        setColumnTypeList(res.data)
      }
    })
  }

  /* 选择区号回调 */
  const onConfirm = (item) => {
    setCode(item.value)
    setPhoneLength(item.phoneLength)
    setToggle(false)
  }
  const goJump = (type: string) => {
    setIsOpenToggle(false)
    Router.navigateTo('user/passwordRecovery', {
      type,
    })
  }
  /* 关闭 */
  const onClose = (item) => {
    setToggle(item.toggle)
  }

  const onUpdatePassword = () => {
    Router.redirectTo('basicSetting/verifys', { type: 'password' })
  }

  const onLogin = async (formData, type: 'account' | 'mobile') => {
    const postData: any = { ...formData, shopType: 1 }
    if (postData.phone) {
      postData.phone = encryptedByAES(postData.phone)
    }
    if (postData.smsCode) {
      postData.phoneSmsCode = encryptedByAES(postData.smsCode)
      postData.smsCode = encryptedByAES(postData.smsCode)
    }
    if (postData.account) {
      postData.account = encryptedByAES(postData.account)
    }

    postData.loginType = type === 'account' ? 1 : 4

    const result = await dispatchLoginValidate(postData)

    if (result.code !== 1000) {
      showToast({
        title: result.message,
        icon: 'none',
      })
      return
    }
    if (result.data?.length === 1) {
      // 只有一个主体，则直接继续
      setAsyncStorage('isMultCompany', '0')
      emitOnLogin(postData, type, result.data[0].userId)
    } else {
      // 跳转到主体选择界面
      setAsyncStorage('isMultCompany', '1')
      preload({
        multiAccInfoRespList: result.data,
        handleSubmit: ({ userId }) => emitOnLogin(postData, type, userId),
        submitText: translate('public.login'),
        activeUserId: result.data?.[0]?.userId,
        title: translate('public.duozhuti-jiance-denglu'),
      })
      Router.navigateTo('user/multAccInfoList')
    }
  }
  const clickLogin = async (params) => {
    const inviterAccount = getStorageSync(DISTRIBUTION_INVITER_ACCOUNT)
    if (inviterAccount) {
      params.inviterAccount = inviterAccount
    }
    emitOnLogin(params, 'oneClick')
  }
  const emitOnLogin = async (postData, type, activeUserId?) => {
    const service =
      type === 'account'
        ? postMemberMobileLogin
        : type === 'oneClick'
        ? postMemberMobileWeixinMiniAppLogin
        : postMemberMobileLoginPhone
    showLoading({
      title: intl.formatMessage({ id: 'user.login.loading', defaultMessage: '登录中' }),
    })
    const res = await service(activeUserId ? { ...postData, userId: encryptedByAES(activeUserId) } : postData)
    hideLoading()
    if (res.code !== 1000) {
      showToast({
        title: intl.formatMessage({ id: `${res.code}`, defaultMessage: res.message }),
        icon: 'none',
      })
      return Promise.reject()
    } else {
      await loginSuccessSetData(res.data, setUserInfo)
      if (res.data.updatePwdIntervalDays && res.data.updatePwdIntervalDays > 0) {
        const dayCount = Math.abs(res.data.updatePwdIntervalDays)
        setDayCount(dayCount)
        setUpdatePwdToggle(true)
        setLoginData(res.data)
      } else {
        loginSuccess(shopAndSite, res.data)
      }
    }
  }
  return {
    clickLogin,
    loginTypeText,
    current,
    toggle,
    isOpenToggle,
    telCode,
    phoneLength,
    agree,
    columnTypeList,
    setCurrent,
    setAgree,
    setIsOpenToggle,
    Confirm,
    onConfirm,
    goJump,
    onClose,
    onUpdatePassword,
    onLogin,
    findAllByColumnType,
  }
}

export default useLogin
