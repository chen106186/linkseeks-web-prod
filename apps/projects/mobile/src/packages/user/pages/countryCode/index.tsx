import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState, useEffect } from 'react'
import { View, Text } from '@apps/mobile-ui'
import Router from '@/utils/router'
import { getCurrentInstance, preload, showToast } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import { encryptedByAES } from '@linkseeks/crypto'
import CodeInput from '@/components/CodeInput'
import {
  postMemberMobileRegisterPswEmail,
  postMemberMobileRegisterPswEmailCheck,
  postMemberMobileRegisterPswSms,
  postMemberMobileRegisterPswSmsCheck,
} from '@apps/apis'
import cx from 'classnames'
import styles from './index.module.scss'
import { useMobileIntl } from '@apps/locales'
const CountryCode = () => {
  const COUNT_DOWN = 60
  const [value, setValue] = useState('')
  const [countSecond, setCountSecond] = useState(COUNT_DOWN)
  const intl = useIntl()
  const translate = useMobileIntl()
  const route: {
    params: any
  } = {
    params: getCurrentInstance().router?.params || {},
  }
  const {
    params: { type, phone, telCode, email },
  } = route
  let time = COUNT_DOWN
  const handleCountdown = () => {
    if (time > 0 && time <= COUNT_DOWN) {
      time -= 1
      setCountSecond(time)
      setTimeout(() => {
        handleCountdown()
      }, 1000)
    } else {
      time = COUNT_DOWN
      setCountSecond(time)
    }
  }

  useEffect(() => {
    handleCountdown()
  }, [])

  /* 获取验证码 */
  const getCode = () => {
    if (type === 'phone') {
      if (countSecond < COUNT_DOWN) return
      const params = {
        phone: encryptedByAES(phone),
        telCode: decodeURIComponent(String(telCode)),
      }
      postMemberMobileRegisterPswSms(params).then((res: any) => {
        if (res.code === 1000) {
          handleCountdown()
          showToast({
            title: intl.formatMessage({
              id: 'user.fasongchenggong',
              defaultMessage: '发送成功',
            }),
          })
        } else {
          showToast({
            title: intl.formatMessage({
              id: `${res.code}`,
              defaultMessage: res.message,
            }),
            icon: 'none',
          })
        }
      })
    } else {
      /* 邮箱 */
      const data = {
        email: encryptedByAES(decodeURIComponent(email), false),
      }
      postMemberMobileRegisterPswEmail(data).then((res: any) => {
        if (res.code === 1000) {
          showToast({
            title: intl.formatMessage({
              id: 'user.yichongxinfasongchenggong',
              defaultMessage: '已重新发送成功',
            }),
          })
        } else {
          showToast({
            title: intl.formatMessage({
              id: `${res.code}`,
              defaultMessage: res.message,
            }),
            icon: 'none',
          })
        }
      })
    }
  }
  const handleFinish = (val: string) => {
    setValue(val)
  }
  /* 跳转路由 */
  const routes = () => {
    let data: any = {}
    if (value) {
      if (type === 'phone') {
        data = {
          phone: encryptedByAES(phone),
          smsCode: encryptedByAES(value),
        }
        postMemberMobileRegisterPswSmsCheck({
          telCode: decodeURIComponent(telCode),
          ...data,
        }).then((res: any) => {
          if (res.code === 1000) {
            if (res.data?.length === 1) {
              preload({
                phone,
                smsCode: value,
              })
              // 只有一个主体，则直接继续
              Router.navigateTo('user/editPassword')
            } else {
              // 跳转到主体选择界面
              preload({
                multiAccInfoRespList: res.data,
                handleSubmit: (userId) => {
                  preload({
                    phone,
                    smsCode: value,
                    userId,
                  })
                  Router.navigateTo('user/editPassword')
                },
                activeUserId: [res.data?.[0]?.userId],
                submitText: translate('mobile.common.confirm'),
                mult: true,
                title: translate('public.wangjimima-jiance'),
              })
              Router.navigateTo('user/multAccInfoList')
            }
          } else {
            showToast({
              title: intl.formatMessage({
                id: `${res.code}`,
                defaultMessage: res.message,
              }),
              icon: 'none',
            })
          }
        })
      } else {
        data = {
          email: encryptedByAES(decodeURIComponent(email), false),
          smsCode: encryptedByAES(value),
        }
        postMemberMobileRegisterPswEmailCheck(data).then((res: any) => {
          if (res.code === 1000) {
            if (res.data?.length === 1) {
              // 只有一个主体，则直接继续
              preload({
                email: decodeURIComponent(email),
                smsCode: value,
              })
              Router.navigateTo('user/editPassword')
            } else {
              // 跳转到主体选择界面
              preload({
                multiAccInfoRespList: res.data,
                handleSubmit: (userId) => {
                  preload({
                    email: decodeURIComponent(email),
                    smsCode: value,
                    userId,
                  })
                  Router.navigateTo('user/editPassword')
                },
                activeUserId: [res.data?.[0]?.userId],
                submitText: translate('mobile.common.queding'),
                mult: true,
                title: translate('public.wangjimima-jiance'),
              })
              Router.navigateTo('user/multAccInfoList')
            }

            // Router.navigateTo('user/editPassword', {
            // 	email: decodeURIComponent(email),
            // 	smsCode: value,
            // })
            // prop.navigation.navigate('Editpassword', data)
          } else {
            showToast({
              title: intl.formatMessage({
                id: `${res.code}`,
                defaultMessage: res.message,
              }),
              icon: 'none',
            })
          }
        })
      }
    } else {
      showToast({
        title: intl.formatMessage({
          id: 'user.qingshuruyanzhengma',
          defaultMessage: '请输入验证码',
        }),
      })
    }
  }
  return (
    <View className={styles['container']}>
      <View className={styles['main']}>
        <Text className={styles['title']}>
          {intl.formatMessage({
            id: 'user.shurushoudaodeyanzhengma',
            defaultMessage: '输入收到的验证码',
          })}
        </Text>
        {/* 表单内容E */}
        <View className={styles['box']}>
          <CodeInput codeInputClassName={styles['boxStyle']} onFinish={handleFinish} />
        </View>

        {/*  表单内容S  */}
        <View className={styles['fromfoot']} onClick={() => routes()}>
          <View className={styles['btn']}>
            {intl.formatMessage({
              id: 'user.xiayibu',
              defaultMessage: '下一步',
            })}
          </View>
        </View>
        <View className={styles['CodeBox']}>
          <Text className={styles['CodeText']}>
            {intl.formatMessage({
              id: 'user.yanzhengmashixiao',
              defaultMessage: '验证码失效？',
            })}
          </Text>
          <Text
            className={cx(styles['getCode'], countSecond < COUNT_DOWN && styles.disabled)}
            onClick={() => getCode()}
          >
            {countSecond < COUNT_DOWN
              ? intl.formatMessage({
                  id: 'user.logOff.confirm.reGetCode',
                  defaultMessage: '({{second}}s)重新获取',
                  second: countSecond,
                })
              : intl.formatMessage({
                  id: 'user.dianjizhongfa',
                  defaultMessage: '点击重发',
                })}
          </Text>
        </View>
      </View>
    </View>
  )
}
export default GlobalWrapper(CountryCode)
