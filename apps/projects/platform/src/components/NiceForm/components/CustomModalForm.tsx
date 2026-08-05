import React from 'react'
import { connect } from '@apps/formily'
import ModalForm from '@/components/ModalForm'

const mapTextComponent = (
  Target: React.JSXElementConstructor<any>,
  fieldProps: any = {},
): React.JSXElementConstructor<any> => {
  const { editable, value } = fieldProps
  const xComponentProps = fieldProps.props?.['x-component-props'] || {}
  if (editable !== undefined) {
    if (editable === false) {
      return () => <ModalForm value={value} editable={false} {...xComponentProps} />
    }
  }
  return Target
}

const CustomAddressSelect = connect({
  getComponent: mapTextComponent,
})((props) => {
  const {
    value,
    confirm,
    cancel,
    closeabled,
    modalTitle,
    currentRef,
    width,
    modalProps,
    isDefault,
    disabled,
    ...rest
  } = props
  return (
    <div style={{ flex: 1, overflow: 'hidden' }}>
      <ModalForm
        closeabled={closeabled}
        disabled={disabled}
        value={value}
        confirm={confirm}
        cancel={cancel}
        modalTitle={modalTitle}
        currentRef={currentRef}
        width={width}
        modalProps={modalProps}
        {...rest}
      />
    </div>
  )
})

export default CustomAddressSelect
