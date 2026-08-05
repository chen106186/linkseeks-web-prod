import React from 'react'
import { HistoryOutlined, EyeOutlined } from '@ant-design/icons/lib/icons'
import styles from './index.module.less'
import { integrationTime } from '@/utils'

interface Props {
  title?: string
  secondTitle?: string
  time?: any
  frequency?: any
  id?: any
  memberId: number | undefined
}

const ResultItem: React.FC<Props> = (props) => {
  const { title = '-', secondTitle = '-', time = '', frequency = '11,245', id = '12', memberId } = props

  return (
    <li className={styles['result-warp']}>
      <div className={styles['result-title']}>{title}</div>
      <div className={styles['result-second-title']} dangerouslySetInnerHTML={{ __html: secondTitle }}></div>
      <div className={styles['hotspot-time-main']}>
        <div className={styles['hotspot-time-warp']}>
          <HistoryOutlined translate={undefined} className={styles['hotspot-time-icon']} />{' '}
          {time ? integrationTime(time, 'YMD') : '2019-09-25'}
        </div>
        <div className={styles['hotspot-time-warp']}>
          <EyeOutlined translate={undefined} className={styles['hotspot-time-icon']} /> {frequency}
        </div>
      </div>
      <a href={`/${memberId}/info/infoDetail/${id}`} className="all-jump"></a>
    </li>
  )
}

export default ResultItem
