import { useToggle } from '@linkseeks/hooks'
import { Form } from '@linkseeks/ui'
import { ReactNode, useState } from 'react'

const useEditTable = ({ rowKey }) => {
  const [form] = Form.useForm()
  const [editKey, setEditKey] = useState<string | number>()

  const validateEditStatus = (result: string | number) => {
    return result === editKey
  }

  const handleEdit = (record) => {
    setEditKey(record[rowKey])
  }

  const handleCancel = () => {
    setEditKey('')
  }
  return {
    editForm: form,
    editKey,
    setEditKey,
    validateEditStatus,
    handleEdit,
    handleCancel,
  }
}

export default useEditTable
