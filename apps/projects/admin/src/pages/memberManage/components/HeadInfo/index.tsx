import React from 'react'
import styles from './index.less'

export interface HeadInfoProps {
  info: {
    name?: string
    levelTag: string
  }
  extra?: React.ReactNode
}

const HeadInfo: React.FC<HeadInfoProps> = ({ info, extra }) => (
  <div className={styles.head}>
    <div className={styles['head-prefix']}>{info && info.name && info.name.length ? info.name[0] : ''}</div>
    <div className={styles['head-name']}>{info.name || ''}</div>
    {!extra ? info.levelTag : extra}
  </div>
)

export default HeadInfo
