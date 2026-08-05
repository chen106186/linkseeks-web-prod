import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Button } from 'antd'
import noDataIcon from '@/assets/imgs/nodata_default.png'
import styles from './index.less'

const PayEmptyLayout = (props) => {
  const intl = useIntl()
  const { content = intl.formatMessage({ id: 'payandSettle.paySetting.payEmpty.content' }) } = props
  return (
    <div className={styles.nodata_wrap}>
      <img src={noDataIcon} />
      <div className={styles.content_wrap}>
        <div>{intl.formatMessage({ id: 'payandSettle.paySetting.payEmpty.h3' })}</div>
        <p>{content}</p>
        <Button type="primary">{intl.formatMessage({ id: 'payandSettle.paySetting.payEmpty.button' })}</Button>
      </div>
    </div>
  )
}
export default PayEmptyLayout
