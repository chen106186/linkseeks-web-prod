import React from 'react'
import styles from './index.less'

interface ShelvesProps {
  title?: string
  children?: React.ReactNode
}

const Shelves: React.FC<ShelvesProps> = ({ title = '标题', children }) => {
  return (
    <div className={styles.shelves}>
      <div className={styles['shelves-title']}>{title}</div>
      <div className={styles['shelves-content']}>{children}</div>
    </div>
  )
}

export default Shelves
