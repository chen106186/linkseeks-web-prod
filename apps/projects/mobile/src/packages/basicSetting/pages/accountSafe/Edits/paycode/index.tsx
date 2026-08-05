import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState } from 'react'
import { View, Input, Form, Image, Toast } from '@apps/mobile-ui'
import { encryptedByAES } from '@linkseeks/crypto'
import { pxTransform, useRouter } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import { postMemberMobileSecurityPayUpdate } from '@apps/apis'
import { getOssUrlPath } from '@apps/constants'
import Layout from '../layout'
import styles from '../style.module.scss'
import { THEME_COLORS } from '@/constants/theme'
const pad = getOssUrlPath('/miniprogram/assets/images/pad.png')
const Padative = getOssUrlPath('/miniprogram/assets/images/padative.png')
const PayCode: React.FC = () => {
  const intl = useIntl()
  const {
    params: { smsCode },
  } = useRouter()
  const [state, setState] = useState<boolean>(true)
  const [state1, setState1] = useState<boolean>(true)
  const [formItems, setFormItems] = useState<{
    payPassword: string
    payPassword1?: string
  }>({
    payPassword: '',
    payPassword1: '',
  })
  const onSubmit = () => {
    const param = {
      ...formItems,
    }
    if (param.payPassword.length !== 6) {
      Toast.show({
        title: intl.formatMessage({
          id: 'user.mimawei6weishuzi',
          defaultMessage: '密码为6位数字，不能使用简单密码',
        }),
        icon: 'none',
      })
      return
    }
    if (!param.payPassword1 || param.payPassword1.length !== 6) {
      Toast.show({
        title: intl.formatMessage({
          id: 'user.qingzaicishuruzhengquezhi',
          defaultMessage: '请再次输入正确支付密码',
        }),
        icon: 'none',
      })
      return
    }
    if (param.payPassword !== param.payPassword1) {
      Toast.show({
        title: intl.formatMessage({
          id: 'user.liangcizhifumimabuyi',
          defaultMessage: '两次支付密码不一致',
        }),
        icon: 'none',
      })
    } else {
      delete param.payPassword1
      param.payPassword = encryptedByAES(param.payPassword)
      postMemberMobileSecurityPayUpdate({
        ...param,
        phoneCode: decodeURIComponent(smsCode as string),
      }).then((res: any) => {
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
        id: 'user.shuruxindezhifumima',
        defaultMessage: '输入新的支付密码',
      })}
    >
      {() => (
        <View className={styles['wrap']}>
          <Form>
            <View className={styles['input-wrap']}>
              <Input
                placeholder={intl.formatMessage({
                  id: 'user.qingshuruxindezhifumi',
                  defaultMessage: '请输入新的支付密码',
                })}
                name="payPassword"
                type={state ? 'password' : 'text'}
                value={formItems.payPassword}
                maxlength={6}
                style={{
                  marginLeft: pxTransform(0),
                  borderBottomColor: THEME_COLORS.borderLight,
                }}
                onChange={(e) => changeInputValue('payPassword', e)}
                className={styles['input-after']}
              >
                <Image
                  onClick={() => setState(!state)}
                  style={{
                    width: pxTransform(20),
                    height: pxTransform(20),
                  }}
                  src={state ? pad : Padative}
                />
              </Input>
            </View>
            <View className={styles['input-wrap']}>
              <Input
                placeholder={intl.formatMessage({
                  id: 'user.qingzaicishuruxindezhi',
                  defaultMessage: '请再次输入新的支付密码',
                })}
                name="payPassword1"
                type={state1 ? 'password' : 'text'}
                value={formItems.payPassword1}
                maxlength={6}
                style={{
                  marginLeft: pxTransform(0),
                  borderBottomColor: THEME_COLORS.borderLight,
                }}
                onChange={(e) => changeInputValue('payPassword1', e)}
                className={styles['input-after']}
              >
                <Image
                  onClick={() => setState1(!state1)}
                  style={{
                    width: pxTransform(20),
                    height: pxTransform(20),
                  }}
                  src={state1 ? pad : Padative}
                />
              </Input>
            </View>
          </Form>
        </View>
      )}
    </Layout>
  )
}
export default GlobalWrapper(PayCode)
