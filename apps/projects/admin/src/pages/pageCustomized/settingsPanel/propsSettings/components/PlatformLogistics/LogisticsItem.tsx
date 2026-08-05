import React from 'react'
import { ImageBox } from '@apps/components'
import { LogisticsItemType } from './index'
import styles from './index.less'

interface LogisticsItemPropsType {
  dataInfo: LogisticsItemType
}

const LogisticsItem: React.FC<LogisticsItemPropsType> = (props) => {
  const { dataInfo } = props

  return (
    <div className={styles.brand_item}>
      <div className={styles.brand_item_imgbox}>
        <div className={styles.brand_item_logo}>
          <ImageBox width={80} height={80} src={dataInfo.logo} />
        </div>
      </div>
      <div className={styles.brand_item_info}>
        <div className={styles.brand_item_info_name}>{dataInfo.memberName}</div>
      </div>
    </div>
  )
}

export default LogisticsItem
