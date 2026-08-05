/**
 * @Description 欢迎卡片
 */
import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import moment from 'moment'
import { authService } from '@apps/services'
import styles from './index.less'
import { useWebIntl } from '@apps/locales'

const WelcomCard: React.FC = () => {
  const intl = useIntl()
  const translate = useWebIntl()
  const today = moment()

  const authInfo = authService.getAuth()

  return (
    <div className={styles['welcome']}>
      <div className={styles['welcome-head']}>
        <div className={styles['welcome-user']}>Hi,{authInfo.userName}！</div>
        <div className={styles['welcome-date']}>
          {today.format(`YYYY-MM-DD`)} {intl.formatMessage({ id: `home.userCenter.day${today.day()}` })}
        </div>
      </div>
      <div className={styles['welcome-desc']}>{translate('web.resource.srmHome.weclome')}</div>
    </div>
  )
}

export default WelcomCard
