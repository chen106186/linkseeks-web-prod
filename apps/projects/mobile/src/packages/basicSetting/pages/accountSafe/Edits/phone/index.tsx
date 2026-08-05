import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { showToast, getCurrentInstance, pxTransform, showModal } from '@apps/mobile-services/utils/taro'
import { View, Input, Form, Toast, Text, Image } from '@apps/mobile-ui'
import { getAsyncStorage, setAsyncStorage } from '@apps/mobile-services/utils/storage'
import ModeMobile from '@/components/Modemobile'
import { SECURITY_GET, USER_INFO } from '@/constants/storage'
import { encryptedByAES } from '@linkseeks/crypto'
import Router from '@/utils/router'
import { COUNTRY_PHONE_CODE, COUNTRY_PHONE_LENGTH } from '@/constants'
import useStores from '@/store/useStores'
import { useIntl } from '@linkseeks/i18n'
import { decryptedByAES } from '@linkseeks/crypto'
import {
  getMemberMobileSecurityGet,
  postMemberMobileSecurityPaySms,
  postMemberMobileSecurityPaySmsCheck,
  postMemberMobileSecurityPhoneSmsCheckNew,
  postMemberMobileSecurityPhoneSmsTonew,
  postMemberMobileSecurityPhoneUpdate,
} from '@apps/apis'
import Layout from '../layout'
import styles from '../style.module.scss'
import { useTelCode } from '@apps/services'
import { useMobileIntl } from '@apps/locales'
import { getOssUrlPath } from '@apps/constants'
import { THEME_COLORS } from '@/constants/theme'

