import React from 'react'
import { getWebIntl } from '@/utils/locales'
import noDataIcon from './nodata_default.png'
import styles from './index.module.less'

interface NoDataPropsType {
  content?: string
}

const NoData: React.FC<NoDataPropsType> = (props) => {
  const translate = getWebIntl()
  const { content = translate('web.common.zanwushuju') } = props
  return (
    <div className={styles.nodata_wrap}>
      <img src={noDataIcon} />
      <p>{content}</p>
    </div>
  )
}

export default NoData
