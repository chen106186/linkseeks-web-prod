/**
 * 多选框结构公共选择组件
 */
import React, { useState, memo, useCallback, useRef, useEffect } from 'react'
import { getCommodityWebShopWebAllShop } from '@apps/apis'
import { isJSONString } from '@/utils'
import type { CommonCheckboxDrawerType } from '../CommonCheckboxDrawer'
import CommonCheckboxDrawer from '../CommonCheckboxDrawer'
import { Select_Content_Type, REQ_FUNDS_TYPE } from '../constant'
import WrapSelect from '../WrapSelect'
import { useIntl } from '@linkseeks/i18n'

export type fetchCheckboxParamsType = {
  [Select_Content_Type.SelectSourceMall]?: Record<string, unknown>
  [Select_Content_Type.SelectReqFundsType]?: Record<string, unknown>
}

const TYPE_ARR = [Select_Content_Type.SelectSourceMall, Select_Content_Type.SelectReqFundsType] as const

type SelectType_Type = (typeof TYPE_ARR)[number]
interface PropsType {
  onChange?: (data: any) => void
  onValueChange?: (data: any[]) => void
  value?: any
  fieldCode?: string
  selectCache?: any[]
  selectType: SelectType_Type // 来源商城 | 请款类型
  disabled?: boolean
  fetchParams?: any
}

const CommonCheckboxSelect = (props: PropsType) => {
  const intl = useIntl()
  const { onChange, value, fieldCode = 'id', onValueChange, selectType, disabled, fetchParams = {}, ...rest } = props
  const [selectData, setSelectData] = useState<any[]>([])
  // const [fetchParams, setFetchParams] = useState<fetchCheckboxParamsType>({})

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

  const getCheckboxDrawer = () => {
    const drawerProps: CommonCheckboxDrawerType = {
      onOk,
      fieldCode,
      fetchApi: null,
      title: '',
      disabled,
      ...rest,
    }
    switch (selectType) {
      case Select_Content_Type.SelectSourceMall:
        drawerProps.fetchApi = getCommodityWebShopWebAllShop
        drawerProps.fetchParams = {
          siteId: import.meta.env.OUT_SITEID,
          ...(fetchParams?.[selectType] || {}),
        }
        drawerProps.title = `${intl.formatMessage({
          id: 'common.button.select',
          defaultMessage: '选择',
        })}${intl.formatMessage({
          id: 'processRuleSetting.laiyuanshangcheng',
          defaultMessage: '来源商城',
        })}`
        break
      case Select_Content_Type.SelectReqFundsType:
        drawerProps.title = `${intl.formatMessage({
          id: 'common.button.select',
          defaultMessage: '选择',
        })}${intl.formatMessage({
          id: 'processRuleSetting.qingkuanleixing',
          defaultMessage: '请款类型',
        })}`
        drawerProps.dataSource = REQ_FUNDS_TYPE
        break
    }
    return <CommonCheckboxDrawer ref={drawerRef} {...drawerProps} />
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
      {getCheckboxDrawer()}
    </>
  )
}

export default memo(CommonCheckboxSelect)
