import React from 'react'
import noDataIcon from '@/assets/imgs/nodata_default.png'
import styles from './index.less'
import { useIntl } from '@linkseeks/i18n'
interface NoDataPropsType {
  content?: string
}

const NoData: React.FC<NoDataPropsType> = (props) => {
  const intl = useIntl()
  const { content = intl.formatMessage({ id: 'components.zanwushuju' }) } = props
  return (
    <div className={styles.nodata_wrap}>
      <img src={noDataIcon} />
      <p>{content}</p>
    </div>
  )
}

export default NoData
