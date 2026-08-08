import React from 'react'
import { HistoryOutlined, EyeOutlined } from '@ant-design/icons'
import { integrationTime } from '@/utils'
import styles from './index.module.less'

interface Props {
  time?: any
  count?: any
}

const TimeFrequency: React.FC<Props> = (props) => {
  const { time = '', count = '-' } = props

  return (
    <div className={styles['item-time-main']}>
      <div className={styles['item-time-warp']}>
        <HistoryOutlined translate={undefined} className={styles['item-time-icon']} />
        {integrationTime(time, 'YMD')}
      </div>
      <div className={styles['item-time-warp']}>
        <EyeOutlined translate={undefined} className={styles['item-time-icon']} /> {count}
      </div>
    </div>
  )
}

export default TimeFrequency
