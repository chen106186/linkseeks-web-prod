/*
 * @Author: XieZhiXiong
 * @Date: 2020-10-28 17:29:14
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2020-11-04 17:18:55
 * @Description: 确认完成审核 Modal
 */
import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Modal } from 'antd'
import { createFormActions, FormEffectHooks, FormPath } from '@apps/formily'
import NiceForm from '@/components/NiceForm'
import { auditModalSchema } from './schema'

const modalFormActions = createFormActions()
const { onFieldValueChange$, onFieldInputChange$ } = FormEffectHooks

interface VerifyModalProps {
  visible: boolean
  confirmLoading: boolean
  onSubmit: (values: { agree: 0 | 1; reason: string }) => void
  onVisible: (flag: boolean) => void
}

const FinishedModal: React.FC<VerifyModalProps> = ({ visible, confirmLoading, onSubmit, onVisible }) => {
  const intl = useIntl()

  const handleSubmit = (values) => {
    if (onSubmit) {
      onSubmit(values)
    }
  }

  return (
    <Modal
      title={intl.formatMessage({ id: 'afterService.components.FinishedModal.title', defaultMessage: '售后评价' })}
      visible={visible}
      confirmLoading={confirmLoading}
      onOk={() => modalFormActions.submit()}
      onCancel={() => onVisible(false)}
      destroyOnClose
    >
      <NiceForm
        effects={($, { setFieldState }) => {}}
        actions={modalFormActions}
        schema={auditModalSchema}
        onSubmit={handleSubmit}
      />
    </Modal>
  )
}

export default FinishedModal
