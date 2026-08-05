import React from 'react'
import { Spin } from 'antd'
import styles from './index.less'

const Loading: React.FC = () => {
  return (
    <div className={styles.loading_wrap}>
      <Spin size="large" />
      <p className={styles.loading_text}>正在加载页面数据...</p>
    </div>
  )
}

export default Loading
