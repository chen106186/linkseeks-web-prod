import React from 'react'
import noDataIcon from './nodata_default.png'
import styles from './index.less'

interface NoDataPropsType {
  content?: string
}

const NoData: React.FC<NoDataPropsType> = (props) => {
  const { content = '暂无数据' } = props
  return (
    <div className={styles.nodata_wrap}>
      <img src={noDataIcon} />
      <p>{content}</p>
    </div>
  )
}

export default NoData