const caretdown = getOssUrlPath('/miniprogram/assets/images/arrow-down-fill@2x.png')
const EditPassword: React.FC = (props: any) => {
  const intl = useIntl()
  const { getTelPattern } = useTelCode()
  const translate = useMobileIntl()
  const route: {
    params: any
  } = {
    params: getCurrentInstance().router?.params || {},
  }
  const {
    params: { type },
  } = route
  const {
    userStore: { refreshUserInfo },
  } = useStores()
  const [btnDisabled, setBtnDisabled] = useState(false) // 禁止点击发送验证
  const [btnContent, setBtnContent] = useState(
    intl.formatMessage({
      id: 'user.huoquyanzhengma',
      defaultMessage: '获取验证码',
    }),
  ) // f发送验证码文字
  const [telCode, setCode] = useState(COUNTRY_PHONE_CODE) // 手机区号
  const [toggle, setToggle] = useState(false) // 显示区号弹出
  const [usePhone, setPhone] = useState('')
  const [max, setMax] = useState(COUNTRY_PHONE_LENGTH)
  const [formItems, setFormItems] = useState<{
    phone: string
    smsCode?: string
  }>({
    phone: '',
    smsCode: '',
  })

  /* 倒计时 */
  let time = 60
  const handleCountdown = () => {
    if (time > 0 && time <= 60) {
      time -= 1
      setBtnContent(time < 10 ? `0${time}s` : `${time}s`)
      setBtnDisabled(true)
      setTimeout(() => {
        handleCountdown()
      }, 1000)
    } else {
      time = 60
      setBtnDisabled(false)
      setBtnContent(
        intl.formatMessage({
          id: 'user.huoquyanzhengma',
          defaultMessage: '获取验证码',
        }),
      )
    }
  }
  /* 获取验证码 */
  const getCode = () => {
    const phone = formItems.phone
    if (!phone) {
      Toast.show({
        title: intl.formatMessage({
          id: 'user.qingshurunindexinshouji',
          defaultMessage: '请输入您的新手机号码',
        }),
        icon: 'none',
      })
    } else {
      // 根据国家区号判断手机号是否正确
      if (type === 'phone' && !getTelPattern(telCode as any).test(phone)) {
        showToast({
          title: translate('mobile.common.qingshuruzhengquedeshoujihao'),
          icon: 'none',
        })
        return
      }
      const param: any = {
        telCode,
        phone: encryptedByAES(phone),
      }
      let Codefn: any // 校验类型
      // eslint-disable-next-line prefer-const
      Codefn = type !== 'phone' ? postMemberMobileSecurityPaySms : postMemberMobileSecurityPhoneSmsTonew
      Codefn(param).then((res: any) => {
        if (res.code === 1000) {
          handleCountdown()
          // Toast.show('');
          const toastOpts: Taro.showToast.Option = {
            title: intl.formatMessage({
              id: 'user.fasongchenggong',
              defaultMessage: '发送成功',
            }),
            icon: 'success',
            mask: true,
          }
          Toast.show(toastOpts)
        } else {
          const toastOpts: Taro.showToast.Option = {
            title: res.message,
            mask: true,
            icon: 'none',
          }
          Toast.show(toastOpts)
        }
      })
    }
  }

  /* 选着区号HTML */
  const countryCodeView = () => (
    <View
      className={cx(styles['mobile'], styles['clear'])}
      style={{
        display: 'flex',
      }}
      onClick={() => {
        if (type === 'phone') {
          setToggle(!toggle)
        }
      }}
    >
      <Text className={styles['country-code']}>{telCode}</Text>
      <Image className={cx(styles['mobile-icon'], styles['fl-right'])} src={caretdown} />
      <Text className={cx(styles['solid'], styles['fl-right'])}> </Text>
    </View>
  )
  /* 修改手机号 */
  const PhoneUpdate = async (data: any) => {
    const param = {
      ...data,
    }
    param.telCode = telCode
    if (param.phone) {
      param.phone = encryptedByAES(param.phone)
    }
    if (param.smsCode) {
      param.smsCode = encryptedByAES(param.smsCode)
    }
    const res = await postMemberMobileSecurityPhoneSmsCheckNew(param)
    if (res.code === 1000) {
      // eslint-disable-next-line no-shadow
      const response = await postMemberMobileSecurityPhoneUpdate(param)
      if (response.code === 1000) {
        refreshUserInfo()
        Toast.show({
          title: intl.formatMessage({
            id: 'user.xiugaichenggong',
            defaultMessage: '修改成功',
          }),
        })
        Router.navigateBack()
      }
    } else {
      const toastOpts: Taro.showToast.Option = {
        title: intl.formatMessage({
          id: `${res.code}`,
          defaultMessage: res.message,
        }),
        mask: true,
        icon: 'none',
      }
      Toast.show(toastOpts)
    }
  }
  /* 获取用户信息 */
  const getUserInfo = async () => {
    await getAsyncStorage(USER_INFO).then((res: any) => {
      setPhone(res.phone)
    })
  }
  /* 修改支付密码 */
  const getpay = (smsCode: any) => {
    postMemberMobileSecurityPaySmsCheck({
      smsCode: encryptedByAES(smsCode),
    }).then((res: any) => {
      if (res.code === 1000) {
        Router.redirectTo('basicSetting/paycode', {
          smsCode: encryptedByAES(smsCode),
        })
      } else {
        const toastOpts: Taro.showToast.Option = {
          title: intl.formatMessage({
            id: `${res.code}`,
            defaultMessage: res.message,
          }),
          mask: true,
          icon: 'none',
        }
        Toast.show(toastOpts)
        // Toast.show(intl.formatMessage({id: `${res.code}`, defaultMessage: res.message}))
      }
    })
  }
  const onSubmit = () => {
    const param = {
      ...formItems,
    }
    if (!param.phone || !param.smsCode) {
      Toast.show({
        title: !param.phone
          ? intl.formatMessage({
              id: 'user.qingshurushoujihaoma',
              defaultMessage: '请输入手机号码',
            })
          : intl.formatMessage({
              id: 'user.qingshuruyanzhengma',
              defaultMessage: '请输入验证码',
            }),
        icon: 'none',
      })
      return
    }
    if (usePhone === formItems.phone) {
      Toast.show({
        title: intl.formatMessage({
          id: 'user.xiugaishoujihaomayudang',
          defaultMessage: '修改手机号码与当前手机号一致',
        }),
        icon: 'none',
      })
    } else {
      type === 'phone' ? PhoneUpdate(param) : getpay(param.smsCode)
    }
  }
  const getSecurity = () => {
    getMemberMobileSecurityGet().then((res: any) => {
      if (res.code === 1000 && res.data) {
        const data = {
          ...res.data,
          phone: res.data?.phone ? decryptedByAES(res.data?.phone) : undefined,
          email: res.data?.email ? decryptedByAES(res.data?.email, false) : undefined,
        }
        const phone = data?.phone.split(' ')
        setCode(phone[0])
        setFormItems({
          ...formItems,
          phone: phone[1],
        })
        setAsyncStorage(SECURITY_GET, data)
      }
    })
  }

  /* 获取上个页面信息请求接口信息 */
  const getPageData = async () => {
    await getAsyncStorage(SECURITY_GET).then((res: any) => {
      if (!res) {
        getSecurity()
        return
      }
      const phone = res.phone.split(' ')
      setCode(phone[0])
      setFormItems({
        ...formItems,
        phone: phone[1],
      })
    })
  }

  // input 输入写入
  const changeInputValue = (key: string, val: any) => {
    setFormItems({
      ...formItems,
      [key]: val,
    })
  }
  useEffect(() => {
    if (type !== 'phone') {
      getPageData()
    }
    getUserInfo()
  }, [])
  return (
    <Layout
      onSubmit={onSubmit}
      title={
        type === 'phone'
          ? intl.formatMessage({
              id: 'user.shuruxinshouji',
              defaultMessage: '输入新手机',
            })
          : intl.formatMessage({
              id: 'user.dangqianbangdingshoujihao',
              defaultMessage: '当前绑定手机号',
            })
      }
    >
      {() => (
        <View className={styles['wrap']}>
          <Form>
            <View className={styles['input-wrap']}>
              {countryCodeView()}
              {type === 'phone' ? (
                <Input
                  placeholderStyle="#C0C4CC"
                  maxlength={max}
                  name="phone"
                  type="phone"
                  value={formItems.phone}
                  placeholder={intl.formatMessage({
                    id: 'user.qingshurushoujihaoma',
                    defaultMessage: '请输入手机号码',
                  })}
                  style={{
                    marginLeft: pxTransform(0),
                    borderBottomColor: THEME_COLORS.borderLight,
                  }}
                  onChange={(e) => changeInputValue('phone', e)}
                />
              ) : (
                <View className={styles['at-input']}>{formItems.phone}</View>
              )}
            </View>
            <View className={styles['input-wrap']}>
              <Input
                placeholder={intl.formatMessage({
                  id: 'user.qingshuruyanzhengma',
                  defaultMessage: '请输入验证码',
                })}
                name="smsCode"
                value={formItems.smsCode}
                style={{
                  width: '100%',
                  flex: 3,
                  marginLeft: pxTransform(0),
                    borderBottomColor: THEME_COLORS.borderLight,
                }}
                placeholderStyle="#C0C4CC"
                onChange={(e) => changeInputValue('smsCode', e)}
              >
                <View className={styles['border']}>
                  <Text
                    className={styles['country-code']}
                    onClick={() => {
                      if (!btnDisabled) {
                        getCode()
                      }
                    }}
                  >
                    {btnContent}
                  </Text>
                </View>
              </Input>
            </View>
          </Form>
          {/* 选着手机区号 */}
          <ModeMobile
            toggle={toggle}
            onClose={() => {
              setToggle(false)
            }}
            onConfirm={(data) => {
              setCode(data.value)
              setMax(data.phoneLength)
              setToggle(false)
            }}
          />
        </View>
      )}
    </Layout>
  )
}
export default GlobalWrapper(EditPassword)
