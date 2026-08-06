import React, { useState, useMemo } from 'react'
import { View, Image } from '@apps/mobile-ui'
import { Input as TaroInput } from '@tarojs/components'
import cx from 'classnames'
import { observer } from 'mobx-react-lite'
import Eye from '@/assets/images/eye.png'
import EyeOff from '@/assets/images/EyeOff.png'
import { useIntl } from '@linkseeks/i18n'
import { pxTransform, showToast } from '@apps/mobile-services/utils/taro'
import styles from '../../index.module.scss'

type MobileParamsType = {
  account: string
  password: string
  shopType: number
}

interface Iprops {
  submit: (data: MobileParamsType) => void
}
const SingView: React.FC<any> = (props: Iprops) => {
  const intl = useIntl()
  const { submit } = props
  const [from, setFrom] = useState<MobileParamsType>({
    account: '',
    password: '',
    shopType: 1,
  })
  const [type, setType] = useState<boolean>(true)
  const [loginflag, setloginflag] = useState(false)

  const _disableState = useMemo(() => {
    if (from.account && from.password) {
      return false
    }
    return true
  }, [from])

  const setKey = (val, key) => {
    setFrom((prev) => ({ ...prev, [key]: val }))
  }
  /* 请求登录 */
  const login = async () => {
    if (_disableState) return
    if (!loginflag) {
      setloginflag(true)
      if (!from.account || !from.password) {
        setloginflag(false)
        showToast({
          title: !from.account
            ? intl.formatMessage({ id: 'user.qingshuruyonghuminghuoshou', defaultMessage: '请输入用户名或手机号码' })
            : intl.formatMessage({ id: 'user.qingshurumima', defaultMessage: '请输入密码' }),
          icon: 'none',
        })
        return
      }

      submit(from)
      setTimeout(() => {
        setloginflag(false)
      }, 1000)
    }
  }
  return (
    <View className={styles['MobileView']}>
      <View className={styles['fromItem']}>
        <TaroInput
          value={from.account}
          disabled={false}
          placeholderClass={styles['placeholderText']}
          placeholder={intl.formatMessage({
            id: 'user.qingshuruyonghumingshou',
            defaultMessage: '请输入用户名/手机号',
          })}
          onInput={(e) => setKey(e.detail.value, 'account')}
        />
      </View>
      <View className={styles['fromFlex']}>
        <TaroInput
          value={from.password}
          disabled={false}
          type="text"
          password={type ? true : false}
          placeholderClass={styles['placeholderText']}
          placeholder={intl.formatMessage({ id: 'user.qingshurumima', defaultMessage: '请输入密码' })}
          onInput={(e) => setKey(e.detail.value, 'password')}
        />
        <View className={styles['Imgbox']} onClick={() => setType(!type)}>
          <Image
            style={{ width: pxTransform(16), height: pxTransform(16), color: '#C8CACD' }}
            src={type ? EyeOff : Eye}
          />
        </View>
      </View>
      <View className={cx(styles['Submit'], _disableState ? styles['Submit__disable'] : '')} onClick={login}>
        {intl.formatMessage({ id: 'user.denglu', defaultMessage: '登录' })}
      </View>
    </View>
  )
}
export default observer(SingView)
