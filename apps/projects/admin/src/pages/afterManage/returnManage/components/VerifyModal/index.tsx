import React from 'react'
import { Modal } from 'antd'
import { createFormActions, FormEffectHooks, FormPath } from '@apps/formily'
import NiceForm from '@/components/NiceForm'
import schema from './schema'

const formActions = createFormActions()
const { onFieldValueChange$ } = FormEffectHooks

export type ValueType = {
  /**
   * 是否同意
   */
  agree: number
  /**
   * 理由
   */
  reason: string
}

interface IProps {
  /**
   * 是否可见
   */
  visible: boolean
  /**
   * Modal 关闭事件
   */
  onClose: () => void
  /**
   * Form 提交事件
   */
  onSubmit: (value: any) => void
  /**
   * 提交loading
   */
  submitLoading: boolean
}

const VerifyModal: React.FC<IProps> = (props: IProps) => {
  const { visible, onClose, onSubmit, submitLoading } = props

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleSubmit = (values: ValueType) => {
    if (onSubmit) {
      onSubmit(values)
    }
  }

  return (
    <Modal
      title="单据审核"
      visible={visible}
      confirmLoading={submitLoading}
      onOk={() => formActions.submit()}
      onCancel={handleClose}
      destroyOnClose
    >
      <NiceForm
        effects={($, { setFieldState }) => {
          onFieldValueChange$('agree').subscribe((fieldState) => {
            setFieldState('reason', (state) => {
              state.title = fieldState.value === 0 ? '不通过原因' : '通过原因'
              state.required = fieldState.value === 0
              setTimeout(() => {
                formActions.validate('reason')
              }, 0)
            })
          })
        }}
        actions={formActions}
        schema={schema}
        onSubmit={handleSubmit}
      />
    </Modal>
  )
}

export default VerifyModal
