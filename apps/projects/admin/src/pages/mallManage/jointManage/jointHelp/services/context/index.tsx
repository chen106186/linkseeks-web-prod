import { getCommodityShopHelpInfoDetail, getCommodityShopHelpInfoTree } from '@apps/apis'
import type { GetCommodityShopHelpInfoDetailResponse } from '@apps/apis'
import { BraftEditor, TreeContextProps } from '@apps/components'
import { useRequestApi } from '@linkseeks/hooks'
import { Form } from '@linkseeks/ui'
import { useState, createContext, useContext, useRef } from 'react'

export type OPERATETYPE = 'Edit' | 'Add' | 'AddChild' | 'EditMenu'

export const useHelpfulContextValue = () => {
  const [helpfulForm] = Form.useForm()
  const [menuForm] = Form.useForm()
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const [menuModalVisible, setMenuModalVisible] = useState<boolean>(false)
  const [operateType, setOperateType] = useState<OPERATETYPE>()
  const treeRef = useRef<TreeContextProps>({} as any)
  const [selectHelpfulInfo, setSelectHelpfulInfo] = useState<GetCommodityShopHelpInfoDetailResponse>()
  const { runAsync } = useRequestApi(getCommodityShopHelpInfoDetail, { manual: true })

  const updateHelpful = async (id: string) => {
    const { data } = await runAsync({ id })
    if (data) {
      helpfulForm.setFieldsValue({
        ...data,
        helpContent: BraftEditor.createEditorState(data.helpContent),
      })
      setSelectHelpfulInfo(data)
    }
  }

  const refreshData = async (shopId: string | undefined) => {
    try {
      if (!shopId) {
        return {
          data: [],
        }
      }
      const { data } = await getCommodityShopHelpInfoTree({ shopId })
      treeRef.current.checkAction.setSelected([])

      return {
        data: data || [],
      }
    } catch (error) {
      return []
    }
  }

  return {
    treeRef,
    helpfulForm,
    menuForm,
    selectHelpfulInfo,
    operateType,
    submitLoading,
    menuModalVisible,
    setSubmitLoading,
    setOperateType,
    setSelectHelpfulInfo,
    refreshData,
    updateHelpful,
    setMenuModalVisible,
  }
}

type HelpfulContextProps = ReturnType<typeof useHelpfulContextValue>

export const HelpfulContext = createContext<HelpfulContextProps>({} as any)

export const useHelpfulContext = () => useContext(HelpfulContext)

export const HelpfulProvider = (props) => {
  const contextValues = useHelpfulContextValue()
  return <HelpfulContext.Provider value={contextValues}>{props.children}</HelpfulContext.Provider>
}
