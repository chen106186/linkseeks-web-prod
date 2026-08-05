import React, { useState, useRef } from 'react'
import { Form, FormInstance, message } from '@linkseeks/ui'
import {
  postCommodityShopEditShopInfo,
  postCommodityShopIsDefaultSwitch,
  postCommodityAdornManageSave,
  postCommodityShopShopSwitch,
} from '@apps/apis'
import { MallFormType, MallItemType } from '../types'

interface EditMallReturn {
  saveLoading: boolean
  editForm: FormInstance<any>
  editVisible: boolean
  setEditVisible: React.Dispatch<React.SetStateAction<boolean>>
  setDeafultMall: (mallItem: MallItemType) => void
  editMallInfo: (values: MallFormType) => void
  createShopAdorn: (shopId: number) => Promise<number | undefined>
  changeMallState: (id: number, enabled: boolean) => void
}

interface EditMallProps {
  refreshFn: () => void
}

const useEditMall = ({ refreshFn }: EditMallProps): EditMallReturn => {
  const [editVisible, setEditVisible] = useState<boolean>(false)
  const [saveLoading, setSaveLoading] = useState<boolean>(false)
  const [form] = Form.useForm()
  const switchState = useRef<boolean>(true)
  /**
   * 设置默认商城
   */
  const setDeafultMall = (mallItem: MallItemType) => {
    return new Promise((resolve, reject) => {
      postCommodityShopIsDefaultSwitch(
        {
          id: mallItem.id,
          enabled: mallItem.isDefault ? false : true,
        },
        { penetrateError: true },
      )
        .then((res) => {
          if (res.code === 1000) {
            refreshFn()
            resolve(true)
          } else {
            message.error(res.message)
            reject()
          }
        })
        .catch(() => {
          reject()
        })
    })
  }

  const editMallInfo = (values: MallFormType) => {
    setSaveLoading(true)
    postCommodityShopEditShopInfo({
      ...values,
      shopId: values.id,
      openMro: values.isOpenMro ? 1 : 0,
    } as any)
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

  /**
   * 改变商城状态
   */
  const changeMallState = (id: number, enabled: boolean) => {
    if (!switchState.current) {
      return
    }
    switchState.current = false
    postCommodityShopShopSwitch(
      {
        id,
        enabled,
      },
      {
        penetrateError: true,
      },
    )
      .then((res) => {
        if (res.code === 1000) {
          refreshFn()
        } else {
          message.destroy()
          message.error(res.message)
        }
      })
      .finally(() => {
        switchState.current = true
      })
  }

  return {
    saveLoading,
    editForm: form,
    editVisible,
    setEditVisible,
    setDeafultMall,
    editMallInfo,
    createShopAdorn,
    changeMallState,
  }
}

export default useEditMall
