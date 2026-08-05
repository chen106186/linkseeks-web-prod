/**
 * 单选框结构公共选择组件
 */
import React, { useState, memo, useCallback, useRef, useEffect, useMemo } from 'react'
import { isJSONString } from '@/utils'
import type { CommonRadioDrawerType } from '../CommonRadioDrawer'
import CommonRadioDrawer from '../CommonRadioDrawer'
import { Select_Content_Type } from '../constant'
import WrapSelect from '../WrapSelect'
import { useIntl } from '@linkseeks/i18n'
import { getMemberLifecycleStagesGetLifecycleStages } from '@apps/apis'

export type fetchRadioParamsType = {
  [Select_Content_Type.SelectLifeCycle]?: Record<string, unknown>
}

const TYPE_ARR = [Select_Content_Type.SelectLifeCycle] as const

type SelectType_Type = (typeof TYPE_ARR)[number]

interface PropsType {
  onChange?: (data: any, setCache?: boolean) => void
  onValueChange?: (
    data: any[],
    setCache?: boolean,
    ruleFieldCode?: string,
    ruleFieldKey?: string,
    fieldFieldKey?: string,
  ) => void
  value?: any
  fieldCode?: string
  selectCache?: any[]
  selectType: SelectType_Type // 生命周期阶段
  disabled?: boolean
  fetchParams?: any
  ruleFieldCode?: string
  ruleFieldKey?: string
  fieldFieldKey?: string
  labelKey?: string
}

const UNSET_CACHE_TYPE = [Select_Content_Type.SelectLifeCycle]

const CommonCheckboxSelect = (props: PropsType) => {
  const intl = useIntl()
  const {
    onChange,
    value,
    fieldCode = 'id',
    onValueChange,
    selectType,
    disabled,
    fetchParams = {},
    ruleFieldCode,
    ruleFieldKey,
    fieldFieldKey,
    ...rest
  } = props
  const [selectData, setSelectData] = useState<any[]>([])

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

  const RadioDrawer = useMemo(() => {
    const drawerProps: CommonRadioDrawerType = {
      onOk,
      fieldCode,
      fetchApi: null,
      fetchParams: fetchParams?.[selectType] || {},
      title: '',
      disabled,
      dataSource: null,
      ...rest,
    }
    switch (selectType) {
      // 选择生命周期阶段弹窗
      case Select_Content_Type.SelectLifeCycle:
        drawerProps.fetchApi = getMemberLifecycleStagesGetLifecycleStages
        drawerProps.idKey = 'lifecycleStagesId'
        drawerProps.labelKey = 'lifecycleStagesName'
        drawerProps.title = `${intl.formatMessage({
          id: 'common.button.select',
          defaultMessage: '选择',
        })}${intl.formatMessage({
          id: 'processRuleSetting.shengmingzhouqijieduan',
          defaultMessage: '生命周期阶段',
        })}`
        break
    }
    return <CommonRadioDrawer ref={drawerRef} {...drawerProps} />
  }, [props])

  useEffect(() => {
    // JSON字符串转为原数据
    const keys = value && isJSONString(value) ? JSON.parse(value) : []
    setSelectData(keys)

    const setCache = !UNSET_CACHE_TYPE.includes(selectType)
    onValueChange?.(keys, setCache, ruleFieldCode, ruleFieldKey, fieldFieldKey)
  }, [value])

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
        {...rest}
      />
      {RadioDrawer}
    </>
  )
}

export default memo(CommonCheckboxSelect)
