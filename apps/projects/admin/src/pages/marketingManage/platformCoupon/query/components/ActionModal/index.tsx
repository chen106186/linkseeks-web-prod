/*
 * @Author: XieZhiXiong
 * @Date: 2021-07-02 15:30:48
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-07-02 18:03:50
 * @Description: 操作 Modal
 */
import React, { useRef } from 'react'
import { Modal } from 'antd'
import ReasonForm, { ReasonValueType, ReasonFormRefHandle } from '../ReasonForm'
import EditForm, { EditSubmitValueType, EditFormRefHandle, EditValueType } from '../EditForm'

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
  onConfirm: (values: { [key: string]: any }, modalName: ActionModalType) => void
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
  stop: '终止原因',
  cancel: '取消原因',
  startUp: '启动原因',
  edit: '修改',
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
      render: () => <EditForm onSubmit={handleEditSubmit} value={value as EditValueType} ref={formRef} />,
    },
  }

  const template = tempMap[TEMPLATE_MAP[modalName]] || {
    width: 640,
    title: '标题',
    render: () => '没有找到 modal 模板',
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
      okText="确 定"
      destroyOnClose
    >
      {template.render()}
    </Modal>
  )
}

export default ActionModal
