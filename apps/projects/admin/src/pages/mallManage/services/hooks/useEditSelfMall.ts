import React, { useState, useRef } from 'react'
import { Form, FormInstance, message } from '@linkseeks/ui'
import {
  postCommodityShopEditShopInfo,
  postCommoditySelfShopModelEditSelfShopModelInfo,
  postCommodityShopIsDefaultSwitch,
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
  editMallModelInfo: (values: MallFormType) => void
  changeMallState: (id: number, enabled: boolean) => void
}

interface EditMallProps {
  refreshFn: () => void
}

const useEditSelfMall = ({ refreshFn }: EditMallProps): EditMallReturn => {
  const [editVisible, setEditVisible] = useState<boolean>(false)
  const [saveLoading, setSaveLoading] = useState<boolean>(false)
  const switchState = useRef<boolean>(true)
  const [form] = Form.useForm()

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

  /**
   * 编辑商城信息
   */
  const editMallInfo = (values: MallFormType) => {
    setSaveLoading(true)
    postCommodityShopEditShopInfo(
      {
        ...values,
        shopId: values.id,
      },
      { penetrateError: true },
    )
      .then((res) => {
        if (res.code === 1000) {
          refreshFn()
          setEditVisible(false)
        } else {
          message.destroy()
          message.error(res.message)
        }
      })
      .finally(() => {
        setSaveLoading(false)
      })
  }

  /**
   * 编辑商城模型信息
   */
  const editMallModelInfo = (values: any) => {
    setSaveLoading(true)
    postCommoditySelfShopModelEditSelfShopModelInfo(
      {
        ...values,
      },
      { penetrateError: true },
    )
      .then((res) => {
        if (res.code === 1000) {
          refreshFn()
          setEditVisible(false)
        } else {
          message.destroy()
          message.error(res.message)
        }
      })
      .finally(() => {
        setSaveLoading(false)
      })
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
    editMallModelInfo,
    changeMallState,
  }
}

export default useEditSelfMall
