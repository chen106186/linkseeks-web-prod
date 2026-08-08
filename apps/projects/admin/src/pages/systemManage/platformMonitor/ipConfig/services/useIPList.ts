import { useRef, useState } from 'react'
import { Form, message } from '@linkseeks/ui'
import { postManageIpMonitorAdd, postManageIpMonitorEdit, postManageIpMonitorDelete } from '@apps/apis'
import type { ActionType } from '@apps/components/src/web/StandardFormTable/types'

const useIPList = () => {
  // 弹窗状态
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  // 监控类型：1:白名单，2:黑名单
  const [monitorType, setMonitorType] = useState<number>(1)
  // 操作类型
  const [operateType, setOperateType] = useState<'add' | 'edit'>('add')
  const [modalConfirmLoading, setModalConfirmLoading] = useState<boolean>(false)
  const [modalForm] = Form.useForm()
  const tableRef = useRef({} as ActionType)

  const modalConfirm = (values: { id: number; monitorType: number; ip: string; remarks: string }) => {
    const OPERATE_API = {
      add: postManageIpMonitorAdd,
      edit: postManageIpMonitorEdit,
    }
    setModalConfirmLoading(true)
    OPERATE_API[operateType](values)
      .then((res) => {
        if (res.code === 1000) {
          if (tableRef.current) {
            tableRef.current?.reload()
          }
          modalForm.resetFields()
          setModalVisible(false)
        } else {
          message.destroy()
          message.error(res.message)
        }
        setModalConfirmLoading(false)
      })
      .catch(() => {
        setModalConfirmLoading(false)
      })
  }

  /**
   * 删除id地址
   */
  const deleteIpConfig = async (id: number) => {
    try {
      const res = await postManageIpMonitorDelete({ id })
      if (res.code === 1000) {
        if (tableRef.current) {
          tableRef.current?.reload()
        }
      } else {
        message.error(res.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return {
    monitorType,
    modalVisible,
    operateType,
    modalForm,
    tableRef,
    modalConfirmLoading,
    deleteIpConfig,
    setModalVisible,
    setMonitorType,
    setOperateType,
    modalConfirm,
  }
}

export default useIPList
