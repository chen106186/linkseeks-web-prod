import React from 'react'
import { HistoryOutlined, EyeOutlined, StarOutlined } from '@ant-design/icons'
import useLink from '@/hooks/useLink'
import { integrationTime } from '@/utils'
import styles from './index.module.less'

interface Props {
  arrList?: Array<any>
  title?: string
  time?: string
  frequency?: string
  collectCount?: string
  columnName?: string
}

const QuotationItem: React.FC<Props> = (props) => {
  const { arrList = [], title = '', time = '', frequency = '', collectCount = '', columnName = '' } = props
  const { linkPrefix } = useLink()

  return (
    <ul className={styles['item-main']}>
      {arrList.map((item: any) => {
        return (
          <li className={styles['item-warp']} key={item.id + 'quotation'}>
            <div className={styles['item-title']}>
              [{columnName ? item.columnName : '-'}]{title ? item[title] : '-'}
            </div>
            <div className={styles['item-time-main']}>
              {time && (
                <div className={styles['item-time-warp']}>
                  <HistoryOutlined translate={undefined} className={styles['item-time-icon']} />
                  {integrationTime(item[time], 'YMD') || '2019-09-25'}
                </div>
              )}

              {frequency && (
                <div className={styles['item-time-warp']}>
                  <EyeOutlined translate={undefined} className={styles['item-time-icon']} />
                  {item[frequency] || '-'}
                </div>
              )}
              {collectCount && (
                <div className={styles['item-time-warp']}>
                  <StarOutlined translate={undefined} className={styles['item-time-icon']} />
                  {item[collectCount]}
                </div>
              )}
            </div>
            <a href={linkPrefix(`/info/infoDetail/${item.id}`)} className="all-jump"></a>
          </li>
        )
      })}
    </ul>
  )
}

export default QuotationItem
