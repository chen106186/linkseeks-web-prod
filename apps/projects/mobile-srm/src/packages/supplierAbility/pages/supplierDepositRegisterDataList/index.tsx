/*
 * @Description: 注册资料列表
 */
import React, { useRef, useState, useEffect } from 'react'
import { showToast, pxTransform, getCurrentInstance } from '@apps/mobile-services/utils/taro'
import { Icons, View, Button } from '@apps/mobile-ui'
import Router from '@/utils/router'
import { themeLayout } from '@/constants/theme'
import NavBar from '@/components/NavBar'
import PageLayout from '@/components/PageLayout'
import MellowCard from '@/components/MellowCard'
import Cell from '@/components/Cell'
import {
  ElementType,
  renderFormFieldComponent,
  getFieldEmptyValue,
  getFieldType,
  FormFieldType,
} from '../../common/utils/createMemberSchemaUtil'
import SpaceshipWrap from '../../components/SpaceshipWrap'
import { RuleObject } from '../../components/Form/typings'
import { validateFields } from '../../components/Form/utils/validateUtil'
import './index.scss'

export type ListData = Record<string, any>

export type NamesMapsType = Record<string, any>[]

type SupplierDepositRegisterDataListRouteParams = {
  /**
   * 确认回调事件
   * namesMap 是所有选择的字段对应的中文名称，主要是下拉、级联对应的名称，用于展示...
   */
  onConfirm?: (value: any) => void
  /**
   * 默认值
   */
  defaultValue?: ListData[]
  /**
   * 标题
   */
  title: string
  /**
   * 列表配置
   */
  configs: ElementType[]
}

const SupplierDepositRegisterDataList: React.FC = () => {
  const params = getCurrentInstance().preloadData as SupplierDepositRegisterDataListRouteParams
  const { onConfirm, defaultValue, title, configs } = params || {}

  const [listData, setListData] = useState<ListData[]>(defaultValue || [])

  const [registerData, setRegisterData] = useState<FormFieldType[]>([])

  // 校验规则
  const registerRules = useRef<Map<string, RuleObject[]>>(new Map([]))

  useEffect(() => {
    // 如果不存在事件，则返回上级页面
    // 一般出现在h5在当前页面进行了刷新操作，导致 preloadData 没有了的问题
    if (!onConfirm) {
      setTimeout(() => {
        Router.navigateBack()
      }, 60)
    }
  }, [])

  const normalizeRegisterData = (data: ElementType[]) => {
    if (!data || !data.length) {
      return
    }
    const registerDataGroups: FormFieldType[] = []
    data.forEach((item) => {
      const field = getFieldType(item)
      registerRules.current.set(field.fieldName, field.rules)
      registerDataGroups.push(field)
    })
    setRegisterData(registerDataGroups)
  }

  useEffect(() => {
    normalizeRegisterData(configs)
  }, [configs])

  const handleAdd = () => {
    if (!configs || !configs.length) {
      showToast({ title: '缺少列表配置信息' })
      return
    }
    const listItemEmptyValue = {}
    for (let i = 0; i < configs.length; i++) {
      const item = configs[i]
      listItemEmptyValue[item.fieldName as string] = getFieldEmptyValue(item.fieldType as string)
    }
    const mergedValue: ListData[] = [...listData, listItemEmptyValue]
    setListData(mergedValue)
  }

  const handleListItemChange = (fileName: string, value: any, index: number) => {
    const mergedValue = [...listData]
    mergedValue.splice(index, 1, {
      ...mergedValue[index],
      [fileName]: value,
    })
    setListData(mergedValue)
  }

  const handleRemove = (index: number) => {
    const mergedValue = [...listData]
    mergedValue.splice(index, 1)
    setListData(mergedValue)
  }

  const handleSubmit = async () => {
    try {
      const promises = listData.map(async (item) => {
        const valueErrors = await validateFields(item, registerRules.current)
        if (valueErrors.length) {
          return Promise.reject(valueErrors)
        }
        return Promise.resolve()
      })
      try {
        await Promise.all(promises)
        onConfirm?.(listData)
        Router.navigateBack()
      } catch (err) {
        if (err && err.length) {
          showToast({ title: err[0].errors?.[0], icon: 'none' })
          return
        }
      }
    } catch (error) {}
  }

  return (
    <PageLayout
      renderHeader={
        <>
          <NavBar title={title} />
        </>
      }
    >
      <View className="supplier-classify-payType-section">
        <View className="supplier-classify-payType-add">
          <Button type="secondary" onClick={handleAdd}>
            <Icons size={16} name="Plus" className="supplier-classify-payType-add-icon" />
            {`添加${title}`}
          </Button>
        </View>
        {listData.map((item, index) => (
          <MellowCard
            key={index}
            title={`${title}${index + 1}`}
            extra={<Icons name="Trash" color="#c8cacd" size={16} onClick={() => handleRemove(index)} />}
            headStyle={{
              paddingRight: 0,
              paddingLeft: 0,
              marginRight: pxTransform(themeLayout['margin-s']),
              marginLeft: pxTransform(themeLayout['margin-s']),
            }}
            bodyStyle={{
              padding: 0,
            }}
            style={{
              marginBottom: pxTransform(themeLayout['margin-xs']),
            }}
          >
            <Cell>
              {registerData?.map((registerItem) => (
                <Cell.Item
                  key={registerItem.fieldName}
                  title={registerItem.title}
                  value={renderFormFieldComponent(registerItem, false, {
                    value: item[registerItem.fieldName],
                    onChange: (value) => handleListItemChange(registerItem.fieldName, value, index),
                  })}
                />
              ))}
            </Cell>
          </MellowCard>
        ))}
      </View>
      <SpaceshipWrap>
        <Button type="primary" onClick={handleSubmit}>
          确认
        </Button>
      </SpaceshipWrap>
    </PageLayout>
  )
}

export default SupplierDepositRegisterDataList
