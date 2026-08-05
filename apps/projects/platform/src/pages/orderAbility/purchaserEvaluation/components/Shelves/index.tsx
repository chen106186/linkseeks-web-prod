import React from 'react'
import { getIntl } from '@linkseeks/i18n'
import styles from './index.less'

interface ShelvesProps {
  title?: string
  children?: React.ReactNode
}
const intl = getIntl()
const Shelves: React.FC<ShelvesProps> = ({
  title = intl.formatMessage({ id: 'purchaserEvaluation.biaoti' }),
  children,
}) => {
  return (
    <div className={styles.shelves}>
      <div className={styles['shelves-title']}>{title}</div>
      <div className={styles['shelves-content']}>{children}</div>
    </div>
  )
}

export default Shelves
