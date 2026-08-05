import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { Drawer, Form, Modal, ModalProps, RadioCardGroup, Button, Space, Divider, Row } from '@linkseeks/ui'
import { BaseComponentProps } from '@apps/components/types/global'
import AddressBaseForm, { ADDRESS_TYPE } from '../AddressBaseForm'
import { useWebIntl } from '@apps/locales'
import { BLOCK_STATUS } from '@apps/services'
import { ActionRef, useAddressManage } from '../useAddressManage'
import { useHandleAddress } from '../useHandleAddress'
import { EditIcon } from '@linkseeks/icons'
import { useToggle } from '@linkseeks/hooks'
import { DeleteFilled } from '@ant-design/icons'

export interface AddressManageDrawerProps extends BaseComponentProps<ActionRef> {
  actionRef?: ActionRef
  modalProps?: ModalProps
  onSubmit?(value: any): void
}

export const AddressManageDrawer = (props: AddressManageDrawerProps) => {
  const { onSubmit, actionRef, modalProps } = props
  const translate = useWebIntl()
  const selfRef = useAddressManage()
  const ref = actionRef || selfRef
  const selfHandle = useHandleAddress({ actionRef: ref })
  const {
    visible,
    toggle,
    formInstance,
    title,
    blockStatus,
    setBlockStatus,
    type = ADDRESS_TYPE.DELIVERY,
    addressList,
    setAddressList,
  } = ref

  const renderTitle = useMemo(() => {
    return title || translate('web.common.dizhixinxi')
  }, [title])

  const handleSubmit = async () => {
    if (blockStatus === BLOCK_STATUS.ADD) {
      await selfHandle.handleAdd()
    }
    if (blockStatus === BLOCK_STATUS.EDIT) {
      await selfHandle.handleEdit()
    }

    toggle()
    onSubmit && onSubmit(true)
  }

  const renderButtonParent = () => {
    return (
      <Button type="primary" onClick={handleSubmit}>
        {translate('web.common.confirm')}
      </Button>
    )
  }

  return (
    <Drawer
      width={800}
      title={renderTitle}
      open={visible}
      onClose={() => toggle()}
      confirmLoading={selfHandle.loading}
      onOk={handleSubmit}
      extra={renderButtonParent()}
      {...modalProps}
    >
      <AddressBaseForm form={formInstance} type={type} />
    </Drawer>
  )
}

// 添加静态属性,用于获取对应的ref
AddressManageDrawer.useRef = useAddressManage
AddressManageDrawer.useHandle = useHandleAddress

export default AddressManageDrawer
