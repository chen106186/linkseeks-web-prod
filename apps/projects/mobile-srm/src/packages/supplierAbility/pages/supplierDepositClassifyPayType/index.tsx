/*
 * @Description: 结算方式与主营品类
 */
import React, { useRef, useState, useEffect } from 'react'
import { showLoading, showToast, hideLoading, pxTransform, getCurrentInstance } from '@apps/mobile-services/utils/taro'
import { Icons, View, Button } from '@apps/mobile-ui'
import Router from '@/utils/router'
import { themeLayout } from '@/constants/theme'
import { PATTERN_MAPS } from '@/constants/regExp'
import {
  PAY_TYPE_CASH,
  PAY_TYPE_MONTHLY_STATEMENT,
  PAY_TYPE_PAYMENT_DAYS_DAY,
  PAY_TYPE_PAYMENT_DAYS_MONTH,
} from '@/constants/const/settlement'
import { getProductMobileGetCustomerCategoryTree, GetProductMobileGetCustomerCategoryTreeResponse } from '@apps/apis'
import NavBar from '@/components/NavBar'
import PageLayout from '@/components/PageLayout'
import MellowCard from '@/components/MellowCard'
import Cell from '@/components/Cell'
import Select, { SelectOptions } from '@/components/Select'
import { breakUpCategory, CategoryItemType, CategoryType, getCategoryPath, nestedCategory } from './utils'
import SpaceshipWrap from '../../components/SpaceshipWrap'
import CustomInput from '../../components/CustomInput'
import CustomCascaderList, { CustomCascaderListValueType, MatchNamesType } from '../../components/CustomCascaderList'
import { RuleObject } from '../../components/Form/typings'
import { validateFields } from '../../components/Form/utils/validateUtil'
import './index.scss'

export type CategoriesType = {
  /**
   * 发票类型
   */
  invoiceType: number
  /**
   * 税点，只要百分比的分子部分，不要转换为小数
   */
  taxPoint: number
  /**
   * 预付款
   */
  advanceCharge: number
  /**
   * 结算单据
   */
  settlementDocuments: number
  /**
   * 付款方式
   */
  paymentType: number
  /**
   * 结算方式
   */
  payType: number
  /**
   * 账期，几月
   */
  month?: string
  /**
   * 结算日，每月几号
   */
  monthDay?: string
  /**
   * 结算天数
   */
  days?: string
  /**
   * 品类
   */
  details?: string[][]
}

export type SubmitCategoriesValueType = Omit<CategoriesType, 'month' | 'monthDay' | 'days' | 'details'> & {
  payType: number
  month?: number
  monthDay?: number
  days?: number
  details: CategoryType[]
}

export type NamesMapsType = Record<string, any>[]

type SupplierDepositClassifyPayTypeRouteParams = {
  /**
   * 确认回调事件
   * namesMap 是所有选择的字段对应的中文名称，主要是下拉、级联对应的名称，用于展示...
   */
  onConfirm?: (value: SubmitCategoriesValueType[], namesMaps?: NamesMapsType) => void
  /**
   * 默认值
   */
  defaultValue?: CategoriesType[]
  /**
   * 结算方式选项
   */
  payTypes?: SelectOptions
  /**
   * 预付款选项
   */
  advanceCharges?: SelectOptions
  /**
   * 结算单据选项
   */
  settlementDocuments?: SelectOptions
  /**
   * 付款方式选项
   */
  paymentTypes?: SelectOptions
  /**
   * 发票类型选项
   */
  invoiceTypes?: SelectOptions
  /**
   * 税点选项
   */
  taxPoints?: SelectOptions
}

