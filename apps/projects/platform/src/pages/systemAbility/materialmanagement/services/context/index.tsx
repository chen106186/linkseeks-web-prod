import { getManageMaterialLibraryDirTree, getManageMaterialLibraryPage } from '@apps/apis'
import type { GetManageMaterialLibraryPageResponse } from '@apps/apis'
import { TreeContextProps } from '@apps/components'
import { useRequestApi } from '@linkseeks/hooks'
import { Form } from '@linkseeks/ui'
import React, { useState, createContext, useContext, useRef } from 'react'

export type OPERATETYPE = 'Edit' | 'Add' | 'AddChild' | 'EditMenu'

export const useMaterialContextValue = () => {
  const [menuForm] = Form.useForm()
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const [menuModalVisible, setMenuModalVisible] = useState<boolean>(false)
  const [moveModalVisible, setMoveModalVisible] = useState<boolean>(false)
  const [searchResultVisible, setSearchResultVisible] = useState<boolean>(false)
  const [operateType, setOperateType] = useState<OPERATETYPE>()
  const treeRef = useRef<TreeContextProps>({} as any)
  const [globalSearchValue, setGlobalSearchValue] = useState<string>()
  const [selectMaterialList, setSelectMaterialList] = useState<GetManageMaterialLibraryPageResponse>()
  const { runAsync } = useRequestApi(getManageMaterialLibraryPage, { manual: true })

  const updateMaterial = async (
    id: string,
    param?: { name?: string; type: number; current?: number; pageSize?: number },
  ) => {
    const { data } = await runAsync({ parentId: id, ...param } as any)
    if (data) {
      setSelectMaterialList(data)
    }
  }

  const refreshData = async () => {
    try {
      const { data } = await getManageMaterialLibraryDirTree()
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
    menuForm,
    selectMaterialList,
    operateType,
    submitLoading,
    menuModalVisible,
    moveModalVisible,
    searchResultVisible,
    globalSearchValue,
    setSubmitLoading,
    setOperateType,
    setSelectMaterialList,
    refreshData,
    updateMaterial,
    setMenuModalVisible,
    setMoveModalVisible,
    setSearchResultVisible,
    setGlobalSearchValue,
  }
}

type MaterialContextProps = ReturnType<typeof useMaterialContextValue>

export const MaterialContext = createContext<MaterialContextProps>({} as any)

export const useMaterialContext = () => useContext(MaterialContext)

export const MaterialProvider = (props) => {
  const contextValues = useMaterialContextValue()
  return <MaterialContext.Provider value={contextValues}>{props.children}</MaterialContext.Provider>
}
