import React from 'react'
import styles from './index.less'
import classNames from 'classnames'

interface Iprops {
  extra?: React.ReactNode
  title: string | React.ReactNode
  children: React.ReactNode
  /** 以下属性是装修自带的属性 */
  onMouseOver?: () => void
  onClick?: () => void
  className?: string
}

const WebCard: React.FC<Iprops> = (props: Iprops) => {
  const { extra, title, children, className, ...other } = props
  return (
    <div className={classNames(styles.card, className)} {...other}>
      <div className={styles['card-header']}>
        {(typeof title === 'string' && <span className={styles['card-header-title']}>{title}</span>) || title}
        {extra}
      </div>
      <div className={styles['card-content']}>{children}</div>
    </div>
  )
}

export default WebCard