const SupplierDepositClassifyPayType: React.FC = () => {
  const params = getCurrentInstance().preloadData as SupplierDepositClassifyPayTypeRouteParams
  const {
    onConfirm,
    defaultValue,
    payTypes,
    advanceCharges,
    settlementDocuments,
    paymentTypes,
    invoiceTypes,
    taxPoints,
  } = params || {}

  const [categories, setCategories] = useState<CategoriesType[]>(defaultValue || [])
  const [categoryTreeData, setCategoryTreeData] = useState<GetProductMobileGetCustomerCategoryTreeResponse>([])
  const [categoryDisabledKeys, setCategoryDisabledKeys] = useState<string[]>([])

  const rules = useRef<Map<string, RuleObject[]>>(
    new Map([
      [
        'advanceCharge',
        [
          {
            required: true,
            message: '请选择预付款',
          },
        ],
      ],
      [
        'settlementDocuments',
        [
          {
            required: true,
            message: '请选择结算单据',
          },
        ],
      ],
      [
        'payType',
        [
          {
            required: true,
            message: '请选择结算方式',
          },
        ],
      ],
      [
        'month',
        [
          {
            pattern: PATTERN_MAPS.quantity,
            message: '请输入正整数的账期 (个月)',
          },
        ],
      ],
      [
        'monthDay',
        [
          {
            pattern: PATTERN_MAPS.quantity,
            message: '请输入正整数的结算日期(号)',
          },
          {
            validator: (_, value) => {
              const intVal = +value
              return intVal > 31 || intVal < 0
                ? Promise.reject(new Error('请输入大于0 小于等于 31的数值的结算日期(号)'))
                : Promise.resolve()
            },
          },
        ],
      ],
      [
        'days',
        [
          {
            pattern: PATTERN_MAPS.quantity,
            message: '请输入正整数的账期(间隔天数)',
          },
        ],
      ],
      [
        'paymentType',
        [
          {
            required: true,
            message: '请选择付款方式',
          },
        ],
      ],
      [
        'invoiceType',
        [
          {
            required: true,
            message: '请选择发票类型',
          },
        ],
      ],
      [
        'taxPoint',
        [
          {
            required: true,
            message: '请选择税点',
          },
        ],
      ],
      [
        'details',
        [
          {
            required: true,
            message: '请选择适用品类',
          },
          {
            validator: (_, value) => {
              const emptys = !value || !value.length || value?.filter((item) => !item || !item.length).length
              if (emptys) {
                return Promise.reject(new Error('存在未选择的适用品类数据'))
              }
              return Promise.resolve()
            },
          },
        ],
      ],
    ]),
  )

  const detailsNamesCache = useRef<MatchNamesType[]>([])

  const categoryTreeRef = useRef<{}>({})

  useEffect(() => {
    // 如果不存在事件，则返回上级页面
    // 一般出现在h5在当前页面进行了刷新操作，导致 preloadData 没有了的问题
    if (!onConfirm) {
      setTimeout(() => {
        Router.navigateBack()
      }, 60)
    }
  }, [])

  useEffect(() => {
    if (defaultValue && defaultValue.length) {
      handleItemDetailsValueChange(defaultValue)
    }
  }, [])

  const fetchCustomerCategoryTree = () => {
    showLoading({ title: '正在加载...', mask: true })
    getProductMobileGetCustomerCategoryTree()
      .then((res) => {
        if (res.code === 1000) {
          setCategoryTreeData(res.data)
          categoryTreeRef.current = breakUpCategory(res.data as unknown as CategoryItemType[])
          hideLoading()
        }
      })
      .finally(() => {
        // 在真机如果出现了 Toast 会消失的很快
        // hideLoading();
      })
  }

  useEffect(() => {
    fetchCustomerCategoryTree()
  }, [])

  const handleAdd = () => {
    const mergedValue: CategoriesType[] = [
      ...categories,
      {
        invoiceType: undefined,
        taxPoint: undefined,
        advanceCharge: undefined,
        settlementDocuments: undefined,
        paymentType: undefined,
        details: [],
        payType: undefined,
        month: '',
        monthDay: '',
        days: '',
      } as unknown as CategoriesType,
    ]
    setCategories(mergedValue)
  }

  const handleCategoriesItemChange = (fileName: string, value: any, index: number) => {
    const mergedValue = [...categories]
    mergedValue.splice(index, 1, {
      ...mergedValue[index],
      [fileName]: value,
    })
    setCategories(mergedValue)
  }

  const handleItemPayTypeChange = (value: number, index: number) => {
    const mergedValue = [...categories]
    mergedValue.splice(index, 1, {
      ...mergedValue[index],
      payType: value,
      month: '', // 重置为 空字符串
      monthDay: '', // 重置为 空字符串
      days: '', // 重置为 空字符串
    })
    setCategories(mergedValue)
  }

  const handleRemove = (index: number) => {
    const mergedValue = [...categories]
    mergedValue.splice(index, 1)
    setCategories(mergedValue)
  }

  const handleDetailsMatchNames = (names: MatchNamesType, index) => {
    detailsNamesCache.current[index] = names
  }

  const renderSettlementDate = (payType: number, recordValue: CategoriesType, index: number) => {
    switch (payType) {
      case PAY_TYPE_CASH: {
        break
      }
      case PAY_TYPE_PAYMENT_DAYS_DAY: {
        return (
          <>
            <Cell.Item
              title="账期 (个月)"
              value={
                <CustomInput
                  placeholder="点击输入"
                  value={recordValue.month}
                  onChange={(value) => handleCategoriesItemChange('month', value, index)}
                  style={{
                    width: '50%',
                  }}
                />
              }
            />
            <Cell.Item
              title="结算日期(号)"
              value={
                <CustomInput
                  placeholder="点击输入"
                  value={recordValue.monthDay}
                  onChange={(value) => handleCategoriesItemChange('monthDay', value, index)}
                  style={{
                    width: '50%',
                  }}
                />
              }
            />
          </>
        )
      }
      case PAY_TYPE_PAYMENT_DAYS_MONTH: {
        return (
          <Cell.Item
            title="账期(间隔天数)"
            value={
              <CustomInput
                placeholder="点击输入"
                value={recordValue.days}
                onChange={(value) => handleCategoriesItemChange('days', value, index)}
                style={{
                  width: '50%',
                }}
              />
            }
          />
        )
      }
      case PAY_TYPE_MONTHLY_STATEMENT: {
        return (
          <Cell.Item
            title="结算日期(号)"
            value={
              <CustomInput
                placeholder="点击输入"
                value={recordValue.monthDay}
                onChange={(value) => handleCategoriesItemChange('monthDay', value, index)}
                style={{
                  width: '50%',
                }}
              />
            }
          />
        )
      }
      default:
        break
    }
  }

  const handleItemDetailsValueChange = (categoriesValue: CategoriesType[]) => {
    // 获取所有选择的key
    const allDetailsCheckedKeys: string[] = categoriesValue.reduce<string[]>(
      (pre, now) =>
        pre.concat(
          now.details
            ? now.details?.reduce<string[]>(
                (pre2, now2) =>
                  // 只需要禁用最后一项
                  pre2.concat(now2.slice(-1)),
                [],
              )
            : [],
        ),
      [],
    )
    setCategoryDisabledKeys(allDetailsCheckedKeys)
  }

  const handleItemChangeDetails = (value: CustomCascaderListValueType, index: number) => {
    const mergedValue = [...categories]
    mergedValue.splice(index, 1, {
      ...mergedValue[index],
      details: value as string[][],
    })
    setCategories(mergedValue)
    handleItemDetailsValueChange(mergedValue)
  }

  const handleSubmit = async () => {
    try {
      const promises = categories.map(async (item) => {
        const valueErrors = await validateFields(item, rules.current)
        if (valueErrors.length) {
          return Promise.reject(valueErrors)
        }
        return Promise.resolve()
      })
      try {
        await Promise.all(promises)
        const formated = categories.map((item) => {
          // 这里只需要用到数组的最后一项
          const mergedDetails = item.details
            ? item.details.reduce((pre, now) => pre.concat(now.length ? now[now.length - 1] : []), [])
            : []
          const categoryArr = mergedDetails.map((category) => getCategoryPath(category, categoryTreeRef.current))
          const genealogies = categoryArr.map((item) => nestedCategory(item))
          return {
            details: genealogies,
            payType: item.payType,
            month: item.month ? +item.month : undefined,
            monthDay: item.monthDay ? +item.monthDay : undefined,
            days: item.days ? +item.days : undefined,
            invoiceType: item.invoiceType,
            taxPoint: +item.taxPoint,
            advanceCharge: item.advanceCharge,
            settlementDocuments: item.settlementDocuments,
            paymentType: item.paymentType,
          }
        })
        const namesMaps: NamesMapsType = []
        for (let i = 0; i < categories.length; i++) {
          const item = categories[i]
          const namesMap: Record<string, any> = {}
          namesMap.payType = payTypes?.find((entity) => entity.value === item.payType)?.label || ''
          namesMap.month = item.month ? +item.month : ''
          namesMap.monthDay = item.monthDay ? +item.monthDay : ''
          namesMap.days = item.days ? +item.days : ''
          namesMap.invoiceType = invoiceTypes?.find((entity) => entity.value === item.invoiceType)?.label || ''
          namesMap.taxPoint = +item.taxPoint
          namesMap.advanceCharge = advanceCharges?.find((entity) => entity.value === item.advanceCharge)?.label || ''
          namesMap.settlementDocuments =
            settlementDocuments?.find((entity) => entity.value === item.settlementDocuments)?.label || ''
          namesMap.paymentType = paymentTypes?.find((entity) => entity.value === item.paymentType)?.label || ''
          namesMap.details = detailsNamesCache.current[i]
          namesMaps.push(namesMap)
        }
        onConfirm?.(formated, namesMaps)
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
          <NavBar title="结算方式" />
        </>
      }
    >
      <View className="supplier-classify-payType-section">
        <View className="supplier-classify-payType-add">
          <Button type="secondary" onClick={handleAdd}>
            <Icons size={16} name="Plus" className="supplier-classify-payType-add-icon" />
            添加结算方式
          </Button>
        </View>
        {categories.map((item, index) => {
          const isAll = item.details?.includes('全部')
          return (
            <MellowCard
              key={index}
              title={`结算方式${index + 1}`}
              extra={
                isAll ? null : <Icons name="Trash" color="#c8cacd" size={16} onClick={() => handleRemove(index)} />
              }
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
                <Cell.Item
                  title="预付款"
                  value={
                    <Select
                      title="选择预付款"
                      placeholder="请选择"
                      options={advanceCharges || []}
                      contentAlign="right"
                      value={item.advanceCharge}
                      onChange={(value) => handleCategoriesItemChange('advanceCharge', value, index)}
                      customStyle={{
                        width: '50%',
                      }}
                    />
                  }
                />
                <Cell.Item
                  title="结算单据"
                  value={
                    <Select
                      title="选择结算单据"
                      placeholder="请选择"
                      options={settlementDocuments || []}
                      contentAlign="right"
                      value={item.settlementDocuments}
                      onChange={(value) => handleCategoriesItemChange('settlementDocuments', value, index)}
                      customStyle={{
                        width: '50%',
                      }}
                    />
                  }
                />
                <Cell.Item
                  title="结算方式"
                  value={
                    <Select
                      title="选择结算方式"
                      placeholder="请选择"
                      options={payTypes || []}
                      contentAlign="right"
                      value={item.payType}
                      onChange={(value) => handleItemPayTypeChange(value as number, index)}
                      customStyle={{
                        width: '50%',
                      }}
                    />
                  }
                />
                {renderSettlementDate(item.payType, item, index)}
                <Cell.Item
                  title="付款方式"
                  value={
                    <Select
                      title="选择付款方式"
                      placeholder="请选择"
                      options={paymentTypes || []}
                      contentAlign="right"
                      value={item.paymentType}
                      onChange={(value) => handleCategoriesItemChange('paymentType', value, index)}
                      customStyle={{
                        width: '50%',
                      }}
                    />
                  }
                />
                <Cell.Item
                  title="发票类型"
                  value={
                    <Select
                      title="选择发票类型"
                      placeholder="请选择"
                      options={invoiceTypes || []}
                      contentAlign="right"
                      value={item.invoiceType}
                      onChange={(value) => handleCategoriesItemChange('invoiceType', value, index)}
                      customStyle={{
                        width: '50%',
                      }}
                    />
                  }
                />
                <Cell.Item
                  title="税点"
                  value={
                    <Select
                      title="选择税点"
                      placeholder="请选择"
                      options={taxPoints || []}
                      contentAlign="right"
                      value={item.taxPoint}
                      onChange={(value) => handleCategoriesItemChange('taxPoint', value, index)}
                      customStyle={{
                        width: '50%',
                      }}
                    />
                  }
                />
                <Cell.Item
                  title="适用品类"
                  value={isAll ? '全部' : ''}
                  label={
                    isAll ? null : (
                      <CustomCascaderList
                        cascaderProps={{
                          title: '选择品类',
                          treeData: categoryTreeData,
                          placeholder: '请选择',
                          fieldNames: { label: 'title', value: 'id' },
                          disabledKeys: categoryDisabledKeys,
                        }}
                        value={item.details}
                        onChange={(value) => handleItemChangeDetails(value, index)}
                        onMatchNames={(names) => handleDetailsMatchNames(names, index)}
                        btnTxt="添加品类"
                      />
                    )
                  }
                  customLabelStyle={{
                    paddingBottom: 0,
                  }}
                  headBorder
                />
              </Cell>
            </MellowCard>
          )
        })}
      </View>
      <SpaceshipWrap>
        <Button type="primary" onClick={handleSubmit}>
          确认
        </Button>
      </SpaceshipWrap>
    </PageLayout>
  )
}

export default SupplierDepositClassifyPayType
