/*
 * @Author: XieZhiXiong
 * @Date: 2021-07-02 15:30:48
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-26 18:15:44
 * @Description: 操作 Modal
 */
import React, { useRef } from 'react'
import { Modal } from 'antd'
import ReasonForm, { ReasonValueType, ReasonFormRefHandle } from '../ReasonForm'
import EditForm, { EditSubmitValueType, EditFormRefHandle, EditValueType } from '../EditForm'
import { getIntl } from '@linkseeks/i18n'
const intl = getIntl()

export type ActionModalType = 'stop' | 'cancel' | 'startUp' | 'edit'
export type ActionModalValueType = { id: number } & Partial<EditValueType>

interface IProps {
  /**
   * 是否可见
   */
  visible: boolean
  /**
   * 对应的弹窗名称
   */
  modalName: ActionModalType
  /**
   * 关闭事件
   */
  onClose: () => void
  /**
   * 弹窗内确认事件
   */
  onConfirm: (values: { [key: string]: any }, modalName: string) => void
  /**
   * 弹窗需要的数据值
   */
  value: ActionModalValueType
  /**
   * 弹窗提交 loading
   */
  submitLoading: boolean
}

const TEMPLATE_MAP = {
  stop: 'reason',
  cancel: 'reason',
  startUp: 'reason',
  edit: 'edit',
}

const TEMPLATE_TITLE_MAP = {
  stop: `${intl.formatMessage({ id: 'merchantCoupon.terminationReation' })}`,
  cancel: `${intl.formatMessage({ id: 'merchantCoupon.cancelReason' })}`,
  startUp: `${intl.formatMessage({ id: 'merchantCoupon.startReasom' })}`,
  edit: `${intl.formatMessage({ id: 'merchantCoupon.Revise' })}`,
}

const ActionModal: React.FC<IProps> = (props) => {
  const { visible, modalName, onClose, onConfirm, value, submitLoading } = props

  const formRef = useRef<ReasonFormRefHandle | EditFormRefHandle | null>(null)

  const handleReasonSubmit = (values: ReasonValueType) => {
    onConfirm({ ...value, reason: values.reason }, modalName)
  }

  const handleEditSubmit = (values: EditSubmitValueType) => {
    onConfirm({ ...value, ...values }, modalName)
  }

  const handleConfirm = () => {
    formRef?.current?.submit?.()
  }

  const tempMap = {
    reason: {
      width: 600,
      title: TEMPLATE_TITLE_MAP[modalName],
      render: () => <ReasonForm type={modalName} onSubmit={handleReasonSubmit} ref={formRef} />,
    },
    edit: {
      width: 600,
      title: TEMPLATE_TITLE_MAP[modalName],
      render: () => <EditForm onSubmit={handleEditSubmit} value={value} ref={formRef} />,
    },
  }

  const template = tempMap[TEMPLATE_MAP[modalName]] || {
    width: 640,
    title: `${intl.formatMessage({ id: 'merchantCoupon.title' })}`,
    render: () => `${intl.formatMessage({ id: 'merchantCoupon.notFindModalTemplate' })}`,
  }

  return (
    <Modal
      width={template.width}
      title={template.title}
      visible={visible}
      onCancel={onClose}
      onOk={handleConfirm}
      okButtonProps={{
        loading: submitLoading,
      }}
      okText={intl.formatMessage({ id: 'common.button.confirm' })}
      destroyOnClose
    >
      {template.render()}
    </Modal>
  )
}

export default ActionModal
