import React from 'react'
import { View, Input, Image } from '@apps/mobile-ui'
import { observer } from 'mobx-react-lite'
import { useIntl } from '@linkseeks/i18n'
import { getOssUrlPath } from '@apps/constants'
import useLoginSing from '../../services/hooks/useLoginSing'
import styles from './index.module.scss'

const EyeOff = getOssUrlPath('/miniprogram/assets/images/EyeOff.png')
const Eye = getOssUrlPath('/miniprogram/assets/images/eye.png')

interface SingView {
  /** 协议 */
  agree?: boolean
}

const SingView: React.FC<SingView> = (props) => {
  const intl = useIntl()
  const { agree } = props
  const { form, type, accountFocus, passwordFocus, setType, setKey, login, setAccountFocus, setPasswordFocus } =
    useLoginSing(agree)

  return (
    <View className={styles['MobileView']}>
      <View className={styles['fromItem']}>
        <Input
          value={form.account}
          placeholderClass={styles['placeholderText']}
          placeholder={
            !accountFocus
              ? intl.formatMessage({
                  id: 'user.qingshuruyonghumingshou',
                  defaultMessage: '请输入用户账号/手机号',
                })
              : ''
          }
          onChange={(e) => setKey(e, 'account')}
          onFocus={() => {
            setAccountFocus(true)
          }}
          onBlur={() => {
            setAccountFocus(false)
          }}
        />
      </View>
      <View className={styles['fromFlex']}>
        <Input
          value={form.password}
          type="text"
          password={type ? false : true}
          placeholderClass={styles['placeholderText']}
          placeholder={
            !passwordFocus ? intl.formatMessage({ id: 'user.qingshurumima', defaultMessage: '请输入密码' }) : ''
          }
          onChange={(e) => setKey(e, 'password')}
          onFocus={() => {
            setPasswordFocus(true)
          }}
          onBlur={() => {
            setPasswordFocus(false)
          }}
        />
        <Image src={type ? EyeOff : Eye} onClick={() => setType(!type)} />
      </View>
      <View className={styles['Submit']} onClick={login}>
        {intl.formatMessage({ id: 'user.denglu', defaultMessage: '登录' })}
      </View>
    </View>
  )
}
export default observer(SingView)
