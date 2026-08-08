import React, { useEffect, useCallback, useRef } from 'react'
import { Modal } from 'antd'
import styles from './index.less'
import { useIntl } from '@linkseeks/i18n'

interface SignModalPropsType {
  visible: boolean
  onOk?: Function
  onCancel?: Function
  contractUrl?: string
  loading: boolean
}
const SignModal: React.FC<SignModalPropsType> = (props) => {
  const { visible, onOk, onCancel, contractUrl, loading } = props
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const intl = useIntl()

  // const iframeScrollBottom = () => {
  //   console.log(iframeRef.current.scrollHeight, 'iframeRef.current.scrollHeight')
  //   iframeRef.current.contentWindow.scrollTo(0, 1000)
  // }

  const handleSignConfirm = () => {
    // iframeScrollBottom()
    onOk && onOk()
  }
  const handleCancel = () => {
    onCancel && onCancel()
  }

  return (
    <Modal
      className={styles.sign_modal}
      title={intl.formatMessage({ id: 'components.qianshudianzihetong' })}
      width={1000}
      maskClosable={false}
      confirmLoading={loading}
      visible={visible}
      centered
      okText={intl.formatMessage({ id: 'components.qianshuhetongbingtijiao' })}
      cancelText={intl.formatMessage({ id: 'components.buqianshu' })}
      onCancel={() => handleCancel()}
      onOk={() => handleSignConfirm()}
    >
      <div className={styles.sign_modal_body}>
        <iframe ref={iframeRef} id="sign-iframe" className={styles.sign_iframe} src={contractUrl} />
      </div>
    </Modal>
  )
}

export default SignModal
