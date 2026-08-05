import React from 'react'
import DailyQuotation from '@/components/DailyQuotation'
import { RightOutlined } from '@ant-design/icons'
import { getWebIntl } from '@/utils/locales'
import styles from './index.module.less'

interface Props {
  objMessage?: any
  memberId: number | undefined
}

const InfoListContent: React.FC<Props> = (props) => {
  const {
    objMessage = {
      columnName: '-',
      bgColor: 'linear-gradient(135deg, #EFF4FB 0%, #DBE5F5 100%)',
      list: [{}],
    },
    memberId,
  } = props
  const translate = getWebIntl()

  return (
    <div className={styles['list-content-main']}>
      <div className={styles['list-title']}>
        <div className={styles['list-tips']}>{objMessage.columnName}</div>
        <a
          className={styles['list-more']}
          href={`/${memberId}/info/infoList/${objMessage.columnId}`}
          style={{ color: '#909399' }}
        >
          <span>{translate('web.common.more')}</span>
          <RightOutlined />
        </a>
      </div>
      <ul className={styles['search-content']}>
        {objMessage.list.map((item: any, index: number) => {
          return (
            <DailyQuotation
              key={item.id + 'info'}
              index={index}
              content={item.title}
              detailId={item.id}
              time={item.createTime}
              item={item}
            />
          )
        })}
      </ul>
    </div>
  )
}

export default InfoListContent
