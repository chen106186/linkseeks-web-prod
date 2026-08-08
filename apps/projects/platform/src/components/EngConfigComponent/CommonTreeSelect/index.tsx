/**
 * 树结构公共选择组件
 */
import React, { useState, memo, useCallback, useRef, useEffect } from 'react'
import { getProductCustomerGetCustomerCategoryTree } from '@apps/apis'
import { isJSONString } from '@/utils'
import CommonTreeDrawer from '../CommonTreeDrawer'
import { Select_Content_Type } from '../constant'
import WrapSelect from '../WrapSelect'
import { useIntl } from '@linkseeks/i18n'

export type fetchTreeParamsType = {
  [Select_Content_Type.SelectCategory]?: Record<string, unknown>
}

const TYPE_ARR = [Select_Content_Type.SelectCategory] as const

type SelectType_Type = (typeof TYPE_ARR)[number]
interface PropsType {
  onChange?: (data: any) => void
  onValueChange?: (data: any[]) => void
  value?: any
  fieldCode?: string
  selectCache?: any[]
  selectType: SelectType_Type // 品类 （目前有品类这种树结构弹窗）
  disabled?: boolean
  fetchParams?: any
}

const CommonTreeSelect = (props: PropsType) => {
  const intl = useIntl()
  const { onChange, value, fieldCode = 'title', onValueChange, selectType, disabled, fetchParams = {}, ...rest } = props
  const [selectData, setSelectData] = useState<any[]>([])
  // const [fetchParams, setFetchParams] = useState<fetchTreeParamsType>({})

  const drawerRef = useRef<any>()

  const onOk = useCallback((keys: any[]) => {
    // 直接处理为JSON字符串
    onChange?.(JSON.stringify(keys))
    drawerRef?.current?.show(false)
  }, [])

  const onItemDelete = (id: string | number) => {
    const newSelectData = selectData.filter((item) => item.id !== id)
    // 直接处理为JSON字符串
    onChange?.(JSON.stringify(newSelectData))
    drawerRef?.current?.setKeys(newSelectData)
  }

  useEffect(() => {
    // JSON字符串转为原数据
    const keys = value && isJSONString(value) ? JSON.parse(value) : []
    setSelectData(keys)
    onValueChange?.(keys)
  }, [value])

  const getTreeDrawer = () => {
    const drawerProps = {
      ref: drawerRef,
      onOk,
      fieldCode,
      fetchParams: fetchParams?.[selectType] || {},
      fetchApi: null,
      title: '',
      disabled,
      ...rest,
    }
    switch (selectType) {
      case Select_Content_Type.SelectCategory:
        // drawerProps.fetchParams = fetchParams[selectType]
        drawerProps.fetchApi = getProductCustomerGetCustomerCategoryTree
        drawerProps.title = `${intl.formatMessage({
          id: 'common.button.select',
          defaultMessage: '选择',
        })}${intl.formatMessage({ id: 'processRuleSetting.pinlei', defaultMessage: '品类' })}`
        break
    }
    return <CommonTreeDrawer {...drawerProps} />
  }

  return (
    <>
      <WrapSelect
        onIconClick={() => {
          drawerRef?.current?.show(true, {}, { selectData })
        }}
        onItemDelete={onItemDelete}
        data={selectData}
        labelKey="value"
        showCount={5}
        disabled={disabled}
      />
      {getTreeDrawer()}
    </>
  )
}

export default memo(CommonTreeSelect)
