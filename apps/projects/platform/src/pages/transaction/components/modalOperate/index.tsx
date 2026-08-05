import React, { useEffect, useState } from 'react'
import { Modal } from 'antd'
import { SchemaForm, SchemaMarkupField as Field, createFormActions, FormEffectHooks } from '@apps/formily'
import { Input, Radio, DatePicker, Checkbox } from '@apps/formily'
import moment from 'moment'

import styles from './index.less'
import { isEmpty } from 'lodash'
import { getIntl } from '@linkseeks/i18n'

const actions = createFormActions()
const { onFieldChange$ } = FormEffectHooks

export interface IProps {
  title: string
  visible: boolean
  data?: any
  id: number
  modalType:
    | 'audit'
    | 'abandon'
    | 'date'
    | 'next'
    | 'key'
    | 'discard'
    | 'planAudit'
    | 'billBack'
    | 'merkeingAudit'
    | 'marketing'
  onCancel?: () => void
  onOk?: () => void
  fetch?: () => Promise<unknown>
  maxNumber?: number
}
const intl = getIntl()
const ModalOperate: React.FC<IProps> = (props: any) => {
  const { title, data, visible, id, onCancel, onOk, modalType, fetch, maxNumber } = props

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
    if (modalType === 'planAudit') {
      onFieldChange$('status').subscribe(({ value }) => {
        setFieldState('cause', (state) => {
          if (value == 1) {
            state.visible = false
          } else {
            state.visible = true
          }
        })
      })
    }

    if (modalType === 'merkeingAudit') {
      onFieldChange$('agree').subscribe(({ value }) => {
        setFieldState('reason', (state) => {
          if (value == 1) {
            state.visible = false
          } else {
            state.visible = true
          }
        })
      })
    }

    if (modalType === 'marketing') {
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

  const modalText = () => {
    switch (modalType) {
      case 'audit':
      case 'planAudit':
      case 'merkeingAudit':
      case 'marketing':
        return intl.formatMessage({ id: 'transaction_components.shenhebutongguoyuanyin' })
      case 'billBack':
        return intl.formatMessage({ id: 'transaction_components.tuihuiyuanyin' })
      default:
        return intl.formatMessage({ id: 'transaction_components.zuofeiyuanyin' })
    }
  }
  const modalNode = () => {
    switch (modalType) {
      case 'audit':
        return (
          <Field
            enum={[
              { label: intl.formatMessage({ id: 'transaction_components.shenhetongguo' }), value: 1 },
              { label: intl.formatMessage({ id: 'transaction_components.shenhebutongguo' }), value: 0 },
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
            title={intl.formatMessage({ id: 'transaction_components.zuofeishijian' })}
            name="reasonTime"
            required
            x-component="DatePicker"
            x-component-props={{
              style: {
                width: '100%',
              },
              format: 'YYYY-MM-DD HH:mm:ss',
              disabledDate: (current) => {
                return moment().calendar()
              },
            }}
          />
        )
      case 'discard':
        return (
          <Field
            title={intl.formatMessage({ id: 'transaction_components.zuofeishijian' })}
            name="reasonTime"
            required
            x-component="DatePicker"
            x-component-props={{
              style: {
                width: '100%',
              },
              format: 'YYYY-MM-DD HH:mm:ss',
              disabled: true,
            }}
          />
        )
      case 'date':
        return (
          <>
            <Field
              title={intl.formatMessage({ id: 'transaction_components.baojiajiezhishijian' })}
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
              name="isNow"
              x-component="CheckboxGroup"
              description={intl.formatMessage({ id: 'transaction_components.gouxuanhougongyingshangbuneng' })}
              enum={[{ label: intl.formatMessage({ id: 'transaction_components.lijijiezhibaojia' }), value: 1 }]}
            />
          </>
        )
      case 'next':
        return (
          <Field
            title={intl.formatMessage({ id: 'transaction_components.xialunbaojiajiezhishijian' })}
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
        return (
          <Field
            title={intl.formatMessage({ id: 'transaction_components.qingshurujiemimiyao' })}
            x-component="Input"
            name="password"
            required
            x-component-props={{}}
          />
        )
      case 'planAudit':
        return (
          <Field
            enum={[
              { label: intl.formatMessage({ id: 'transaction_components.shenhetongguo' }), value: 1 },
              { label: intl.formatMessage({ id: 'transaction_components.shenhebutongguo' }), value: 0 },
            ]}
            name="status"
            required
            x-component="Radio"
            x-component-props={{}}
          />
        )
      case 'merkeingAudit':
        return (
          <Field
            enum={[
              { label: intl.formatMessage({ id: 'transaction_components.shenhetongguo' }), value: 1 },
              { label: intl.formatMessage({ id: 'transaction_components.shenhebutongguo' }), value: 0 },
            ]}
            name="agree"
            required
            x-component="Radio"
            x-component-props={{}}
          />
        )
      case 'marketing':
        return (
          <Field
            enum={[
              { label: intl.formatMessage({ id: 'transaction_components.shenhetongguo' }), value: 1 },
              { label: intl.formatMessage({ id: 'transaction_components.shenhebutongguo' }), value: 0 },
            ]}
            name="isPass"
            required
            x-component="Radio"
            x-component-props={{}}
          />
        )
    }
  }

  useEffect(() => {
    if (modalType === 'next') {
      actions.setFieldValue('quotedPriceTime', moment().format())
    }
    if (modalType === 'abandon' || modalType === 'discard') {
      actions.setFieldValue('reasonTime', moment().format())
    }
    if (modalType === 'date') {
      actions.setFieldValue('quotedPriceTime', moment(data).format())
    }
    actions.clearErrors()
  }, [visible])

  const handleSubmit = (val: any) => {
    let value = { ...val }
    let params: any = {}
    setLoading(true)
    if (modalType === 'audit') {
      params.state = value.state
      value.state !== 1 && (params.auditOpinion = value.auditOpinion)
    } else if (modalType === 'abandon') {
      params.reason = value.reason
      params.reasonTime = new Date(value.reasonTime).getTime()
    } else if (modalType === 'discard') {
      params.discardCaues = value.reason
      params.discardTime = new Date(value.reasonTime).getTime()
    } else if (modalType === 'date') {
      params.quotedPriceTime = new Date(value.quotedPriceTime).getTime()
      params.isNow = !isEmpty(value.isNow) ? 1 : 0
    } else if (modalType === 'next') {
      params.quotedPriceTime = new Date(value.quotedPriceTime).getTime()
    } else if (modalType === 'planAudit') {
      params.status = value.status
      value.status !== 1 && (params.cause = value.cause)
    } else if (modalType === 'billBack') {
      params.status = 0
      params.cause = value.cause
    } else if (modalType === 'merkeingAudit') {
      params.agree = value.agree
      params.reason = value.reason
    } else if (modalType === 'marketing') {
      params.isPass = value.isPass
      params.opinion = value.opinion
    } else {
      params.password = value.password
    }
    fetch({ id, ...params }).then((res) => {
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

  const causeName = (name: string) => {
    switch (name) {
      case 'audit':
        return 'auditOpinion'
      case 'planAudit':
        return 'cause'
      case 'marketing':
        return 'opinion'
      default:
        return 'reason'
    }
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
          status: 1,
          agree: 1,
          isPass: 1,
        }}
      >
        {modalNode()}
        {(modalType === 'audit' ||
          modalType === 'abandon' ||
          modalType === 'discard' ||
          modalType === 'planAudit' ||
          modalType === 'billBack' ||
          modalType === 'merkeingAudit' ||
          modalType === 'marketing') && (
          <Field
            title={modalText()}
            name={causeName(modalType)}
            x-component="TextArea"
            x-component-props={{
              placeholder: `${intl.formatMessage({
                id: 'transaction_components.zaicishurunideneirong',
              })}${maxNumber}${intl.formatMessage({ id: 'transaction_components.gehanzi' })}`,
            }}
            x-rules={[
              {
                required: true,
                message: `${intl.formatMessage({ id: 'common.form.input.placeholder' })}${modalText()}`,
              },
              {
                max: maxNumber,
                message: `${intl.formatMessage({
                  id: 'transaction_components.yuanyinzuiduo',
                })}${maxNumber}${intl.formatMessage({ id: 'transaction_components.gehanzi' })}`,
              },
            ]}
          />
        )}
      </SchemaForm>
    </Modal>
  )
}

ModalOperate.defaultProps = {
  maxNumber: 60,
}

export default ModalOperate
