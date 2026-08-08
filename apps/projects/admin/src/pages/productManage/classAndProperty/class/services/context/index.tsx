import { getProductPlatformGetCategory, getProductPlatformGetCategoryTree } from '@apps/apis'
import type { GetProductPlatformGetCategoryResponse } from '@apps/apis'
import { TreeContextProps } from '@apps/components'
import { useRequestApi } from '@linkseeks/hooks'
import { Form } from '@linkseeks/ui'
import { useState, createContext, useContext, useRef } from 'react'

export const useCategoryContextValue = () => {
  const [categoryForm] = Form.useForm()
  const [detectionForm] = Form.useForm()
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const [operateType, setOperateType] = useState<'Edit' | 'Add' | 'AddChild'>()
  const treeRef = useRef<TreeContextProps>({} as any)
  const [selectCategoryInfo, setSelectCategoryInfo] = useState<GetProductPlatformGetCategoryResponse>()
  const { runAsync } = useRequestApi(getProductPlatformGetCategory, { manual: true })

  const updateCategoryInfo = async (id: string) => {
    const { data } = await runAsync({ id })
    if (data) {
      categoryForm.setFieldsValue({
        ...data,
      })
      setSelectCategoryInfo(data)
    }
  }

  const refreshData = async () => {
    try {
      const { data } = await getProductPlatformGetCategoryTree()
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
    categoryForm,
    detectionForm,
    selectCategoryInfo,
    operateType,
    submitLoading,
    setSubmitLoading,
    setOperateType,
    setSelectCategoryInfo,
    refreshData,
    updateCategoryInfo,
  }
}

type CategoryContextProps = ReturnType<typeof useCategoryContextValue>

export const CategoryContext = createContext<CategoryContextProps>({} as any)

export const useCategoryContext = () => useContext(CategoryContext)

export const CategoryProvider = (props) => {
  const contextValues = useCategoryContextValue()
  return <CategoryContext.Provider value={contextValues}>{props.children}</CategoryContext.Provider>
}
