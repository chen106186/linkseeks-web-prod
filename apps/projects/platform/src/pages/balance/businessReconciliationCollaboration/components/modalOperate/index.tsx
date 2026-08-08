import React, { useEffect, useState } from 'react'
import { Modal } from 'antd'
import { SchemaForm, SchemaMarkupField as Field, createFormActions, FormEffectHooks } from '@apps/formily'
import { Input, Radio, DatePicker, Checkbox } from '@apps/formily'
import styles from './index.less'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

const actions = createFormActions()
const { onFieldChange$ } = FormEffectHooks

export interface IProps {
  title: string
  visible: boolean
  id: any
  onCancel?: () => void
  onOk?: () => void
  fetch?: () => Promise<unknown>
  maxNumber?: number
}

const ModalOperate: React.FC<IProps> = (props: any) => {
  const { title, visible, id, onCancel, onOk, fetch, maxNumber } = props

  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)

  const useFormEffects = () => {
    onFieldChange$('isConfirm').subscribe(({ value }) => {
      actions.setFieldState('reason', (state) => {
        if (value == 1) {
          state.visible = false
        } else {
          state.visible = true
        }
      })
    })
  }

  const modalText = () => {
    return intl.formatMessage({ id: 'detail.purchase.message84' })
  }
  const modalNode = () => {
    return (
      <Field
        enum={[
          { label: intl.formatMessage({ id: 'detail.purchase.message86' }), value: 1 },
          { label: intl.formatMessage({ id: 'detail.purchase.message87' }), value: 0 },
        ]}
        name="isConfirm"
        required
        x-component="Radio"
        x-component-props={{}}
      />
    )
  }

  useEffect(() => {
    actions.clearErrors()
  }, [visible])

  const handleSubmit = (val: any) => {
    if (confirmLoading) {
      return
    }
    setConfirmLoading(true)
    let value = { ...val }
    let params: any = {}
    params.isConfirm = value.isConfirm
    value.isConfirm !== 1 && (params.reason = value.reason)
    fetch({ reconciliationId: id, ...params })
      .then((res) => {
        if (res.code === 1000) {
          onOk && onOk()
        }
      })
      .finally(() => {
        setConfirmLoading(false)
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
          isConfirm: 1,
          status: 1,
        }}
      >
        {modalNode()}
        <Field
          title={modalText()}
          name={'reason'}
          x-component="TextArea"
          required
          x-component-props={{
            placeholder: `${intl.formatMessage({ id: 'detail.purchase.tips17' })}${maxNumber}${intl.formatMessage({
              id: 'detail.purchase.tips18',
            })}`,
          }}
          x-rules={{
            validator: (value) => {
              let _str = value
              _str = _str.replace(/[\u4E00-\u9FA5]/g, 'AA')
              if (_str.length > maxNumber * 2) {
                return {
                  type: 'error',
                  message: intl.formatMessage({
                    id: 'balance.businessReconciliationCollaboration.components.modalOperate.validator',
                    maxNumber2: maxNumber * 2,
                    maxNumber: maxNumber,
                  }),
                }
              } else {
                return null
              }
            },
          }}
        />
      </SchemaForm>
    </Modal>
  )
}

ModalOperate.defaultProps = {
  maxNumber: 60,
}

export default ModalOperate
