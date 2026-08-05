import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState } from 'react'
import { View, Input, Form, Toast, Text } from '@apps/mobile-ui'
import Loading from '@/components/Loading'
import { useIntl } from '@linkseeks/i18n'
import { encryptedByAES } from '@linkseeks/crypto'
import Router from '@/utils/router'
import { postMemberMobileSecurityEmailEmailTonew, postMemberMobileSecurityEmailUpdate } from '@apps/apis'
import Layout from '../layout'
import styles from '../style.module.scss'
const EditEmail: React.FC = () => {
  const intl = useIntl()
  const [loading, setLoading] = useState<boolean>(false)
  const [btnDisabled, setBtnDisabled] = useState(false) // 禁止点击发送验证
  const [btnContent, setBtnContent] = useState(
    intl.formatMessage({
      id: 'user.huoquyanzhengma',
      defaultMessage: '获取验证码',
    }),
  ) // f发送验证码文字
  const [formItems, setFormItems] = useState<any>({
    email: '',
    smsCode: '',
  })
  const onSubmit = () => {
    const param = {
      ...formItems,
    }
    if (!param.email) {
      Toast.show({
        title: intl.formatMessage({
          id: 'user.qingshurunindexinyouxiang',
          defaultMessage: '请输入您的新邮箱',
        }),
        icon: 'none',
      })
      return
    }
    if (!param.smsCode) {
      Toast.show({
        title: intl.formatMessage({
          id: 'user.qingshuruyanzhengma',
          defaultMessage: '请输入验证码',
        }),
        icon: 'none',
      })
    } else {
      param.email = encryptedByAES(param.email, false)
      param.smsCode = encryptedByAES(param.smsCode)
      postMemberMobileSecurityEmailUpdate(param).then((res: any) => {
        if (res.code === 1000) {
          Toast.show({
            title: intl.formatMessage({
              id: 'user.xiugaichenggong',
              defaultMessage: '修改成功',
            }),
          })
          Router.navigateBack()
        } else {
          Toast.show({
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
  /* 倒计时 */
  let time: any = 60
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
    if (!loading && !btnDisabled) {
      const email = formItems.email
      setLoading(true)
      if (!email) {
        Toast.show({
          title: intl.formatMessage({
            id: 'user.qingshurunindexinyouxiang',
            defaultMessage: '请输入您的新邮箱',
          }),
          icon: 'none',
        })
        setLoading(false)
      } else {
        const param: any = {
          email: encryptedByAES(email, false),
        }
        postMemberMobileSecurityEmailEmailTonew(param)
          .then((res: any) => {
            if (res.code === 1000) {
              handleCountdown()
              Toast.show({
                title: intl.formatMessage({
                  id: 'user.fasongchenggong',
                  defaultMessage: '发送成功',
                }),
              })
            } else {
              Toast.show({
                title: intl.formatMessage({
                  id: `${res.code}`,
                  defaultMessage: res.message,
                }),
                icon: 'none',
              })
            }
          })
          .catch(() => {
            Toast.show({
              title: intl.formatMessage({
                id: 'user.fasongshibai',
                defaultMessage: '发送失败',
              }),
              icon: 'none',
            })
          })
          .finally(() => {
            setLoading(false)
          })
      }
    }
  }

  // input 输入写入
  const changeInputValue = (key: string, val: any) => {
    setFormItems({
      ...formItems,
      [key]: val,
    })
  }
  return (
    <Layout
      onSubmit={onSubmit}
      title={intl.formatMessage({
        id: 'user.shuruxinyouxiang',
        defaultMessage: '输入新邮箱',
      })}
    >
      {() => (
        <View className={styles['wrap']}>
          <Form>
            <View className={styles['input-wrap']}>
              <Input
                placeholder={intl.formatMessage({
                  id: 'user.qingshurunindeyouxiang',
                  defaultMessage: '请输入您的邮箱',
                })}
                name="email"
                value={formItems.email}
                onChange={(e) => changeInputValue('email', e)}
              />
            </View>
            <View className={styles['input-wrap']}>
              <Input
                placeholder={intl.formatMessage({
                  id: 'user.qingshuruyanzhengma',
                  defaultMessage: '请输入验证码',
                })}
                name="smsCode"
                value={formItems.smsCode}
                onChange={(e) => changeInputValue('smsCode', e)}
              >
                <Text className={styles['country-Code']} onClick={getCode}>
                  {btnContent}
                </Text>
              </Input>
            </View>
          </Form>
          <Loading
            customStyle={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              backgroundColor: '#000',
              width: '100px',
              height: '100px',
              marginLeft: '-50px',
              marginTop: '-50px',
              opacity: 0.8,
              zIndex: 101,
            }}
            loading={loading}
            vertical
            size={40}
            textSize={14}
          />
        </View>
      )}
    </Layout>
  )
}
export default GlobalWrapper(EditEmail)
