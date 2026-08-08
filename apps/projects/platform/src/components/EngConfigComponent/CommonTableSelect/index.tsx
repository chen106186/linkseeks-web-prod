/**
 * 表格结构公共选择组件
 */
import React, { useState, memo, useCallback, useRef, useEffect } from 'react'
import type { RefHandleType } from '../CommonTableDrawer'
import WrapSelect from '../WrapSelect'
import { isJSONString } from '@/utils'
import { Select_Content_Type } from '../constant'
import TableMaterialDrawer from '../TableMaterialDrawer'
import TableGoodsDrawer from '../TableGoodsDrawer'
import TableSupplierDrawer from '../TableSupplierDrawer'
import TableContractDrawer from '../TableContractDrawer'
import TableCustomerDrawer from '../TableCustomerDrawer'
import { useIntl } from '@linkseeks/i18n'

export type fetchTableParamsType = {
  [Select_Content_Type.SelectMaterial]?: Record<string, unknown>
  [Select_Content_Type.SelectSupplier]?: Record<string, unknown>
  [Select_Content_Type.SelectGoods]?: Record<string, unknown>
  [Select_Content_Type.SelectContract]?: Record<string, unknown>
  [Select_Content_Type.SelectCustomer]?: Record<string, unknown>
}

const TYPE_ARR = [
  Select_Content_Type.SelectMaterial,
  Select_Content_Type.SelectSupplier,
  Select_Content_Type.SelectGoods,
  Select_Content_Type.SelectContract,
  Select_Content_Type.SelectCustomer,
] as const

export type SelectType_Type = (typeof TYPE_ARR)[number]
interface PropsType {
  onChange?: (data: any) => void
  onValueChange?: (data: any[]) => void
  value?: any
  fieldCode?: string
  fieldLabel?: string
  onQueryAll?: (value?: any) => void
  selectCache?: any[]
  isAll?: boolean
  disabled?: boolean
  selectType: SelectType_Type
  isSomeQueryAll?: boolean
  fetchParams?: any
  fetchTableApi?: () => Promise<any>
}

const CommonTableSelect = (props: PropsType) => {
  const intl = useIntl()
  const {
    onChange,
    value,
    onQueryAll,
    onValueChange,
    isAll,
    disabled,
    selectType,
    isSomeQueryAll,
    fetchParams = {},
    ...rest
  } = props
  const [selectData, setSelectData] = useState<any[]>([])
  const [isQueryAll, setIsQueryAll] = useState<boolean>(false)
  // const [fetchParams, setFetchParams] = useState<fetchTableParamsType>({})

  const tableDrawerRef = useRef<RefHandleType>()

  // 确定回调
  const handleOk = useCallback((rows: any[]) => {
    // 直接处理为JSON字符串
    onChange?.(JSON.stringify(rows))
    tableDrawerRef?.current?.show(false)
  }, [])

  // 删除某项
  const onItemDelete = (id: string | number) => {
    const newSelectData = selectData.filter((item) => item.id !== id)
    // 直接处理为JSON字符串
    onChange?.(JSON.stringify(newSelectData))
    tableDrawerRef?.current?.setRows(newSelectData)
  }

  // 选中全部回调
  const _onQueryAll = useCallback((val: boolean) => {
    setIsQueryAll(val)
    onQueryAll?.(val)
  }, [])

  useEffect(() => {
    // JSON字符串转为原数据
    const rows = value && isJSONString(value) ? JSON.parse(value) : []
    setSelectData(rows)
    onValueChange?.(rows)
  }, [value])

  useEffect(() => {
    setIsQueryAll(isAll)
    onQueryAll(isAll)
  }, [isAll])

  const getTableDrawer = () => {
    const drawerProps = {
      ref: tableDrawerRef,
      handleOk,
      onQueryAll: _onQueryAll,
      disabled,
      otherParams: fetchParams?.[selectType] || {},
      selectType,
      ...rest,
    }
    switch (selectType) {
      // 选择物料弹窗
      case Select_Content_Type.SelectMaterial:
        return <TableMaterialDrawer {...drawerProps} />

      // 选择供应商弹窗
      case Select_Content_Type.SelectSupplier:
        return <TableSupplierDrawer {...drawerProps} />

      // 选择商品弹窗
      case Select_Content_Type.SelectGoods:
        return <TableGoodsDrawer {...drawerProps} />

      // 选择合同弹窗
      case Select_Content_Type.SelectContract:
        return <TableContractDrawer {...drawerProps} />

      // 选择客户弹窗
      case Select_Content_Type.SelectCustomer:
        return <TableCustomerDrawer {...drawerProps} />
    }
  }

  return (
    <>
      <WrapSelect
        onIconClick={(isSeeMore) => {
          tableDrawerRef?.current?.show(true, {}, { selectData, isQueryAll, isSeeMore })
        }}
        onItemDelete={onItemDelete}
        data={selectData}
        labelKey="value"
        placeholder={
          isQueryAll
            ? intl.formatMessage({ id: 'common.text.all', defaultMessage: '全部' })
            : intl.formatMessage({ id: 'common.select', defaultMessage: '请选择' })
        }
        disabled={disabled}
        tips={
          isSomeQueryAll
            ? intl.formatMessage({
                id: 'processRuleSetting.selectAllTips',
                defaultMessage: '已存在相关字段选择了全部',
              })
            : ''
        }
        showCount={5}
      />
      {getTableDrawer()}
    </>
  )
}

export default memo(CommonTableSelect)
