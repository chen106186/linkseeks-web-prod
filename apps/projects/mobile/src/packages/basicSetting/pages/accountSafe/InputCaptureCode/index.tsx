import GlobalWrapper from '@/components/GlobalWrapper'
/* eslint-disable no-unneeded-ternary */
import React, { useEffect, useState } from 'react'
import { showToast, getCurrentInstance } from '@apps/mobile-services/utils/taro'
import { SECURITY_GET } from '@/constants/storage'
import { View, Text, Toast } from '@apps/mobile-ui'
import CodeInput from '@/components/CodeInput'
import { encryptedByAES } from '@linkseeks/crypto'
import { getAsyncStorage } from '@apps/mobile-services/utils/storage'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import {
  postMemberMobileSecurityEmailEmail,
  postMemberMobileSecurityEmailEmailCheck,
  postMemberMobileSecurityEmailSms,
  postMemberMobileSecurityEmailSmsCheck,
  postMemberMobileSecurityPayCheck,
  postMemberMobileSecurityPhoneEmail,
  postMemberMobileSecurityPhoneEmailCheck,
  postMemberMobileSecurityPhoneSms,
  postMemberMobileSecurityPhoneSmsCheck,
  postMemberMobileSecurityPswEmail,
  postMemberMobileSecurityPswEmailCheck,
  postMemberMobileSecurityPswSms,
  postMemberMobileSecurityPswSmsCheck,
} from '@apps/apis'
import { JumpParams } from '../Verifys'
import Capture from '../components/capture'
import styles from './index.module.scss'
interface RouteParams {
  type: 'password' | 'phone' | 'paycode' | 'email' // 修改手机， 修改邮箱， 修改密码
  verify: JumpParams // 验证方式
}
const InputCaptureCode: React.FC = (props) => {
  const route = {
    params: getCurrentInstance().preloadData || {},
  }
  const intl = useIntl()
  const {
    params: {
      type,
      verify: { name, value },
    },
  } = route
  const [hasPayPassword, sethasPayPassword] = useState<any>()
  const renderHeader = () => {
    if (name === 'phone') {
      return (
        <>
          <Text className={styles['title']}>
            {intl.formatMessage({
              id: 'user.weilequerennindeshenfen',
              defaultMessage: '为了确认您的身份，需要验证手机号',
            })}
          </Text>
          <Text className={styles['tips']}>{`${intl.formatMessage({
            id: 'user.yanzhengmayifasongzhinin',
            defaultMessage: '验证码已发送至您的手机',
          })} ${value}`}</Text>
        </>
      )
    }
    if (name === 'email') {
      return (
        <>
          <Text className={styles['title']}>
            {intl.formatMessage({
              id: 'user.weilequerennindeshenfen2',
              defaultMessage: '为了确认您的身份，需要验证邮箱',
            })}
          </Text>
          <Text className={styles['tips']}>
            {`${intl.formatMessage({
              id: 'user.yanzhengmayifasongzhinindeyouxiang',
              defaultMessage: '验证码已发送至您的邮箱',
            })} ${value}`}
          </Text>
        </>
      )
    }
    return (
      <Text className={styles['title']}>
        {intl.formatMessage({
          id: 'user.qingshuruzhifumima',
          defaultMessage: '请输入支付密码',
        })}
      </Text>
    )
  }
  /* 获取验证码 */
  const GetCode = () => {
    let SmsType: any // 修改类型
    /* phone 发送手机号码 */
    switch (type) {
      /* 修改密码 */
      case 'password':
        SmsType = name === 'phone' ? postMemberMobileSecurityPswSms : postMemberMobileSecurityPswEmail
        break
      /* 修改邮箱 */
      case 'email':
        SmsType = name === 'phone' ? postMemberMobileSecurityEmailSms : postMemberMobileSecurityEmailEmail
        break
      /* 修改登录手机号码 */
      case 'phone':
        SmsType = name === 'phone' ? postMemberMobileSecurityPhoneSms : postMemberMobileSecurityPhoneEmail
        break
      default:
        break
    }
    SmsType().then((res: any) => {
      if (res.code === 1000) {
        // setLoading(true)

        // Toast.show('发送成功')
        const toastOpts: Taro.showToast.Option = {
          title: intl.formatMessage({
            id: 'user.fasongchenggong',
            defaultMessage: '发送成功',
          }),
          icon: 'success',
          mask: true,
        }
        Toast.show(toastOpts)
        // Toast.show(intl.formatMessage({id: `${res.code}`, defaultMessage: res.message}))
      } else {
        // setloadingText(res.message)
        // setLoading(true)
        // setTimeout(() => {
        //   setLoading(false)
        // }, 2000);
        // Toast.show(intl.formatMessage({id: `${res.code}`, defaultMessage: res.message}))

        const toastOpts: Taro.showToast.Option = {
          title: intl.formatMessage({
            id: `${res.code}`,
            defaultMessage: res.message,
          }),
          mask: true,
        }
        Toast.show(toastOpts)
      }
    })
  }
  /* 验证手机号码 */
  const handleFinish = (code: string) => {
    const routePath = {
      password: 'basicSetting/password',
      phone: 'basicSetting/phone',
      paycode: 'basicSetting/paycode',
      email: 'basicSetting/email',
    }
    if (code.length === 6) {
      let Check: any // 校验类型
      switch (type) {
        case 'password':
          switch (name) {
            case 'phone':
              Check = postMemberMobileSecurityPswSmsCheck
              break
            case 'email':
              Check = postMemberMobileSecurityPswEmailCheck
              break
            case 'paycode':
              Check = postMemberMobileSecurityPayCheck
              break
            default:
              break
          }
          break
        case 'email':
          switch (name) {
            case 'phone':
              Check = postMemberMobileSecurityEmailSmsCheck
              break
            case 'email':
              Check = postMemberMobileSecurityEmailEmailCheck
              break
            case 'paycode':
              Check = postMemberMobileSecurityPayCheck
              break
            default:
              break
          }
          break
        case 'phone':
          switch (name) {
            case 'phone':
              Check = postMemberMobileSecurityPhoneSmsCheck
              break
            case 'email':
              Check = postMemberMobileSecurityPhoneEmailCheck
              break
            case 'paycode':
              Check = postMemberMobileSecurityPayCheck
              break
            default:
              break
          }
          break
        default:
          break
      }
      // console.log(123213, routePath[type], type, hasPayPassword)
      const paramData =
        name === 'paycode'
          ? {
              payPassword: encryptedByAES(code),
            }
          : {
              smsCode: encryptedByAES(code),
            }
      Check(paramData).then((res: any) => {
        if (res.code === 1000) {
          if (type === 'phone') {
            Router.redirectTo(routePath[type], {
              type: 'phone',
            })
          } else {
            console.log(routePath[type], 'routePath[type]')
            Router.redirectTo(routePath[type])
          }
        } else {
          // Toast.show(intl.formatMessage({id: `${res.code}`, defaultMessage: res.message}))
          const toastOpts: Taro.showToast.Option = {
            title: intl.formatMessage({
              id: `${res.code}`,
              defaultMessage: res.message,
            }),
            mask: true,
            icon: 'none',
          }
          Toast.show(toastOpts)
          // if (hasPayPassword === 0) {
          //   navigation.navigate('Phone', { type: 'paycode' })
          // }
        }
      })
    }
  }
  const CodeDom = () => (
    <Capture
      beforeGetCode={() => GetCode()}
      className={styles['get-code-btn-wrap']}
      render={(count: number) =>
        count === 0 ? (
          <Text className={styles['get-code-btn']}>
            {intl.formatMessage({
              id: 'user.huoquyanzhengma',
              defaultMessage: '获取验证码',
            })}
          </Text>
        ) : (
          <Text className={styles['get-code-btn']}>{`${count}${intl.formatMessage({
            id: 'user.miaohouchongxinfasong',
            defaultMessage: '秒后重新发送',
          })}`}</Text>
        )
      }
    />
  )
  const getInfo = async () => {
    await getAsyncStorage(SECURITY_GET).then((res: any) => {
      sethasPayPassword(res.hasPayPassword)
    })
  }
  useEffect(() => {
    // KeyBorardManager.setEnableAutoToolbar(true)
    getInfo()
  }, [])
  return (
    <View className={styles['page']}>
      <View className={styles['view']}>
        <View className={styles['test']}>
          <View className={styles['header']}>{renderHeader()}</View>
          <CodeInput autoFocus maxLength={6} onFinish={handleFinish} isEncrypt={name === 'paycode' ? true : false} />
          {name !== 'paycode' ? CodeDom() : <Text> </Text>}
        </View>
        <View className={styles['other']}>
          <Text className={styles['text']} onClick={() => Router.redirectTo('basicSetting/verifys')}>
            {intl.formatMessage({
              id: 'user.huangeyanzhengfangshi',
              defaultMessage: '换个验证方式',
            })}
          </Text>
        </View>
      </View>
      {/* <Loading customStyle={styles.loading} loading={loading} text={loadingText} vertical size={0} textSize={14} /> */}
    </View>
  )
}
export default GlobalWrapper(InputCaptureCode)
