import React, { useEffect, useState } from 'react'
import { Modal } from 'antd'
import { SchemaForm, SchemaMarkupField as Field, createFormActions, FormEffectHooks } from '@apps/formily'
import { Input, Radio, DatePicker, Checkbox } from '@apps/formily'
import moment from 'moment'

import styles from './index.less'
import { isEmpty } from 'lodash'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

const actions = createFormActions()
const { onFieldChange$ } = FormEffectHooks

export interface IProps {
  title: string
  visible: boolean
  data?: any
  id: number
  modalType: 'audit' | 'abandon' | 'date' | 'next' | 'key' | 'discard' | 'planAudit' | 'billBack'
  onCancel?: () => void
  onOk?: () => void
  fetch?: () => Promise<unknown>
  maxNumber?: number
  createMemberId?: any
  createMemberRoleId?: any
  hideAuditCancel?: boolean
}

const ModalOperate: React.FC<IProps> = (props: any) => {
  const {
    title,
    data,
    visible,
    id,
    onCancel,
    onOk,
    modalType,
    fetch,
    maxNumber,
    createMemberId,
    createMemberRoleId,
    hideAuditCancel,
  } = props

  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)

  const useFormEffects = () => {
    const { setFieldState } = createFormActions()
    if (modalType === 'audit') {
      onFieldChange$('state').subscribe(({ value }) => {
        actions.setFieldState('auditOpinion', (state) => {
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
        actions.setFieldState('cause', (state) => {
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
        return intl.formatMessage({ id: 'detail.purchase.message84' })
      case 'billBack':
        return intl.formatMessage({ id: 'detail.purchase.message85' })
      default:
        return intl.formatMessage({ id: 'table.purchase.undoCause' })
    }
  }
  const modalNode = () => {
    switch (modalType) {
      case 'audit':
        let _enum = [{ label: intl.formatMessage({ id: 'detail.purchase.message86' }), value: 1 }]
        !hideAuditCancel && _enum.push({ label: intl.formatMessage({ id: 'detail.purchase.message87' }), value: 0 })
        return <Field enum={_enum} name="state" required x-component="Radio" x-component-props={{}} />
      case 'abandon':
        return (
          <Field
            title={intl.formatMessage({ id: 'detail.purchase.message88' })}
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
            title={intl.formatMessage({ id: 'detail.purchase.message88' })}
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
              title={intl.formatMessage({ id: 'table.purchase.quotedPriceTime' })}
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
              description={intl.formatMessage({ id: 'detail.purchase.message89' })}
              enum={[{ label: intl.formatMessage({ id: 'detail.purchase.message90' }), value: 1 }]}
            />
          </>
        )
      case 'next':
        return (
          <Field
            title={intl.formatMessage({ id: 'detail.purchase.message91' })}
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
            title={intl.formatMessage({ id: 'detail.purchase.message92' })}
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
              { label: intl.formatMessage({ id: 'detail.purchase.message86' }), value: 1 },
              { label: intl.formatMessage({ id: 'detail.purchase.message87' }), value: 0 },
            ]}
            name="status"
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
    if (confirmLoading) {
      return
    }
    setConfirmLoading(true)
    let value = { ...val }
    let params: any = {}
    if (modalType === 'audit') {
      params.state = value.state
      value.state !== 1 && (params.auditOpinion = value.auditOpinion)
      // 采购竞价新增 start
      createMemberId && (params.memberId = createMemberId)
      createMemberRoleId && (params.memberRoleId = createMemberRoleId)
      // 采购竞价新增 end
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
    } else {
      params.password = value.password
    }
    fetch({ id, ...params })
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

  const causeName = (name: string) => {
    switch (name) {
      case 'audit':
        return 'auditOpinion'
      case 'planAudit':
      case 'billBack':
        return 'cause'
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
          status: 1,
        }}
      >
        {modalNode()}
        {(modalType === 'audit' ||
          modalType === 'abandon' ||
          modalType === 'discard' ||
          modalType === 'planAudit' ||
          modalType === 'billBack') && (
          <Field
            title={modalText()}
            name={causeName(modalType)}
            x-component="TextArea"
            x-component-props={{
              placeholder: `${intl.formatMessage({ id: 'detail.purchase.tips17' })}${maxNumber}${intl.formatMessage({
                id: 'detail.purchase.tips18',
              })}`,
            }}
            x-rules={[
              {
                required: true,
                message: `${intl.formatMessage({ id: 'detail.purchase.message22' })} ${modalText()}`,
              },
              {
                validator: (value) => {
                  let _str = value
                  _str = _str.replace(/[\u4E00-\u9FA5]/g, 'AA')
                  if (_str.length > maxNumber * 2) {
                    return {
                      type: 'error',
                      message: `${intl.formatMessage({ id: 'detail.purchase.tips19' })}${
                        maxNumber * 2
                      }${intl.formatMessage({ id: 'detail.purchase.tips20' })}，${maxNumber}${intl.formatMessage({
                        id: 'detail.purchase.tips18',
                      })}`,
                    }
                  } else {
                    return null
                  }
                },
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
