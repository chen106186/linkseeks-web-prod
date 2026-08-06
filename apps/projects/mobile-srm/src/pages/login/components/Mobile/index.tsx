import React, { useState, useMemo } from 'react'
import { View, Text, Image } from '@apps/mobile-ui'
import { Input as TaroInput } from '@tarojs/components'
import cx from 'classnames'
import { showToast, pxTransform } from '@apps/mobile-services/utils/taro'
import fill from '@/assets/images/arrow-down-fill@2x.png'
import { observer } from 'mobx-react-lite'
import { useIntl } from '@linkseeks/i18n'
import { postMemberMobileWechatAppletSends } from '@apps/apis'
import { encryptedByAES } from '@linkseeks/crypto'
import styles from '../../index.module.scss'

interface Iprops {
  /**
   * code
   *
   * */
  countryCode: string
  /**
   * 确认
   *
   * */
  Confirm: (value: any) => void
  phoneLength: number
  /**
   * 登录回掉
   * */
  submit: (data: any) => void
}
type MobileParamsType = {
  phone: string
  smsCode: string
  countryCode: string
  shopType: string
}
const MobileView: React.FC<any> = (props: Iprops) => {
  const intl = useIntl()
  const { countryCode, Confirm, phoneLength, submit } = props
  const [btnContent, setBtnContent] = useState<any>(
    intl.formatMessage({ id: 'user.huoquyanzhengma', defaultMessage: ' 获取验证码' }),
  ) // f发送验证码文字
  const [btnDisabled, setBtnDisabled] = useState(false) // 禁止点击发送验证

  const [from, setFrom] = useState<MobileParamsType>({
    phone: '',
    smsCode: '',
    countryCode: '',
    shopType: '',
  })

  const _disableState = useMemo(() => {
    if (from.phone && from.smsCode) {
      return false
    }
    return true
  }, [from])

  /* 倒计时 */
  let time = 60
  const hanleCountdown = () => {
    if (time > 0 && time <= 60) {
      time -= 1
      setBtnContent(time < 10 ? `0${time}s` : `${time}s`)
      setBtnDisabled(true)
      setTimeout(() => {
        hanleCountdown()
      }, 1000)
    } else {
      time = 60
      setBtnDisabled(false)
      setBtnContent(intl.formatMessage({ id: 'user.huoquyanzhengma', defaultMessage: '获取验证码' }))
    }
  }
  // 获取国家代码和手机号码位数
  const getcode = async () => {
    const phone = from.phone
    if (!btnDisabled) {
      if (!phone) {
        showToast({
          title: intl.formatMessage({ id: 'user.qingshurushoujihaoma', defaultMessage: '请输入手机号码' }),
          icon: 'none',
        })
      } else {
        const param = {
          telCode: countryCode,
          phone: encryptedByAES(phone),
        }
        const res = await postMemberMobileWechatAppletSends(param)
        if (res.code === 1000) {
          hanleCountdown()
          showToast({
            title: intl.formatMessage({ id: 'user.fasongchenggong', defaultMessage: '发送成功' }),
            icon: 'none',
          })
        }
      }
    }
  }
  const setKey = (val, key) => {
    setFrom((prev) => ({ ...prev, [key]: val }))
  }
  /* 点击手机号码显示弹出 */
  const onCode = () => {
    Confirm(true)
  }
  const login = async () => {
    if (_disableState) return
    const param: any = from
    if (!param.phone || !param.smsCode) {
      showToast({
        title: !param.phone
          ? intl.formatMessage({ id: 'user.qingshurushoujihaoma', defaultMessage: '请输入手机号码' })
          : intl.formatMessage({ id: 'user.qingshuruyanzhengma', defaultMessage: '请输入验证码' }),
        icon: 'none',
      })
      return
    }
    const data = {
      ...param,
      phone: encryptedByAES(param.phone),
      smsCode: encryptedByAES(param.smsCode),
      telCode: countryCode,
      shopType: 1,
      countryCode,
    }

    submit(data)
  }
  return (
    <View className={styles['MobileView']}>
      <View className={styles['fromItem']}>
        <View className={styles['fill']}>
          <Text className={styles['code']} onClick={onCode}>
            {countryCode}
          </Text>
          <Image src={fill} style={{ width: pxTransform(16), height: pxTransform(16) }} />
        </View>
        <TaroInput
          value={from.phone}
          disabled={false}
          type="number"
          maxlength={phoneLength}
          placeholderClass={styles['placeholderText']}
          placeholder={intl.formatMessage({ id: 'user.qingshurushoujihao', defaultMessage: '请输入手机号' })}
          onInput={(e) => setKey(e.detail.value, 'phone')}
        />
      </View>
      <View className={styles['fromFlex']}>
        <TaroInput
          value={from.smsCode}
          disabled={false}
          placeholderClass={styles['placeholderText']}
          placeholder={intl.formatMessage({ id: 'user.qingshuruyanzhengma', defaultMessage: '请输入验证码' })}
          onInput={(e) => setKey(e.detail.value, 'smsCode')}
        />
        <Text onClick={getcode} style={{ color: '#333' }}>
          {btnContent}{' '}
        </Text>
      </View>
      <View className={cx(styles['Submit'], _disableState ? styles['Submit__disable'] : '')} onClick={login}>
        {intl.formatMessage({ id: 'user.denglu', defaultMessage: '登录' })}
      </View>
    </View>
  )
}
export default observer(MobileView)
