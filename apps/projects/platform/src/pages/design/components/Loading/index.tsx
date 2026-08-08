import React from 'react'
import { Spin } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.less'

const Loading: React.FC = () => {
  const intl = useIntl()

  return (
    <div className={styles.loading_wrap}>
      <Spin size="large" />
      <p className={styles.loading_text}>{intl.formatMessage({ id: 'editor.loading.text' })}...</p>
    </div>
  )
}

export default Loading
