import React from 'react'
import { integrationTime } from '@/utils'
import useLink from '@/hooks/useLink'
import styles from './index.module.less'

interface Props {
  content?: string
  time?: any
  index?: number
  detailId?: number
  columnName?: string
  item: any
}

const DailyQuotation: React.FC<Props> = (props) => {
  const { time = '', content = '', index = 0, detailId = 12, columnName = '', item } = props
  const { linkPrefix } = useLink()

  const fnGetBg = (indexDesc: number) => {
    const index = indexDesc % 3
    const colorList = [
      'linear-gradient(135deg, #EFF4FB 0%, #DBE5F5 100%)',
      'linear-gradient(135deg, rgba(223,226,230,0.30) 0%, #DFE2E6 100%)',
      'linear-gradient(135deg, #EDFBF7 0%, #C0EADC 100%)',
    ]
    return colorList[index]
  }
  return (
    <li className={styles['market-right-content-item']}>
      <div
        className={styles['market-right-content-title']}
        style={item?.imageUrl ? { backgroundImage: `url(${item.imageUrl})` } : { background: fnGetBg(index) }}
      >
        {columnName}
      </div>
      <div className={styles['market-right-content']}>
        <div className={styles['market-right-content-second-title']}>{content}</div>
        <div className={styles['market-right-content-second-time']}>
          {time ? '2020-03-29' : integrationTime(time, 'YMD')}
        </div>
      </div>
      <a className="all-jump" href={linkPrefix(`/info/infoDetail/${detailId}`)}></a>
    </li>
  )
}

export default DailyQuotation
