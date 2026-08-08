import React, { useState, useEffect } from 'react'
import { IAntdSchemaFormProps } from '@apps/formily'
import { Modal } from 'antd'
import NiceForm from '../NiceForm'
import { ModalProps } from 'antd/es/modal'

export interface ModalFormProps extends IAntdSchemaFormProps {
  confirm?()
  cancel?()
  closeabled?: boolean
  modalTitle?: string
  currentRef?: any
  width?: number
  modalProps?: ModalProps
}

const ModalForm: React.FC<ModalFormProps> = (props) => {
  const {
    width = 704,
    confirm,
    cancel,
    modalTitle,
    currentRef,
    closeabled = true,
    actions,
    modalProps = {},
    ...restProps
  } = props
  const [visible, setVisible] = useState<boolean>(false)

  useEffect(() => {
    if (currentRef) {
      currentRef.current = {
        visible,
        setVisible,
      }
    }
  }, [])

  const handleConfirm = () => {
    // 是否需要关闭弹窗, 默认关闭
    confirm && confirm()
  }

  const handleCancel = () => {
    setVisible(false)
    cancel && cancel()
  }
  return (
    <Modal
      width={width}
      title={modalTitle}
      onOk={handleConfirm}
      onCancel={handleCancel}
      visible={visible}
      {...modalProps}
    >
      <NiceForm actions={actions} {...restProps} />
    </Modal>
  )
}

ModalForm.defaultProps = {}

export default ModalForm
