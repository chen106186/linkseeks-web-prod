import React from 'react'
import DailyQuotation from '@/components/DailyQuotation'
import { getWebIntl } from '@/utils/locales'
import styles from './index.module.less'

interface Props {
  objMessage?: any
}

const InfoListContent: React.FC<Props> = (props) => {
  const translate = getWebIntl()
  const {
    objMessage = {
      title: translate('web.resource.mall.meirihangqing'),
      bgColor: 'linear-gradient(135deg, #EFF4FB 0%, #DBE5F5 100%)',
    },
  } = props
  const arrList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

  return (
    <div className={styles['list-content-main']}>
      <div className={styles['list-title']}>
        <div className={styles['list-tips']}>{objMessage.title}</div>
      </div>
      <ul className={styles['search-content']}>
        {arrList.map((item: any) => {
          return <DailyQuotation key={item + 'info'} item={item}></DailyQuotation>
        })}
      </ul>
    </div>
  )
}

export default InfoListContent
