/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-28 16:36:53
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-06-28 16:36:54
 * @Description: 审核 Modal
 */
import React from 'react'
import { Modal } from 'antd'
import { createFormActions, FormEffectHooks, FormPath } from '@apps/formily'
import NiceForm from '@/components/NiceForm'
import schema from './schema'
import { useIntl } from '@linkseeks/i18n'

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
  const intl = useIntl()
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
      title={intl.formatMessage({ id: 'merchantCoupon.Documentaudit' })}
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
              state.title =
                fieldState.value === 0
                  ? `${intl.formatMessage({ id: 'merchantCoupon.Notpassingthereason' })}`
                  : `${intl.formatMessage({ id: 'merchantCoupon.Reason' })}`
              state.rules = fieldState.value === 0 ? [...state.rules, { required: true }] : []
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
