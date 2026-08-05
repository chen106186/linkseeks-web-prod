import React from 'react'
import { Modal } from 'antd'
import styles from './index.less'

interface DialogModalModalPropsType {
  visible: boolean
  title?: string
  onCancel: any
}

const DialogModal: React.FC<DialogModalModalPropsType> = (props) => {
  const { visible = false, title, children, onCancel } = props

  return (
    <Modal
      className={styles.add_success_modal}
      title={title}
      visible={visible}
      footer={null}
      centered
      width={600}
      onCancel={onCancel}
    >
      <div>{children}</div>
    </Modal>
  )
}

export default DialogModal
