import React from 'react'
import { View, Button } from '@apps/mobile-ui'
import { observer } from 'mobx-react-lite'
import { useIntl } from '@linkseeks/i18n'
import useLoginOnClick from '../../services/hooks/useLoginOnClick'
import styles from './index.module.scss'

interface OnClick {
  /** 协议 */
  agree?: boolean
}

const OnClick: React.FC<OnClick> = (props) => {
  const intl = useIntl()
  const { agree } = props
  const { oneClickLogin, tips } = useLoginOnClick(agree)

  return (
    <View className={styles['MobileView']}>
      {agree ? (
        <Button openType="getPhoneNumber" className={styles['Submit']} onGetPhoneNumber={oneClickLogin}>
          {intl.formatMessage({ id: 'user.yijiandenglu', defaultMessage: '一键登录' })}
        </Button>
      ) : (
        <Button className={styles['Submit']} onClick={tips}>
          {intl.formatMessage({ id: 'user.yijiandenglu', defaultMessage: '一键登录' })}
        </Button>
      )}
    </View>
  )
}
export default observer(OnClick)
