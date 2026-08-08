import React from 'react'
import { Empty, Skeleton } from 'antd'
import { getWebIntl } from '@/utils/locales'
import styles from './index.module.less'

interface Props {
  noticeList: Array<any>
  loading: boolean
}

function PublicityList(props: Props) {
  const { noticeList = [], loading } = props
  const translate = getWebIntl()
  const typeList = [
    '',
    translate('web.resource.mall.xunjiagongshi'),
    translate('web.resource.mall.zhaobiaogongshi'),
    translate('web.resource.mall.jingjiagongshi'),
  ]

  return (
    <div className={styles['pubiicity-main']}>
      <ul className={styles['pubiicity-warp']}>
        {noticeList.length > 0 && !loading ? (
          noticeList.map((item: any) => {
            return (
              <li key={item.id} className={styles['pubiicity-item']}>
                <div className={styles['pubiicity-key']}>{item.name}</div>
                <div> - {typeList[item.type]}</div>
                <a href={`/publicityDetail/${item.id}`} className="all-jump"></a>
              </li>
            )
          })
        ) : loading ? (
          <Skeleton active />
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%', paddingTop: 24 }}>
            <Empty />
          </div>
        )}
      </ul>
    </div>
  )
}

export default PublicityList
