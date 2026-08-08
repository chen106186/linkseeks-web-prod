import { useState } from 'react'
import { Form } from '@linkseeks/ui'

const useUnit = () => {
  const [addModalVisible, setModalVsiible] = useState<boolean>(false)
  const [operateType, setOperateType] = useState<'add' | 'edit'>('add')
  const [unitForm] = Form.useForm()

  return {
    unitForm,
    operateType,
    addModalVisible,
    setModalVsiible,
    setOperateType,
  }
}

export default useUnit
