import React, { useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { View, Input, Image } from '@apps/mobile-ui'
import { pxTransform, showToast } from '@apps/mobile-services/utils/taro'
import { observer } from 'mobx-react-lite'
import Eye from '@/assets/images/eye.png'
import EyeOff from '@/assets/images/EyeOff.png'
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

  const setKey = (val, key) => {
    const fromData = from
    fromData[key] = val
    setFrom({ ...fromData })
  }
  /* 请求登录 */
  const login = async () => {
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
        <Input
          value={from.account}
          placeholderClass="placeholderText"
          placeholder={intl.formatMessage({
            id: 'user.qingshuruyonghumingshou',
            defaultMessage: '请输入用户名/手机号',
          })}
          onChange={(e) => setKey(e, 'account')}
        />
      </View>
      <View className={styles['fromFlex']}>
        <Input
          value={from.password}
          type="text"
          password={type ? true : false}
          placeholderClass="placeholderText"
          placeholder={intl.formatMessage({ id: 'user.qingshurumima', defaultMessage: '请输入密码' })}
          onChange={(e) => setKey(e, 'password')}
        />
        <View className={styles['Imgbox']} onClick={() => setType(!type)}>
          <Image style={{ width: pxTransform(16), height: pxTransform(16) }} src={type ? EyeOff : Eye} />
        </View>
      </View>
      <View className={styles['Submit']} onClick={login}>
        {intl.formatMessage({ id: 'user.denglu', defaultMessage: '登录' })}
      </View>
    </View>
  )
}
export default observer(SingView)
