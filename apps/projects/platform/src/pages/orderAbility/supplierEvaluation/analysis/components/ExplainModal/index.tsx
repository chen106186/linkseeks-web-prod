/*
 * @Author: XieZhiXiong
 * @Date: 2021-08-11 14:20:42
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-18 10:44:56
 * @Description: 解释 Modal
 */
import React from 'react'
import { Modal, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { createAsyncFormActions } from '@apps/formily'
import NiceForm from '@/components/NiceForm'
import schema from './schema'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()
const modalFormActions = createAsyncFormActions()

export type ValuesType = {
  /**
   * 解释内容
   */
  content: string
}

interface ExplainModalProps {
  visible: boolean
  confirmLoading: boolean
  onSubmit: (values: ValuesType) => void
  /**
   * 关闭触发事件
   */
  onClose: () => void
  /**
   * 是否只可以选择 不接受申请
   */
  rejected?: boolean
}

const ExplainModal: React.FC<ExplainModalProps> = (props) => {
  const { visible, confirmLoading, onSubmit, onClose } = props

  const handleClose = () => {
    onClose?.()
  }

  const handleSubmit = (values) => {
    if (onSubmit) {
      onSubmit(values)
    }
  }

  return (
    <Modal
      title={
        <>
          {intl.formatMessage({ id: 'supplierEvaluation.shangjiajieshi' })}
          <Tooltip title={intl.formatMessage({ id: 'supplierEvaluation.shangjiaduiyupingjiadejie' })}>
            <QuestionCircleOutlined style={{ marginLeft: 3 }} />
          </Tooltip>
        </>
      }
      visible={visible}
      confirmLoading={confirmLoading}
      onOk={() => modalFormActions.submit()}
      onCancel={handleClose}
      destroyOnClose
    >
      <NiceForm effects={() => {}} actions={modalFormActions} schema={schema} onSubmit={handleSubmit} />
    </Modal>
  )
}

export default ExplainModal
