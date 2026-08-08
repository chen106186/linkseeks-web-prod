import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState } from 'react'
import { getCurrentInstance, showToast } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import { View, Text, Image, Input } from '@apps/mobile-ui'
import Router from '@/utils/router'
import ModeMobile from '@/components/Modemobile'
import { encryptedByAES } from '@linkseeks/crypto'
import { COUNTRY_PHONE_CODE, COUNTRY_PHONE_LENGTH } from '@/constants'
import {
  postMemberMobileRegisterPswEmail,
  postMemberMobileRegisterPswPhoneCheck,
  postMemberMobileRegisterPswSms,
} from '@apps/apis'
import styles from './index.module.scss'
import { useTelCode } from '@apps/services'
import { getOssUrlPath } from '@apps/constants'
import { useMobileIntl } from '@apps/locales'
const fill = getOssUrlPath('/miniprogram/assets/images/arrow-down-fill@2x.png')
const PasswordRecovery = () => {
  const intl = useIntl()
  const translate = useMobileIntl()
  const route: {
    params: any
  } = {
    params: getCurrentInstance().router?.params || {},
  }
  const {
    params: { type },
  } = route
  const [telCode, setCode] = useState(COUNTRY_PHONE_CODE) // 手机区号
  const [phoneLength, setPhoneLength] = useState(COUNTRY_PHONE_LENGTH)
  const [toggle, setToggle] = useState<boolean>(false) // 显示手机号模态框
  const [form, setForm] = useState<any>({
    phone: '',
    email: '',
  })
  const { getTelPattern } = useTelCode()

  /* 选择区号回调 */
  const onConfirm = (item) => {
    setCode(item.value)
    setPhoneLength(item.phoneLength)
    setToggle(false)
  }
  /* 关闭 */
  const onClose = (item) => {
    setToggle(item.toggle)
  }
  const submit = () => {
    const params = {
      ...form,
    }
    if (type === 'phone') {
      if (params.phone) {
        // 根据国家区号判断手机号是否正确
        if (!getTelPattern(telCode as any).test(params.phone)) {
          showToast({
            title: translate('mobile.common.qingshuruzhengquedeshoujihao'),
            icon: 'none',
          })
          return
        }
        params.telCode = telCode
        postMemberMobileRegisterPswPhoneCheck({
          ...params,
          phone: encryptedByAES(params.phone),
        }).then((res: any) => {
          if (res.code === 1000) {
            postMemberMobileRegisterPswSms({
              ...params,
              phone: encryptedByAES(params.phone),
            }).then((resj: any) => {
              if (resj.code === 1000 || resj.code === 1209) {
                Router.navigateTo('user/countryCode', {
                  phone: form.phone,
                  type,
                  telCode: telCode,
                })
                return
              } else {
                showToast({
                  title: resj.message,
                  icon: 'none',
                })
              }
            })
          } else {
            showToast({
              title: res.message,
              icon: 'none',
            })
          }
        })
      } else {
        showToast({
          title: intl.formatMessage({
            id: 'user.qingshurushoujihao',
            defaultMessage: '请输入手机号',
          }),
          icon: 'none',
        })
      }
    } else if (type === 'mail') {
      if (params.email) {
        /* 邮箱找回密码 */
        params.email = encryptedByAES(form.email, false)
        postMemberMobileRegisterPswEmail(params).then((res: any) => {
          if (res.code === 1000) {
            Router.navigateTo('user/countryCode', {
              type,
              email: form.email,
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
        showToast({
          title: intl.formatMessage({
            id: 'user.qingshuruyouxiang',
            defaultMessage: '请输入邮箱',
          }),
          icon: 'none',
        })
      }
    }
  }
  const setKey = (val, key) => {
    const formData = {
      ...form,
    }
    formData[key] = val
    setForm(formData)
  }
  return (
    <View className={styles['container']}>
      <Text className={styles['title']}>
        {type === 'phone'
          ? intl.formatMessage({
              id: 'user.shoujihaozhaohui',
              defaultMessage: '手机号找回',
            })
          : intl.formatMessage({
              id: 'user.youxiangzhaohui',
              defaultMessage: '邮箱找回',
            })}
      </Text>
      {type === 'phone' ? (
        <View className={styles['fromItem']}>
          <View className={styles['fill']}>
            <Text className={styles['code']} onClick={() => setToggle(true)}>
              {telCode}
            </Text>
            <Image src={fill} />
          </View>
          <Input
            placeholderClass={styles['placeholderText']}
            type="number"
            maxlength={phoneLength}
            placeholder={intl.formatMessage({
              id: 'user.qingshurushoujihao',
              defaultMessage: '请输入手机号',
            })}
            value={form.phone}
            onChange={(e) => setKey(e, 'phone')}
          />
        </View>
      ) : (
        <View className={styles['fromItem']}>
          <Input
            placeholderClass={styles['placeholderText']}
            placeholder={intl.formatMessage({
              id: 'user.qingshuruyouxiang',
              defaultMessage: '请输入邮箱',
            })}
            value={form.email}
            onChange={(e) => setKey(e, 'email')}
          />
        </View>
      )}
      <View className={styles['fomfoot']}>
        <View className={styles['btn']} onClick={submit}>
          {intl.formatMessage({
            id: 'user.queding',
            defaultMessage: '确定',
          })}
        </View>
      </View>
      <ModeMobile toggle={toggle} onConfirm={onConfirm} onClose={onClose} />
    </View>
  )
}
export default GlobalWrapper(PasswordRecovery)
