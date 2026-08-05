import React from 'react'
import { getWebIntl } from '@apps/locales'
import styles from './index.module.less'

const translate = getWebIntl()

interface Iprops {
  status: 'success' | 'fail'
  // msg: string
}

const STATUS_TEXT = {
  success: translate('web.common.pinuanchenggong'),
  fail: translate('web.common.pintuanshibai'),
}

const STATUS_TIPS = {
  success: translate('web.resource.order.dengdaishangjiafahuo'),
  fail: translate('web.resource.order.ruoyifuquankuan'),
}

const ActionStatus: React.FC<Iprops> = (props: Iprops) => {
  const { status } = props

  return (
    <div className={styles.container}>
      <div className={styles.status}>
        <span className={styles['status-text']}>{STATUS_TEXT[status]}</span>
      </div>
      <div className={styles.tips}>{STATUS_TIPS[status]}</div>
    </div>
  )
}

export default ActionStatus
