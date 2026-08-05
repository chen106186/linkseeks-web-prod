import React from 'react'
import { View, Input, Text, Image } from '@apps/mobile-ui'
import { observer } from 'mobx-react-lite'
import { useIntl } from '@linkseeks/i18n'
import { getOssUrlPath } from '@apps/constants'
import useLoginMobile from '../../services/hooks/useLoginMobile'
import styles from './index.module.scss'

const fill = getOssUrlPath('/miniprogram/assets/images/arrow-down-fill@2x.png')

interface Iprops {
  /**
   * code
   *
   * */
  telCode: string
  /**
   * 确认
   *
   * */
  Confirm: (value: any) => void
  phoneLength: number
}

const MobileView: React.FC<any> = (props: Iprops) => {
  const intl = useIntl()
  const { telCode, Confirm, phoneLength } = props
  const { form, btnContent, btnDisabled, setKey, getCode, onCode, login } = useLoginMobile(props)

  return (
    <View className={styles['MobileView']}>
      <View className={styles['fromItem']}>
        <View className={styles['fill']}>
          <Text className={styles['code']} onClick={onCode}>
            {telCode}
          </Text>
          <Image src={fill} />
        </View>
        <Input
          value={form.phone}
          type="number"
          maxlength={phoneLength}
          placeholderClass={styles['placeholderText']}
          placeholder={intl.formatMessage({ id: 'user.qingshurushoujihao', defaultMessage: '请输入手机号' })}
          onChange={(e) => setKey(e, 'phone')}
        />
      </View>
      <View className={styles['fromFlex']}>
        <Input
          value={form.smsCode}
          placeholderClass={styles['placeholderText']}
          placeholder={intl.formatMessage({ id: 'user.qingshuruyanzhengma', defaultMessage: '请输入验证码' })}
          onChange={(e) => setKey(e, 'smsCode')}
        />
        <Text
          className={
            btnDisabled || form.phone.length !== phoneLength ? styles['phone-code-disabled'] : styles['phone-code']
          }
          onClick={getCode}
        >
          {btnContent}
        </Text>
      </View>
      <View className={styles['Submit']} onClick={login}>
        {intl.formatMessage({ id: 'user.denglu', defaultMessage: '登录' })}
      </View>
    </View>
  )
}
export default observer(MobileView)
