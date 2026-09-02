import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import useLogin from '../useLogin'
import {
  postMemberLogin,
  postMemberSecurityCheck,
  postMemberLoginPhoneSms,
  postMemberLoginEmailSms,
  PostMemberSecurityCheckResponse,
} from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'
import { encryptedByAES, decryptedByAES, decodeURLBase64 } from '@linkseeks/crypto'
import { useRequestApi } from '@linkseeks/hooks'
import { Modal, Form, message } from '@linkseeks/ui'
import { authService } from '@apps/services'
import { recentVisitLocalStorage } from '@linkseeks/storage'
import { usePageStatus } from '@/hooks/usePageStatus'
import styles from '../../index.less'
import { LOGIN_CHECK_TYPE } from '../constants'
import { useLoginValidate } from '../useLoginValidate'
import { history, RouterManager } from '@linkseeks/router-manager'
import { useGlobal } from '@apps/container'
/**
 * 初始化整个状态内容
 */
const initLoginContextDispatch = () => {
  const { redirect } = usePageStatus()
  const { runAsync } = useRequestApi(postMemberLogin, { manual: true })
  const intl = useIntl()
  const [checkAccount, setCheckAccount] = useState<string>()
  const [checkAcountShow, setCheckAccountShow] = useState<string>()
  const [checkAccountType, setCheckAccountType] = useState<'phone' | 'email'>('phone')
  const [accountInfo, setAccountInfo] = useState<PostMemberSecurityCheckResponse>()
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [checkLoading, setCheckLoading] = useState<boolean>(false)
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [verifyForm] = Form.useForm()
  const [loginForm] = Form.useForm()
  const [activeUserId, setActiveUserId] = useState(0)

  const loginDataRef = useRef<any>({})

  const { multiAccountVisible, multiAccInfoRespList, dispatchLoginValidate, toggleMultiAccountVisible } =
    useLoginValidate()
  const { setAvatar } = useGlobal()
  useEffect(() => {
    if (multiAccInfoRespList && multiAccInfoRespList?.length > 0) {
      setActiveUserId(multiAccInfoRespList?.[0]?.userId)
    }
  }, [multiAccInfoRespList])

  const loginSuccess = async () => {
    const authList = await authService.initAuthList()
    // 把第一个路由设置为首页
    if (authList && authList.length > 0) {
      RouterManager.setHomePath(authList[0].path)
    }
    if (redirect) {
      // 同源 redirect 统一交给 RouterManager，避免后端菜单路径绕过 /platform 前缀。
      const decoded = decodeURIComponent(decodeURLBase64(redirect))
      const redirectUrl = new URL(decoded, window.location.origin)
      if (redirectUrl.origin !== window.location.origin) {
        location.replace(decoded)
      } else {
        RouterManager.setHomePath(`${redirectUrl.pathname}${redirectUrl.search}${redirectUrl.hash}`)
        history.goHome(true)
      }
    } else {
      history.goHome(true)
    }
  }

  const login = async (values) => {
    try {
      setConfirmLoading(true)
      const { data, code } = await runAsync(values)
      setConfirmLoading(false)
      if (code === 1000 && data) {
        message.destroy()
        setModalVisible(false)
        authService.setAuth(data)
        setAvatar(data.logo)
        recentVisitLocalStorage.removeItem()
        if (data.updatePwdIntervalDays && data.updatePwdIntervalDays > 0) {
          const dayCount = Math.abs(data.updatePwdIntervalDays)
          Modal.confirm({
            className: styles['pwd-comfirm'],
            centered: true,
            width: 265,
            icon: null,
            okText: intl.formatMessage({
              id: 'member.login.update.pwd',
              defaultMessage: '更新密码',
            }),
            cancelText: intl.formatMessage({
              id: 'member.login.later.pwd',
              defaultMessage: '稍后处理',
            }),
            onCancel: () => {
              loginSuccess()
            },
            onOk: () => {
              history.redirect('/systemAbility/accountSetting/loginPwd')
            },
            content: (
              <div style={{ textAlign: 'center' }}>
                <p>
                  {intl.formatMessage({
                    id: 'member.login.intervalDays.tip1',
                    defaultMessage: '您的账号密码已超过{{days}}天未更新，',
                    days: dayCount,
                  })}
                </p>
                <p>
                  {intl.formatMessage({
                    id: 'member.login.intervalDays.tip2',
                    defaultMessage: '请尽快更新账号密码',
                  })}
                </p>
              </div>
            ),
          })
        } else {
          loginSuccess()
        }
      }
    } catch (error) {
      setConfirmLoading(false)
    }
  }

  const handleSubmit = async (values: any) => {
    try {
      values.account = encryptedByAES(values.account)
      values.password = encryptedByAES(values.password, false)
      // 预登录
      setCheckLoading(true)

      const {
        data,
        message: msg,
        code,
      } = await dispatchLoginValidate({
        ...values,
        loginType: LOGIN_CHECK_TYPE.PASSWORD,
      })
      if (code === 1000) {
        // 只有一个主体则直接登录
        if (data?.length === 1) {
          const item = data[0]
          validateAdmin({
            ...values,
            userId: encryptedByAES(item.userId),
          })
        }
      } else {
        message.error(msg)
      }
      setCheckLoading(false)
    } catch (error) {
      setCheckLoading(false)
    }
  }

  const validateAdmin = async (values) => {
    // @todo 通过某一项做判断是否需要验证码校验
    const res = await postMemberSecurityCheck(values, { penetrateError: true })
    setCheckLoading(false)
    message.destroy()
    if (res.code === 1000) {
      if (res.data.needCheck) {
        setAccountInfo(res.data)
        let tempCheckAccount = ''
        let tempCheckAcountype: 'phone' | 'email' = 'phone'
        const phone = res.data.phone ? res.data.phone : ''
        const email = res.data.email ? res.data.email : ''
        if (phone) {
          tempCheckAccount = phone
          tempCheckAcountype = 'phone'
        } else if (email) {
          tempCheckAccount = email
          tempCheckAcountype = 'email'
        }
        console.log(loginDataRef.current)
        if (tempCheckAccount) {
          setModalVisible(true)
          setCheckAccountType(tempCheckAcountype)
          setCheckAccount(tempCheckAccount)
          setCheckAccountShow(
            loginDataRef.current?.account || loginDataRef.current?.phone || loginDataRef.current?.email,
          )
          verifyForm.setFieldValue('checkAccount', tempCheckAccount)
        } else {
          message.error('当前超级管理员账号存在安全风险，请通知管理人员重新设置账号验证信息')
        }
      } else {
        login(values)
      }
    } else {
      message.error(res.message)
    }
  }
  const validateSmsCode = async () => {
    let values = { ...loginDataRef.current }
    values.account = encryptedByAES(values.account)
    values.password = encryptedByAES(values.password)
    values.userId = encryptedByAES(activeUserId)
    const codeItem = multiAccInfoRespList.find((v) => v.userId === activeUserId)
    if (codeItem?.needCheckSmsCode) {
      validateAdmin(values)
    } else {
      login(values)
    }
  }
  const handleStartSms = (form, remoteImg, setLoading, callback) => {
    if (checkAccount) {
      setLoading(true)
      if (checkAccountType === 'phone') {
        postMemberLoginPhoneSms({
          telCode: '+86',
          phone: checkAccount,
        })
          .then((res) => {
            if (res.code === 1000) {
              callback()
            }
          })
          .catch(() => {
            setLoading(false)
          })
        return
      } else if (checkAccountType === 'email') {
        postMemberLoginEmailSms({
          email: checkAccount,
        })
          .then((res) => {
            if (res.code === 1000) {
              callback()
            }
          })
          .catch(() => {
            setLoading(false)
          })
      }

      return
    }
  }

  const handleAdminVerify = () => {
    verifyForm.validateFields().then((values) => {
      const account = loginForm.getFieldValue('account')
      const password = loginForm.getFieldValue('password')
      const params = {
        account: encryptedByAES(account),
        password: encryptedByAES(password),
        userId: encryptedByAES(activeUserId),
        phoneSmsCode: '',
        emailSmsCode: '',
      }
      if (checkAccountType === 'email') {
        params.emailSmsCode = encryptedByAES(values.smsCode)
      } else {
        params.phoneSmsCode = encryptedByAES(values.smsCode)
      }
      login(params)
    })
  }

  const handleSwitchCheckoutAccountType = (type: 'phone' | 'email') => {
    setCheckAccountType(type)
    setCheckAccount(decryptedByAES(type === 'email' ? accountInfo?.email : accountInfo?.phone))
  }

  return {
    verifyForm,
    loginForm,
    checkAccount,
    setCheckAccountShow,
    checkAccountType,
    modalVisible,
    confirmLoading,
    checkLoading,
    accountInfo,
    handleSubmit,
    setModalVisible,
    handleStartSms,
    handleAdminVerify,
    handleSwitchCheckoutAccountType,
    validateSmsCode,
    multiAccInfoRespList,
    multiAccountVisible,
    toggleMultiAccountVisible,
    loginDataRef,
    activeUserId,
    setActiveUserId,
    checkAcountShow,
  }
}

export type InitLoginContextProps = ReturnType<typeof initLoginContextDispatch>

const InitLoginContextContainer = createContext<InitLoginContextProps>({} as InitLoginContextProps)

export const useInitLoginContext = () => {
  return useContext(InitLoginContextContainer)
}

export const InitLoginContextProvider = ({ children }) => {
  const value = initLoginContextDispatch()

  return <InitLoginContextContainer.Provider value={value}>{children}</InitLoginContextContainer.Provider>
}
