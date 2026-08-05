import React from 'react'
import ResultItem from '@/components/ResultItem'
import { Empty } from 'antd'
import { getWebIntl } from '@/utils/locales'
import styles from './index.module.less'

interface Props {
  searchList?: any
  searchText?: string
  memberId: number | undefined
}

const ResultLeft: React.FC<Props> = ({ searchList, searchText = '', memberId }) => {
  const translate = getWebIntl()

  return (
    <div>
      <div className={styles['search-text']}>
        {translate('web.common.search')}：<span>{searchText}</span>
      </div>
      <ul className={styles['search-content']}>
        {searchList.map((item: any) => {
          return (
            <ResultItem
              title={item.title}
              secondTitle={item.content}
              time={item.time}
              frequency={item.readCount}
              id={item.id}
              key={item.id + 'result'}
              memberId={memberId}
            />
          )
        })}
        {searchList.length == 0 && (
          <div style={{ padding: '50px 0' }}>
            <Empty description={<div>{translate('web.common.zanwushuju')}</div>} />
          </div>
        )}
      </ul>
    </div>
  )
}

ResultLeft.defaultProps = {
  searchList: [
    {
      title: '-',
      content: '-',
      time: '0',
      readCount: '-',
    },
  ],
}

export default ResultLeft
