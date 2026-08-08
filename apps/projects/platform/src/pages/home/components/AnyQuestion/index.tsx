import React, { useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.less'
import ask from '@/assets/imgs/ask.png'
import { authService } from '@apps/services'
import { configUsr, initQiyuImServer, toChatRoom } from '@/utils/im'
import { GlobalConfig } from '@/global/config'
import CustomerServiceList from '@apps/components/src/web/CustomerServiceList'
import { useToggle } from '@linkseeks/hooks'

interface Iprops {}

const AnyQuestion: React.FC<Iprops> = () => {
  const intl = useIntl()
  const authInfo: any = authService.getAuth() || {}
  const [visible, toggle] = useToggle()

  // 根据接口配置 跳转lx-IM或者七鱼IM，并传入初始秘钥  1 //自有 2 //第三方
  const _self = GlobalConfig?.global?.imConfig ? GlobalConfig.global.imConfig.type : null
  useEffect(() => {
    if (_self === 2) {
      // 第三方
      const s = GlobalConfig.global.imConfig.paramConfigList[0]['value']
      const _window: any = window
      !_window?.ysf && initQiyuImServer(s)
    }
  }, [])

  const openIMServer = () => {
    if (_self === 2) {
      configUsr(authInfo)
      const _window: any = window
      _window?.ysf && _window.ysf('open')
    } else if (_self === 1) {
      toChatRoom(authInfo.memberId)
    }
  }

  return (
    <div className={styles.anyQuestion}>
      <div className={styles.title}>{intl.formatMessage({ id: 'home.anyQuestion.title' })}</div>
      <div className={styles.body}>
        <p className={styles.tips}>{intl.formatMessage({ id: 'home.anyQuestion.tips1' })}</p>
        <p className={styles.tips}>{intl.formatMessage({ id: 'home.anyQuestion.tips2' })}</p>
      </div>
      {_self === null ? null : (
        <div className={styles.ask}>
          <a target={'__blank'} onClick={() => toggle(true)}>
            {intl.formatMessage({ id: 'home.anyQuestion.ask' })}
          </a>
        </div>
      )}
      <div className={styles.ask_image}>
        <img src={ask} />
      </div>
      <CustomerServiceList visible={visible} onClose={toggle} isAdmin memberId={authInfo.memberId} />
    </div>
  )
}

export default AnyQuestion
