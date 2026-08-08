import { useState } from 'react'
import {
  postMemberManageLogin,
  postMemberSecurityCheck,
  postMemberManagePhoneSms,
  postMemberManageEmailSms,
  PostMemberSecurityCheckResponse,
} from '@apps/apis'
import { encryptedByAES, decryptedByAES } from '@linkseeks/crypto'
import { useRequestApi } from '@linkseeks/hooks'
import useAuth from '@apps/services/auth/useAuth'
import { Modal, Form, message } from '@linkseeks/ui'
import styles from '../style.less'
import { history, RouterManager } from '@linkseeks/router-manager'
import { authService } from '@apps/services'

const useLogin = () => {
  const { runAsync } = useRequestApi(postMemberManageLogin, { manual: true })
  const { setAuth } = useAuth()
  const [checkAccount, setCheckAccount] = useState<string>()
  const [checkAccountType, setCheckAccountType] = useState<'phone' | 'email'>('phone')
  const [accountInfo, setAccountInfo] = useState<PostMemberSecurityCheckResponse>()
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [checkLoading, setCheckLoading] = useState<boolean>(false)
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [verifyForm] = Form.useForm()
  const [loginForm] = Form.useForm()

  const login = async (values) => {
    try {
      setConfirmLoading(true)
      const { data, code } = await runAsync(values)
      setConfirmLoading(false)
      if (code === 1000 && data) {
        message.destroy()
        setModalVisible(false)
        setAuth(data)
        const authList = await authService.initAuthList()
        // 把第一个路由设置为首页
        if (authList && authList.length > 0) {
          RouterManager.setHomePath(authList[0].path)
        }
        if (data.updatePwdIntervalDays && data.updatePwdIntervalDays > 0) {
          const dayCount = Math.abs(data.updatePwdIntervalDays)
          Modal.confirm({
            className: styles['pwd-comfirm'],
            centered: true,
            width: 265,
            icon: null,
            okText: '更新密码',
            cancelText: '稍后处理',
            onCancel: () => {
              history.push('/')
            },
            onOk: () => {
              history.push('/home?updatePwd=true')
            },
            content: (
              <div style={{ textAlign: 'center' }}>
                <p>您的账号密码已超过{dayCount}天未更新，</p>
                <p>请尽快更新账号密码</p>
              </div>
            ),
          })
        } else {
          history.push('/')
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
      const res = await postMemberSecurityCheck(values, { penetrateError: true })
      setCheckLoading(false)
      message.destroy()
      if (res.code === 1000) {
        if (res.data.needCheck) {
          setAccountInfo(res.data)
          let tempCheckAccount = ''
          let tempCheckAcountype: 'phone' | 'email' = 'phone'
          const phone = res.data.phone ? decryptedByAES(res.data.phone) : ''
          const email = res.data.email ? decryptedByAES(res.data.email) : ''

          if (phone) {
            tempCheckAccount = phone
            tempCheckAcountype = 'phone'
          } else if (email) {
            tempCheckAccount = email
            tempCheckAcountype = 'email'
          }
          if (tempCheckAccount) {
            setCheckAccountType(tempCheckAcountype)
            setCheckAccount(tempCheckAccount)
            verifyForm.setFieldValue('checkAccount', tempCheckAccount)
            setModalVisible(true)
          } else {
            message.error('当前超级管理员账号存在安全风险，请通知管理人员重新设置账号验证信息')
          }
        } else {
          login(values)
        }
      } else {
        message.error(res.message)
      }
    } catch (error) {
      setCheckLoading(false)
    }
  }

  const handleStartSms = (form, remoteImg, setLoading, callback) => {
    if (checkAccount) {
      setLoading(true)
      if (checkAccountType === 'phone') {
        postMemberManagePhoneSms({
          telCode: '+86',
          phone: encryptedByAES(checkAccount),
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
        postMemberManageEmailSms({
          email: encryptedByAES(checkAccount, false),
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
  }
}

export default useLogin
