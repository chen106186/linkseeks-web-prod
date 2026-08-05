import React, { useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import { Form, Modal, ModalProps } from '@linkseeks/ui'
import { useMemoizedFn, useToggle } from '@linkseeks/hooks'
import { BaseComponentProps } from '@apps/components/types/global'
import AddressBaseForm, { ADDRESS_TYPE } from '../AddressBaseForm'
import { useWebIntl } from '@apps/locales'
import { BLOCK_STATUS } from '@apps/services'
import { ActionRef, useAddressManage } from '../useAddressManage'
import { useHandleAddress } from '../useHandleAddress'

export interface AddressManageModalProps extends BaseComponentProps<ActionRef> {
  actionRef?: ActionRef
  modalProps?: ModalProps
  onSubmit?(value: any): void
}

export const AddressManageModal = (props: AddressManageModalProps) => {
  const { onSubmit, actionRef, modalProps } = props
  const translate = useWebIntl()
  const selfRef = useAddressManage()
  const ref = actionRef || selfRef
  const selfHandle = useHandleAddress({ actionRef: ref })
  const { visible, toggle, formInstance, title, blockStatus, type = ADDRESS_TYPE.DELIVERY } = ref

  const renderTitle = useMemo(() => {
    return title ? title : translate('web.common.dizhiguanli')
  }, [title])

  const handleSubmit = async () => {
    if (blockStatus === BLOCK_STATUS.ADD) {
      await selfHandle.handleAdd()
    }
    if (blockStatus === BLOCK_STATUS.EDIT) {
      await selfHandle.handleEdit()
    }

    const value = await formInstance.validateFields()

    toggle()
    onSubmit && onSubmit(value)
  }

  return (
    <Modal
      width={800}
      title={renderTitle}
      open={visible}
      onCancel={() => toggle()}
      confirmLoading={selfHandle.loading}
      onOk={handleSubmit}
      {...modalProps}
    >
      <AddressBaseForm form={formInstance} type={type} />
    </Modal>
  )
}

// 添加静态属性,用于获取对应的ref
AddressManageModal.useRef = useAddressManage
AddressManageModal.useHandle = useHandleAddress

export default AddressManageModal
