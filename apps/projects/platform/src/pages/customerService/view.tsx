import React, { useRef, useEffect, useState } from 'react'
import styles from './index.less'
import { authService } from '@apps/services'
import { message } from 'antd'
import { useToggle } from '@linkseeks/hooks'
import { Loading } from '@apps/components'

export interface applyLiveListProps {}

const customerServicePage: React.FC<applyLiveListProps> = () => {
  const [url, setUrl] = useState<string>('')
  const [loading, toggleLoading] = useToggle(true)
  useEffect(() => {
    const { imFlag, accessToken } = authService.getAuth() || {}
    if (!imFlag) {
      message.error('没有使用IM的权限')
      return
    }

    // 监听来自 iframe 的消息
    window.addEventListener('message', (event) => {
      const { action, url } = event.data
      if (action === 'navigate') {
        window.open(url)
      }
    })
    setUrl(`${process.env.IM_URL}?t=${accessToken}&source=1`)
  }, [])

  const handleLoad = () => {
    toggleLoading(false)
  }
  return url ? (
    <div className={styles.box}>
      {loading && <Loading />}
      <iframe
        src={url}
        style={{ display: loading ? 'none' : 'block' }}
        width="100%"
        height="100%"
        onLoad={handleLoad}
      />
    </div>
  ) : null
}

export default customerServicePage
