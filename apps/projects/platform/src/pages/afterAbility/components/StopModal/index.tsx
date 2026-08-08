/*
 * @Author: XieZhiXiong
 * @Date: 2021-08-26 10:12:48
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-26 10:39:03
 * @Description: 中止弹窗
 */
import React from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Modal } from 'antd'
import { createFormActions } from '@apps/formily'
import { DatePicker } from '@apps/formily'
import moment from 'moment'
import NiceForm from '@/components/NiceForm'
import schema from './schema'

const formActions = createFormActions()

export type ValuesType = {
  /**
   * 中止原因
   */
  remark: string
}

interface StopModalProps {
  /**
   * 是否可见
   */
  visible: boolean
  /**
   * Form 确认事件
   */
  onSubmit: (values: ValuesType) => void
  /**
   * 抽屉关闭事件
   */
  onClose: () => void
  /**
   * 确认按钮 loading
   */
  submitLoading: boolean
}

const StopModal: React.FC<StopModalProps> = (props) => {
  const { visible, onSubmit, onClose, submitLoading } = props

  const intl = useIntl()

  const handleSubmit = (values: ValuesType) => {
    if (onSubmit) {
      onSubmit(values)
    }
  }

  return (
    <Modal
      title={intl.formatMessage({ id: 'afterService.components.StopModal.title', defaultMessage: '中止原因' })}
      visible={visible}
      confirmLoading={submitLoading}
      onOk={() => formActions.submit()}
      onCancel={() => onClose?.()}
      destroyOnClose
    >
      <NiceForm
        initialValues={{
          date: moment().format('YYYY-MM-DD HH:mm:ss'),
        }}
        previewPlaceholder="' '"
        components={{
          DatePicker,
        }}
        effects={() => {}}
        actions={formActions}
        schema={schema}
        onSubmit={handleSubmit}
      />
    </Modal>
  )
}

export default StopModal
