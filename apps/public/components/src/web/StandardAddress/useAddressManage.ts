import React, { useImperativeHandle, useMemo, useRef, useState } from 'react'
import { Form, Modal, ModalProps } from '@linkseeks/ui'
import { useMemoizedFn, useToggle } from '@linkseeks/hooks'
import { useWebIntl } from '@apps/locales'
import { BLOCK_STATUS, useBlockStatus } from '@apps/services'
import { ADDRESS_TYPE } from './AddressBaseForm'
import { AreaSelectFormItem } from '../FormComponent'

const { useAreaSelect } = AreaSelectFormItem
export const useAddressManage = (options?: { type: ADDRESS_TYPE }) => {
  const { type } = options || {}
  const [visible, toggle] = useToggle(false)
  const translate = useWebIntl()
  const [formInstance] = Form.useForm()
  const [addressList, setAddressList] = useState<any[]>([])
  const { initAreaSelect } = useAreaSelect(formInstance)
  const { title, blockStatus, setBlockStatus } = useBlockStatus({
    showTitle: {
      ADD: translate('web.resource.logistics.xinzengdizhi'),
      EDIT: translate('web.resource.logistics.bianjidizhi'),
      PREVIEW: translate('web.resource.logistics.chakandizhi'),
    },
    defaultStatus: BLOCK_STATUS.DEFAULT,
  })

  const handleToggle = useMemoizedFn((blockStatus?: BLOCK_STATUS, initValue?: any) => {
    if (blockStatus === BLOCK_STATUS.ADD) {
      // 新增的时候清空数据
      formInstance.resetFields()
    }
    if (initValue) {
      formInstance.setFieldsValue(initValue)
      // 初始化省市区，如果外部有传入字段的话
      initAreaSelect(initValue)
    }

    if (blockStatus) {
      setBlockStatus(blockStatus)
    }
    toggle()
  })
  const exportValue = {
    visible,
    toggle: handleToggle,
    title,
    blockStatus,
    setBlockStatus,
    formInstance,
    type,
    addressList,
    setAddressList,
  }

  return exportValue
}

export type ActionRef = ReturnType<typeof useAddressManage>
