import React, { useEffect } from 'react'
import { Modal } from 'antd'
import { SchemaForm, SchemaMarkupField as Field, createFormActions, FormEffectHooks } from '@apps/formily'
import { Input, DatePicker } from '@apps/formily'
import moment from 'moment'
import { postPurchasePurchasePlanUpdate } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'
const actions = createFormActions()
const { onFieldChange$ } = FormEffectHooks

interface ModalLayoutProps {
  /** 单据id */
  id: number
  /** 类型 */
  type?: string
  /** 显示隐藏 */
  visible?: boolean
  /** 标题 */
  title?: string
  /** 传进来的数据 */
  dataScoure: string | number
  /** onClose */
  onClose?: () => void
  /** 刷新 */
  reload: () => void
}

const intl = getIntl()

const ModalLayout: React.FC<ModalLayoutProps> = (props: any) => {
  const { id, type, visible, title, dataScoure, onClose, reload } = props

  const disabledDate = (current) => {
    return current && current <= moment().startOf('day')
  }

  const useFormEffects = () => {
    const { setFieldState } = createFormActions()
  }

  const handleSubmit = (value: any) => {
    const params: any = {
      id,
    }
    if (type === 'summary') {
      params.summary = value.summary
    }
    if (type === 'startTime') {
      params.startTime = new Date(value.startTime).getTime()
    }
    if (type === 'endTime') {
      params.endTime = new Date(value.endTime).getTime()
    }
    postPurchasePurchasePlanUpdate({ ...params })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        onClose()
        reload()
      })
      .catch((error) => {
        console.warn(error)
      })
  }

  useEffect(() => {
    if (type === 'summary') {
      actions.setFieldValue('summary', dataScoure)
    }
    if (type === 'startTime') {
      actions.setFieldValue('startTime', moment(dataScoure).format())
    }
    if (type === 'endTime') {
      actions.setFieldValue('endTime', moment(dataScoure).format())
    }
    actions.clearErrors()
  }, [visible])

  const handleClose = () => {
    onClose()
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
    >
      <SchemaForm
        layout="vertical"
        components={{
          Input,
          DatePicker,
        }}
        actions={actions}
        effects={() => useFormEffects()}
        onSubmit={(values) => handleSubmit(values)}
      >
        {type === 'summary' && (
          <Field
            title={intl.formatMessage({ id: 'detail.purchase.summary' })}
            name="summary"
            required
            x-component="Input"
            x-component-props={{
              style: {
                width: '100%',
              },
            }}
          />
        )}
        {type === 'startTime' && (
          <Field
            title={intl.formatMessage({ id: 'detail.purchase.purchaseStartTime' })}
            name="startTime"
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
        )}
        {type === 'endTime' && (
          <Field
            title={intl.formatMessage({ id: 'detail.purchase.purchaseEndTime' })}
            name="endTime"
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
        )}
      </SchemaForm>
    </Modal>
  )
}
export default ModalLayout
