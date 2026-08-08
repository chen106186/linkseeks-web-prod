import React, { useMemo } from 'react'
import ModalForm from '@/components/ModalForm'
import { createFormActions } from '@apps/formily'
import addressSchema from './schema'
import './index.less'
import { postSettlementInvoiceMessageAdd, postSettlementInvoiceMessageUpdate } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'

export interface InvoiceModalProps {
  mode: 'add' | 'edit' | 'preview' | 'default' | 'delete'
  currentRef?: any
  formInitValue?: any
  reload?()
}

const schemaActions = createFormActions()
const modelTitle = {
  add: getIntl().formatMessage({ id: 'purchaseOrder.add' }),
  edit: getIntl().formatMessage({ id: 'purchaseOrder.edit' }),
  preview: getIntl().formatMessage({ id: 'purchaseOrder.view' }),
}
const InvoiceModal: React.FC<InvoiceModalProps> = (props) => {
  const { mode, formInitValue } = props

  const selfInitValue = useMemo(() => (mode === 'add' ? null : formInitValue), [mode, formInitValue])
  // 由于默认是number类型, 但switch组件只接收boolean
  if (selfInitValue) {
    selfInitValue.isDefault = !!selfInitValue.isDefault
  }

  const resetForm = () => {
    schemaActions.reset({ validate: false })
  }
  const handleConfirm = () => {
    if (mode === 'preview') {
      props.currentRef.current.setVisible(false)
      return
    }
    schemaActions.submit()
  }

  const handleSubmit = async (value) => {
    const params = {
      ...value,
      isDefault: value?.isDefault ? 1 : 0,
    }
    const fn = mode === 'edit' ? postSettlementInvoiceMessageUpdate : postSettlementInvoiceMessageAdd
    await fn(params)
    resetForm()
    props.currentRef.current.setVisible(false)
    // @tofix bug 添加发票后 重载了列表导致选中失效
    props.reload && props.reload()
  }
  return (
    <ModalForm
      modalTitle={modelTitle[mode]}
      previewPlaceholder=" "
      confirm={handleConfirm}
      cancel={resetForm}
      value={selfInitValue}
      editable={mode !== 'preview'}
      effects={($, { setFieldState }) => {
        $('onFormMount').subscribe(() => {})
      }}
      currentRef={props.currentRef}
      actions={schemaActions}
      schema={addressSchema}
      onSubmit={handleSubmit}
      modalProps={{
        destroyOnClose: true,
      }}
    />
  )
}

InvoiceModal.defaultProps = {}

export default InvoiceModal
