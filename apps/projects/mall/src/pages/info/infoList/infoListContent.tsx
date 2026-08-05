import React from 'react'
import ResultItem from '@/components/ResultItem'
import { Empty } from 'antd'
import { getWebIntl } from '@/utils/locales'
import styles from './index.module.less'

interface Props {
  infoTitle?: string
  infoListList?: Array<any>
  memberId: number | undefined
}

const InfoListContent: React.FC<Props> = (props) => {
  const translate = getWebIntl()
  const {
    infoTitle = translate('web.resource.mall.meirihangqing'),
    infoListList = [0, 1, 2, 3, 4, 5],
    memberId,
  } = props

  return (
    <div className={styles['list-content-main']}>
      <div className={styles['list-title']}>
        <div className={styles['list-tips']}>{infoTitle}</div>
      </div>
      <ul className={styles['search-content']}>
        {infoListList.map((item: any, index: number) => {
          return (
            <ResultItem
              title={item.title}
              secondTitle={item.digest}
              time={item.createTime}
              frequency={item.readCount}
              id={item.id}
              key={item + 'list' + index}
              memberId={memberId}
            />
          )
        })}
        {infoListList.length == 0 && (
          <div style={{ paddingTop: '100px' }}>
            <Empty description={<div>{translate('web.common.zanwushuju')}</div>} />
          </div>
        )}
      </ul>
    </div>
  )
}

export default InfoListContent
