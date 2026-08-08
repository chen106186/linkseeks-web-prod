import React, { useEffect, useState } from 'react'
import { Modal } from 'antd'
import {
  SchemaForm,
  SchemaMarkupField as Field,
  createFormActions,
  FormEffectHooks,
  Input,
  Radio,
  DatePicker,
  Checkbox,
} from '@apps/formily'
import moment from 'moment'

import styles from './index.less'

const actions = createFormActions()
const { onFieldChange$ } = FormEffectHooks

export interface IProps {
  title: string
  visible: boolean
  id: number
  modalType: 'audit' | 'abandon' | 'date' | 'next' | 'key'
  onCancel?: () => void
  onOk?: () => void
  fetch?: () => Promise<unknown>
}

const ModalOperate: React.FC<IProps> = (props: any) => {
  const { title, visible, id, onCancel, onOk, modalType, fetch } = props

  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)

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
    if (modalType === 'date') {
      onFieldChange$('checkbox').subscribe(({ value }) => {
        if (value && value.length > 0) {
          actions.setFieldValue('quotedPriceTime', moment().format())
        } else {
          actions.setFieldValue('quotedPriceTime', undefined)
        }
      })
    }
  }

  const disabledDate = (current) => {
    return current && current <= moment().startOf('day')
  }

  const modalText = modalType === 'audit' ? '审核不通过原因' : '作废原因'
  const modalNode = () => {
    switch (modalType) {
      case 'audit':
        return (
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
        )
      case 'abandon':
        return (
          <Field
            title="作废时间"
            name="reasonTime"
            required
            x-component="DatePicker"
            x-component-props={{
              style: {
                width: '100%',
              },
              format: 'YYYY-MM-DD HH:mm:ss',
              disabledDate,
            }}
          />
        )
      case 'date':
        return (
          <>
            <Field
              title="报价截止时间"
              name="quotedPriceTime"
              required
              x-component="DatePicker"
              x-component-props={{
                style: {
                  width: '100%',
                },
                format: 'YYYY-MM-DD HH:mm:ss',
                disabledDate,
              }}
            />
            <Field
              name="checkbox"
              x-component="CheckboxGroup"
              description="勾选后供应商不能再提交报价单"
              enum={[{ label: '立即截止报价', value: 1 }]}
            />
          </>
        )
      case 'next':
        return (
          <Field
            title="下轮报价截止时间"
            name="quotedPriceTime"
            required
            x-component="DatePicker"
            x-component-props={{
              style: {
                width: '100%',
              },
              format: 'YYYY-MM-DD HH:mm:ss',
              disabledDate,
            }}
          />
        )
      case 'key':
        return <Field title="请输入解密密钥" x-component="Input" name="password" required x-component-props={{}} />
    }
  }

  useEffect(() => {
    if (modalType === 'next') {
      actions.setFieldValue('quotedPriceTime', moment().format())
    }
  }, [])

  const handleSubmit = (val: any) => {
    if (confirmLoading) {
      return
    }
    let value = { ...val }
    let params: any = {}
    if (modalType === 'audit') {
      params.state = value.state
      value.state !== 1 && (params.auditOpinion = value.auditOpinion)
    } else if (modalType === 'abandon') {
      params.reason = value.reason
      params.reasonTime = new Date(value.reasonTime).getTime()
    } else if (modalType === 'date') {
      params.quotedPriceTime = new Date(value.quotedPriceTime).getTime()
    } else if (modalType === 'next') {
      params.quotedPriceTime = new Date(value.quotedPriceTime).getTime()
    } else {
      params.password = value.password
    }
    setConfirmLoading(true)
    fetch({ id, ...params })
      .then((res) => {
        if (res.code === 1000) {
          onOk()
        }
      })
      .finally(() => setConfirmLoading(false))
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
      onOk={() => actions.submit()}
      afterClose={() => actions.reset()}
      confirmLoading={confirmLoading}
    >
      <SchemaForm
        className={styles.revise_style}
        layout="vertical"
        labelCol={6}
        components={{
          Input,
          Radio: Radio.Group,
          TextArea: Input.TextArea,
          DatePicker,
          Checkbox,
          CheckboxGroup: Checkbox.Group,
        }}
        actions={actions}
        effects={() => useFormEffects()}
        onSubmit={(values) => handleSubmit(values)}
        initialValues={{
          state: 1,
        }}
      >
        {modalNode()}
        {(modalType === 'audit' || modalType === 'abandon') && (
          <Field
            title={modalText}
            name={modalType === 'audit' ? 'auditOpinion' : 'reason'}
            x-component="TextArea"
            required
            x-component-props={{
              placeholder: '在此输入你的内容，最多60个汉字',
            }}
            x-rules={{
              max: 60,
              message: '原因最多60个汉字',
              validator: (value) => {
                let _str = value
                _str = _str.replace(/[\u4E00-\u9FA5]/g, 'AA')
                if (_str.length > 60 * 2) {
                  return { type: 'error', message: `最长${60 * 2}个字符，${60}个汉字` }
                } else {
                  return null
                }
              },
            }}
          />
        )}
      </SchemaForm>
    </Modal>
  )
}
export default ModalOperate
