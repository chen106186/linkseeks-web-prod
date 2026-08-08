import React from 'react'
import { ImageBox } from '@apps/components'
import { ProcessItemType } from './index'
import styles from './index.less'

interface ProcesstemPropsType {
  dataInfo: ProcessItemType
}

const ProcessItem: React.FC<ProcesstemPropsType> = (props) => {
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

export default ProcessItem
