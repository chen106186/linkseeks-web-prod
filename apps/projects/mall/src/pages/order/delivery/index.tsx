import React from 'react'
import cx from 'classnames'
import { getWebIntl } from '@/utils/locales'
import styles from './index.module.less'

const Delivery: React.FC = () => {
  const translate = getWebIntl()

  return (
    <div className={styles.delivery}>
      <div className={styles.common_title}>
        <span>{translate('web.resource.logistics.peisongfangshi')}</span>
      </div>
      <div className={styles.delivery_list}>
        <div className={cx(styles.delivery_list_item, styles.active)}>{translate('web.resource.mall.ziti')}</div>
      </div>
    </div>
  )
}

export default Delivery
