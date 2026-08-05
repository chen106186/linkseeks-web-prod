import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState } from 'react'
import usePasswordVerify from '@apps/services/verify/usePasswordVerify'
import { getCurrentInstance, showToast } from '@apps/mobile-services/utils/taro'
import { useIntl } from '@linkseeks/i18n'
import Router from '@/utils/router'
import { PATTERN_MAPS } from '@/constants/regExp'
import { encryptedByAES } from '@linkseeks/crypto'
import { View, Text, Image, Input, Toast } from '@apps/mobile-ui'
import { postMemberMobileRegisterResetEmail, postMemberMobileRegisterResetSms } from '@apps/apis'
import PasswordVerify from '@/components/PasswordVerify'
import { getOssUrlPath } from '@apps/constants'
import styles from './index.module.scss'
const EyeOff = getOssUrlPath('/miniprogram/assets/images/EyeOff.png')
const Eye = getOssUrlPath('/miniprogram/assets/images/eye.png')
const EditPassword = () => {
  const { phone, smsCode, email, userId } = getCurrentInstance().preloadData as any
  const intl = useIntl()
  const [type, setType] = useState<boolean>(false)
  const [type1, setType1] = useState<boolean>(false)
  const [form, setForm] = useState<any>({
    password: '',
    password1: '',
  })
  const { success, score } = usePasswordVerify(form.password)
  const setKey = (val, key) => {
    const fromData = {
      ...form,
    }
    fromData[key] = val
    setForm(fromData)
  }
  /* 修改密码 */
  const onSubmit = () => {
    const param = {
      ...form,
    }
    if (!PATTERN_MAPS.password.test(param.password)) {
      showToast({
        title: intl.formatMessage({
          id: 'user.zimushuzihuofuhao',
          defaultMessage: '字母+数字或符号至少二种以上字符组成的8-20位字符，区分大小写',
        }),
        icon: 'none',
      })
      return
    }
    if (!PATTERN_MAPS.password.test(param.password)) {
      showToast({
        title: intl.formatMessage({
          id: 'user.qingzaicishurumima1',
          defaultMessage: '请再次输入密码',
        }),
        icon: 'none',
      })
      return
    }
    // if (!PATTERN_MAPS.lengthReg.test(param.password)) {
    //   showToast({ title: intl.formatMessage({ id: 'user.password.length', defaultMessage: '密码长度8-20个字符' }) })
    //   return
    // }
    if (param.password.indexOf(' ') > -1) {
      showToast({
        title: intl.formatMessage({
          id: 'user.password.space',
          defaultMessage: '密码不能包含空格',
        }),
      })
      return
    }
    // if (!PATTERN_MAPS.wordReg.test(param.password)) {
    //   showToast({
    //     title: intl.formatMessage({
    //       id: 'user.password.require',
    //       defaultMessage: '密码必须包含大写字母、小写字母和数字',
    //     }),
    //   })
    //   return
    // }
    if (score < 2) {
      showToast({
        title: intl.formatMessage({
          id: 'user.password.reset',
          defaultMessage: '当前密码强度弱，请重新设置密码',
        }),
      })
      return
    }
    if (param.password !== param.password1) {
      showToast({
        title: intl.formatMessage({
          id: 'user.liangcimimashurubuyi',
          defaultMessage: '两次密码输入不一致',
        }),
        icon: 'none',
      })
    } else {
      delete param.password1
      /* 手机号码修改 */
      if (phone) {
        postMemberMobileRegisterResetSms({
          ...param,
          userIdList: userId,
          phone: encryptedByAES(phone),
          smsCode: encryptedByAES(smsCode),
          password: encryptedByAES(param.password),
        }).then((res: any) => {
          if (res.code === 1000) {
            showToast({
              title: intl.formatMessage({
                id: 'user.mimaxiugaichenggong',
                defaultMessage: '密码修改成功',
              }),
            })
            setTimeout(() => {
              Router.reLaunch('user/login')
            }, 2000)
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
      } else {
        /* 邮箱修改 */
        postMemberMobileRegisterResetEmail({
          ...param,
          userIdList: userId,
          email: encryptedByAES(decodeURIComponent(email), false),
          smsCode: encryptedByAES(smsCode),
          password: encryptedByAES(param.password),
        }).then((res: any) => {
          if (res.code === 1000) {
            showToast({
              title: intl.formatMessage({
                id: 'user.mimaxiugaichenggong',
                defaultMessage: '密码修改成功',
              }),
            })
            setTimeout(() => {
              Router.reLaunch('user/login')
            }, 2000)
          } else {
            console.log(res, 'err')
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
  }
  return (
    <View className={styles['container']}>
      <Text className={styles['title']}>
        {intl.formatMessage({
          id: 'user.shuruxinmima',
          defaultMessage: '输入新密码',
        })}
      </Text>
      <View className={styles['fromFlex']}>
        <Input
          value={form.password}
          type={'text'}
          password={!type}
          placeholderClass={styles['placeholderText']}
          placeholder={intl.formatMessage({
            id: 'user.qingshurumima',
            defaultMessage: '请输入密码',
          })}
          onChange={(e) => setKey(e, 'password')}
        />
        <Image src={type ? Eye : EyeOff} onClick={() => setType(!type)} />
      </View>
      {form.password ? <PasswordVerify score={score} /> : <View />}
      <View className={styles['fromFlex']}>
        <Input
          value={form.password1}
          type={'text'}
          password={!type1}
          placeholderClass={styles['placeholderText']}
          placeholder={intl.formatMessage({
            id: 'user.qingzaicishurumima1',
            defaultMessage: '请再次输入密码',
          })}
          onChange={(e) => setKey(e, 'password1')}
        />
        <Image src={type1 ? Eye : EyeOff} onClick={() => setType1(!type1)} />
      </View>
      <View className={styles['Tip']}>
        {intl.formatMessage({
          id: 'user.zimushuzihuofuhao',
          defaultMessage: '字母+数字或符号至少二种以上字符组成的8-20位字符，区分大小写',
        })}
      </View>
      <View className={styles['fromfoot']}>
        <View className={styles['btn']} onClick={onSubmit}>
          {intl.formatMessage({
            id: 'user.queding',
            defaultMessage: '确定',
          })}
        </View>
      </View>
    </View>
  )
}
export default GlobalWrapper(EditPassword)
