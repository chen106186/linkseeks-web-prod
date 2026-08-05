import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { Drawer, Form, Modal, ModalProps, RadioCardGroup, Button, Space, Divider, Row, Popconfirm } from '@linkseeks/ui'
import { BaseComponentProps } from '@apps/components/types/global'
import AddressBaseForm, { ADDRESS_TYPE } from '../AddressBaseForm'
import { useWebIntl } from '@apps/locales'
import { BLOCK_STATUS } from '@apps/services'
import { ActionRef, useAddressManage } from '../useAddressManage'
import { useHandleAddress } from '../useHandleAddress'
import { EditIcon } from '@linkseeks/icons'
import { useToggle } from '@linkseeks/hooks'
import { DeleteFilled } from '@ant-design/icons'
import { AddressManageDrawer } from '../AddressManageDrawer'
export interface AddressManageSelectDrawerProps extends BaseComponentProps<ActionRef> {
  actionRef?: ActionRef
  modalProps?: ModalProps
  onSubmit?(value: any): void
  value: any
  onChange?(value: any): any
  onRefreshAddressList?(): void
}

export const AddressManageSelectDrawer = (props: AddressManageSelectDrawerProps) => {
  const { actionRef, value, onChange, modalProps, onSubmit, onRefreshAddressList } = props
  const translate = useWebIntl()
  const selfRef = useAddressManage()
  // 当前选中的地址项id
  const [innerValue, setInnerValue] = useState()
  const ref = actionRef || selfRef
  const selfHandle = useHandleAddress({ actionRef: ref })
  const { visible, toggle, type = ADDRESS_TYPE.DELIVERY, addressList, setAddressList } = ref

  const drawerActionRef = AddressManageDrawer.useRef({ type })

  useEffect(() => {
    if (value) {
      setInnerValue(value.id || value.sendAddressId)
    }
  }, [value])
  const dispatchAddressList = useMemo(() => {
    if (addressList) {
      return addressList.map((v) => ({
        title: v.receiverName || v.shipperName,
        desc: v.fullAddress,
        value: v.id,
        extra: (
          <Space>
            <Button type="text" icon={<EditIcon />} onClick={() => handleEdit(v.id)}></Button>
            <Popconfirm title={translate('web.common.quedingshangchu')} onConfirm={() => handleDelete(v.id)}>
              <Button type="text" icon={<DeleteFilled />}></Button>
            </Popconfirm>
          </Space>
        ),
      }))
    } else {
      return []
    }
  }, [addressList])
  const handleOnChange = (value) => {
    setInnerValue(value)
  }

  useEffect(() => {
    if (visible) {
      refreshAddressList()
    }
  }, [visible])

  const refreshAddressList = () => {
    selfHandle.getAddressList().then((data) => {
      if (data) {
        setAddressList(data)
        onRefreshAddressList?.()
      }
    })
  }
  // 编辑地址
  const handleEdit = async (id) => {
    const addressInfo = await selfHandle.getAddressDetail({ id })
    drawerActionRef.toggle(BLOCK_STATUS.EDIT, addressInfo)
  }

  const handleAddAddress = () => {
    drawerActionRef.toggle(BLOCK_STATUS.ADD)
  }

  const handleDelete = async (id) => {
    await selfHandle.handleDelete({ id })
    refreshAddressList()
  }

  const handleSelectAddress = () => {
    if (onChange) {
      onChange(addressList.find((v) => v.id === innerValue))
      onSubmit && onSubmit(value)
      toggle()
    }
  }
  const renderButtonParent = () => {
    return (
      <Space>
        <Button type="primary" onClick={handleAddAddress}>
          {translate('web.common.tianjiadizhi')}
        </Button>
        <Button type="primary" onClick={handleSelectAddress}>
          {translate('web.common.confirm')}
        </Button>
      </Space>
    )
  }

  const onSubmitDrawer = (value) => {
    refreshAddressList()
  }

  return (
    <Drawer
      width={800}
      title={translate('web.common.dizhixinxi')}
      open={visible}
      onClose={() => toggle()}
      confirmLoading={selfHandle.loading}
      extra={renderButtonParent()}
      {...modalProps}
    >
      <RadioCardGroup
        value={innerValue}
        onChange={handleOnChange}
        options={dispatchAddressList}
        containerStyle={{ width: '100%' }}
      />
      <AddressManageDrawer actionRef={drawerActionRef} onSubmit={onSubmitDrawer} />
    </Drawer>
  )
}

// 添加静态属性,用于获取对应的ref
AddressManageSelectDrawer.useRef = useAddressManage
AddressManageSelectDrawer.useHandle = useHandleAddress

export default AddressManageSelectDrawer
