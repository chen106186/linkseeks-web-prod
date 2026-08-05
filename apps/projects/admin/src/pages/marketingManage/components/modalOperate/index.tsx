import React, { useState } from 'react'
import { Modal } from 'antd'
import {
  SchemaForm,
  SchemaMarkupField as Field,
  createFormActions,
  FormEffectHooks,
  Input,
  Radio,
  DatePicker,
} from '@apps/formily'
import moment from 'moment'
const actions = createFormActions()
const { onFieldChange$ } = FormEffectHooks

export interface IProps {
  /** 标题 */
  title: string
  /** 显示隐藏 */
  visible: boolean
  /** id */
  id: number
  /** 审核的类型 */
  modalType: 'audit' | 'abandon' | 'merkeingAudit' | 'merkeingAuditId'
  /** 取消 */
  onCancel?: () => void
  /** 确定 */
  onOk?: () => void
  /** api */
  fetch?: () => Promise<unknown>
}

const ModalOperate: React.FC<IProps> = (props: any) => {
  const { title, visible, id, onCancel, onOk, modalType, fetch } = props
  const [loading, setLoading] = useState<boolean>(false)
  const useFormEffects = () => {
    const { setFieldState } = createFormActions()
    if (modalType === 'audit') {
      onFieldChange$('state').subscribe(({ value }) => {
        setFieldState('auditOpinion', (state) => {
          if (value == 1) {
            state.visible = false
          } else {
            state.visible = true
          }
        })
      })
    }
    if (modalType === 'merkeingAudit' || modalType === 'merkeingAuditId') {
      onFieldChange$('isPass').subscribe(({ value }) => {
        setFieldState('opinion', (state) => {
          if (value == 1) {
            state.visible = false
          } else {
            state.visible = true
          }
        })
      })
    }
  }

  const disabledDate = (current) => {
    return current && current <= moment().startOf('day')
  }

  const modalText = modalType === 'audit' ? '审核不通过原因' : '作废原因'
  const modalNode =
    modalType === 'audit' ? (
      <Field
        enum={[
          { label: '审核通过', value: 1 },
          { label: '审核不通过', value: 0 },
        ]}
        name="state"
        required
        x-component="Radio"
        x-component-props={{}}
      />
    ) : modalType === 'merkeingAudit' || modalType === 'merkeingAuditId' ? (
      <Field
        enum={[
          { label: '审核通过', value: 1 },
          { label: '审核不通过', value: 0 },
        ]}
        name="isPass"
        required
        x-component="Radio"
        x-component-props={{}}
      />
    ) : (
      <Field
        title="作废时间"
        name="reasonTime"
        required
        x-component="DatePicker"
        x-component-props={{
          format: 'YYYY-MM-DD HH:mm:ss',
          disabledDate,
        }}
      />
    )

  const handleSubmit = (val: any) => {
    let value = { ...val }
    let params: any = {
      id,
      signUpId: id,
    }
    setLoading(true)
    if (modalType === 'audit') {
      params.state = value.state
      value.state !== 1 && (params.auditOpinion = value.auditOpinion)
    } else if (modalType === 'merkeingAudit' || modalType === 'merkeingAuditId') {
      params.isPass = value.isPass
      params.opinion = value.opinion
    } else {
      params.reason = value.reason
      params.reasonTime = new Date(value.reasonTime).getTime()
    }

    fetch({ ...params }).then((res) => {
      if (res.code !== 1000) {
        setLoading(false)
        return
      }
      onOk && onOk()
    })
  }

  const handleClose = () => {
    onCancel()
    actions.reset()
  }

  return (
    <Modal
      width={600}
      title={title}
      visible={visible}
      onCancel={handleClose}
      confirmLoading={loading}
      onOk={() => actions.submit()}
      afterClose={() => actions.reset()}
    >
      <SchemaForm
        layout="vertical"
        labelCol={6}
        components={{
          Input,
          Radio: Radio.Group,
          TextArea: Input.TextArea,
          DatePicker,
        }}
        actions={actions}
        effects={() => useFormEffects()}
        onSubmit={(values) => handleSubmit(values)}
        initialValues={{
          state: 1,
          isPass: 1,
        }}
      >
        {modalNode}
        <Field
          title={modalText}
          name={
            modalType === 'audit'
              ? 'auditOpinion'
              : modalType === 'merkeingAudit' || modalType === 'merkeingAuditId'
              ? 'opinion'
              : 'reason'
          }
          x-component="TextArea"
          required
          x-component-props={{
            placeholder: '在此输入你的内容，最多60个汉字',
          }}
          x-rules={{
            max: 60,
            message: '原因最多60个汉字',
          }}
        />
      </SchemaForm>
    </Modal>
  )
}
export default ModalOperate
