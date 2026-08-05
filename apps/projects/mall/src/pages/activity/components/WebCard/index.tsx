import React from 'react'
import classNames from 'classnames'
import styles from './index.module.less'

interface Iprops {
  extra?: React.ReactNode
  title: string | React.ReactNode
  children: React.ReactNode
}

const WebCard: React.FC<Iprops> = (props: Iprops) => {
  const { extra, title, children } = props
  return (
    <div className={classNames(styles.card)}>
      <div className={styles['card-header']}>
        {(typeof title === 'string' && <span className={styles['card-header-title']}>{title}</span>) || title}
        {extra}
      </div>
      <div className={styles['card-content']}>{children}</div>
    </div>
  )
}

export default WebCard
