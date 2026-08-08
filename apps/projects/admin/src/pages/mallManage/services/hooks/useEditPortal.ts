import React, { useState, useRef } from 'react'
import { Form, FormInstance, message } from '@linkseeks/ui'
import { postCommodityShopEditShopInfo, postCommodityAdornManageSave } from '@apps/apis'
import { MallFormType } from '../types'

interface EditMallReturn {
  saveLoading: boolean
  editForm: FormInstance<any>
  editVisible: boolean
  setEditVisible: React.Dispatch<React.SetStateAction<boolean>>
  editMallInfo: (values: MallFormType) => void
  createShopAdorn: (shopId: number) => Promise<number | undefined>
}

interface EditMallProps {
  refreshFn: () => void
}

const useEditProtal = ({ refreshFn }: EditMallProps): EditMallReturn => {
  const [editVisible, setEditVisible] = useState<boolean>(false)
  const [saveLoading, setSaveLoading] = useState<boolean>(false)
  const [form] = Form.useForm()

  const editMallInfo = (values: MallFormType) => {
    setSaveLoading(true)
    postCommodityShopEditShopInfo({
      ...values,
      shopId: values.id,
    })
      .then((res) => {
        if (res.code === 1000) {
          refreshFn()
          setEditVisible(false)
        }
      })
      .finally(() => {
        setSaveLoading(false)
      })
  }

  /**
   * 生成商城装修id
   */
  const createShopAdorn = async (shopId: number): Promise<number | undefined> => {
    const res = await postCommodityAdornManageSave({
      shopId,
    })
    message.destroy()
    if (res.code === 1000 && res.data) {
      return res.data
    }
    return undefined
  }

  return {
    saveLoading,
    editForm: form,
    editVisible,
    setEditVisible,
    editMallInfo,
    createShopAdorn,
  }
}

export default useEditProtal
