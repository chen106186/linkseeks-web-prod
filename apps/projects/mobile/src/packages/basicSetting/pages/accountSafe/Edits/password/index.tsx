import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState } from 'react'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Text, Input, Form, Toast, Image } from '@apps/mobile-ui'
import usePasswordVerify from '@apps/services/verify/usePasswordVerify'
import { encryptedByAES } from '@linkseeks/crypto'
import { PATTERN_MAPS } from '@/constants/regExp'
import { getOssUrlPath } from '@apps/constants'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import { postMemberMobileSecurityPswUpdate } from '@apps/apis'
import PasswordVerify from '@/components/PasswordVerify'
import Layout from '../layout'
import styles from '../style.module.scss'
const pad = getOssUrlPath('/miniprogram/assets/images/pad.png')
const Padative = getOssUrlPath('/miniprogram/assets/images/padative.png')
const EditPassword: React.FC = () => {
  const intl = useIntl()
  const [formItems, setFormItems] = useState<{
    password: string
    password1?: string
  }>({
    password: '',
    password1: '',
  })
  const [state1, setState1] = useState<boolean>(true)
  const [state, setState] = useState<boolean>(true)
  const { success, score } = usePasswordVerify(formItems.password)
  const onSubmit = () => {
    const param = formItems
    if (!PATTERN_MAPS.password.test(param.password)) {
      Toast.show({
        title: intl.formatMessage({
          id: 'user.zimushuzihuofuhao',
          defaultMessage: '字母+数字或符号至少二种以上字符组成的8-20位字符，区分大小写',
        }),
        icon: 'none',
      })
      return
    }
    if (!param.password1 || !PATTERN_MAPS.password.test(param.password1)) {
      Toast.show({
        title: intl.formatMessage({
          id: 'user.qingzaicishurumima',
          defaultMessage: '请再次输入密码',
        }),
        icon: 'none',
      })
      return
    }
    // if (!PATTERN_MAPS.lengthReg.test(param.password)) {
    //   Toast.show({ title: intl.formatMessage({ id: 'user.password.length', defaultMessage: '密码长度8-20个字符' }) })
    //   return
    // }
    if (param.password.indexOf(' ') > -1) {
      Toast.show({
        title: intl.formatMessage({
          id: 'user.password.space',
          defaultMessage: '密码不能包含空格',
        }),
      })
      return
    }
    // if (!PATTERN_MAPS.wordReg.test(param.password)) {
    //   Toast.show({
    //     title: intl.formatMessage({
    //       id: 'user.password.require',
    //       defaultMessage: '密码必须包含大写字母、小写字母和数字',
    //     }),
    //   })
    //   return
    // }
    if (score < 2) {
      Toast.show({
        title: intl.formatMessage({
          id: 'user.password.reset',
          defaultMessage: '当前密码强度弱，请重新设置密码',
        }),
      })
      return
    }
    if (formItems.password !== formItems.password1) {
      Toast.show({
        title: intl.formatMessage({
          id: 'user.liangcimimashurubuyi',
          defaultMessage: '两次密码输入不一致',
        }),
        icon: 'none',
      })
    } else {
      param.password = encryptedByAES(param.password)
      delete param.password1
      postMemberMobileSecurityPswUpdate(param).then((res: any) => {
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
        id: 'user.shuruxinmima',
        defaultMessage: '输入新密码',
      })}
    >
      {() => (
        <View className={styles['wrap']}>
          <Form>
            <Input
              placeholderStyle="#C0C4CC"
              placeholder={intl.formatMessage({
                id: 'user.qingshuruxinmima',
                defaultMessage: '请输入新密码',
              })}
              name="password"
              type={state ? 'password' : 'text'}
              value={formItems.password}
              style={{
                alignItems: 'center',
                marginLeft: pxTransform(0),
                borderBottomColor: '#F4F5F7',
              }}
              maxlength={20}
              onChange={(e) => changeInputValue('password', e)}
              className={styles['input-after']}
            >
              <Image onClick={() => setState(!state)} src={state ? pad : Padative} />
            </Input>
            {formItems.password ? <PasswordVerify score={score} /> : <View />}
            <Input
              placeholder={intl.formatMessage({
                id: 'user.qingzaicishurumima1',
                defaultMessage: '请再次输入密码',
              })}
              name="password1"
              type={state1 ? 'password' : 'text'}
              value={formItems.password1}
              maxlength={20}
              placeholderStyle="#C0C4CC"
              style={{
                alignItems: 'center',
                marginLeft: pxTransform(0),
                borderBottomColor: '#F4F5F7',
              }}
              onChange={(e) => changeInputValue('password1', e)}
              className={styles['input-after']}
              customStyle={{
                marginTop: pxTransform(16),
              }}
            >
              <Image onClick={() => setState1(!state1)} src={state1 ? pad : Padative} />
            </Input>
          </Form>
          <Text className={styles['tips']}>
            {intl.formatMessage({
              id: 'user.zimushuzihuofuhao',
              defaultMessage: '字母+数字或符号至少二种以上字符组成的8-20位字符，区分大小写',
            })}
          </Text>
        </View>
      )}
    </Layout>
  )
}
export default GlobalWrapper(EditPassword)
