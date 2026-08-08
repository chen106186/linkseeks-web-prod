import { useRequestApi, useSelections, useToggle } from '@linkseeks/hooks'
import { Form, FormInstance } from '@linkseeks/ui'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  getProductCustomerGetCustomerCategoryById,
  getProductCommodityGetCommodity,
  GetProductCommodityGetCommodityResponse,
  getProductCommodityDraftGetCommodityDraftById,
  getProductCustomerGetCustomerAttributeValueList,
} from '@apps/apis'
import { useAttributeManager } from './hooks/useAttributeManager'
import { AttributeGroupType, AttributeModel } from './models/AttributeModel'
import { useSpecsAttributeDataTable } from './hooks/useSpecsAttributeDataTable'
import { AttributeSKU } from './models/AttributeSKU'
import { useSpecsDataSelectField } from './hooks/formField/useSpecsDataSelectField'
import { validateSpecsAttr } from './utils'
import { usePageStatus } from '../hooks/usePageStatus'
import { detailTransform, detailTransformData } from './transformer/detail'
import { COMMODITY_CATEGORY_TYPE_ENUM } from '@apps/constants/commodity'
import { COMMODITY_PAGE_STATUS, SPECS_ATTR_NAME_PREFIX } from './constants'
import { SpecsAttributeTableItem, SpecsAttributeTableRow } from './models'

/**
 * 整个商品管理的上下文控制
 * 所有商品相关的数据和字段操作都可以在这里进行获取
 */
interface ExtraData {
  commodityPic?: {
    url: string
    [key: string]: any
  }[]

  categoryFullName?: string

  brandName?: string

  unitName?: string

  /**
   * 每次页面初始化时得到的属性列表id，新增状态下，这个数组应该是一个空数组
   */
  initAttributeList: number[]
}
/**
 * 可通过该hook进行监听表单值的变化
 */
export const useFormField = (key: string) => {
  const formInstance = Form.useFormInstance()
  const formValue = Form.useWatch(key, formInstance)

  return [formValue]
}

/**
 * 初始化整个商品状态
 */
const initProductFormValue = (pageType: COMMODITY_PAGE_STATUS) => {
  const { id } = usePageStatus()
  const [formInstance] = Form.useForm()
  const { initAttribute, attributeManager } = useAttributeManager()
  const { columns, setColumns, dataSource, setDataSource } = useSpecsAttributeDataTable()

  const [productData, setProductData] = useState<detailTransformData | null>(null)
  const [productOriginalData, setProductOriginalData] = useState<GetProductCommodityGetCommodityResponse>()
  // 是否已审核
  const [isChecked, toggleChecked] = useToggle(false)
  // 物料数据
  const [materialDataSource, setMaterialDataSource] = useState<any[]>([])

  // 商品规格弹窗选中参数
  const [specsSelections, setSpecsSelections] = useState<any[]>([])

  // 生成好的SKU数据
  const specsAttributeSKU = useRef<AttributeSKU>()

  // 这里监听了来自规格属性值的变化
  const specsDataSelectValue = useSpecsDataSelectField(formInstance)
  // 一些不参与视图交互，但是需要跟随表单进行提交的数据
  const extraDataRef = useRef<ExtraData>({ initAttributeList: [] } as any)

  const [pageLoading, togglePageLoading] = useToggle(false)

  // 商品类型
  const [commodityType, setCommodityType] = useState<COMMODITY_CATEGORY_TYPE_ENUM>(COMMODITY_CATEGORY_TYPE_ENUM.SHIWU)

  // 是否是单规格商品
  const [isSingleSpecs, toggleSingleSpecs] = useState(false)
  const [codeDisabled, setCodeDisabled] = useState(false)
  /**
   * 接口调用初始化
   */

  // 获取商品属性列表, 当选择品类之后，会自动触发该接口
  const { run: getCategoryRun, refresh: getCategoryRefresh } = useRequestApi(
    getProductCustomerGetCustomerCategoryById,
    {
      manual: true,
      onSuccess(d) {
        if (d.code === 1000) {
          const attrList = d.data?.customerAttributeList || []
          const commodityType = d.data?.type

          if (attrList) {
            const attributeModels = attrList.map((v) => new AttributeModel(v as any))
            initAttribute(attributeModels)
            // 没有规格属性，则设定为单规格商品
            // 注意这里还有种情况是 已经审核过的商品，不会再调用这个接口，所以需要通过判断商品详情内的数据处理
            if (!attributeModels.some((v) => v.type === AttributeGroupType.SPECS)) {
              toggleSingleSpecs(true)
              if (pageType === COMMODITY_PAGE_STATUS.ADD) {
                const sku = new SpecsAttributeTableRow()
                // 单规格商品
                toggleSingleSpecs(true)
                // 初始化规格设置
                setDataSource([sku])
                setColumns([])
                // 初始化已经选过的规格属性
                formInstance.resetFields([SPECS_ATTR_NAME_PREFIX])
              }
            } else {
              toggleSingleSpecs(false)
              if (dataSource.length > 0 && pageType === COMMODITY_PAGE_STATUS.ADD) {
                // 切换品类的时候，如果规格属性已经有值了，是需要清空规格列表的
                // 防止由单规格切往多规格时产生多余数据
                setDataSource([])
              }
            }
          }

          if (commodityType) {
            setCommodityType(commodityType)
          }
        }
      },
    },
  )

  // 编辑/详情状态下，需自动请求详情接口并储存
  useEffect(() => {
    if (id) {
      togglePageLoading()
      let fn: any = null
      let payload: any = null
      if (pageType === COMMODITY_PAGE_STATUS.EDIT || pageType === COMMODITY_PAGE_STATUS.DETAIL) {
        fn = getProductCommodityGetCommodity
        payload = { id }
      } else if (pageType === COMMODITY_PAGE_STATUS.DRAFT) {
        fn = getProductCommodityDraftGetCommodityDraftById
        payload = { commodityDraftId: id }
      }

      fn(payload)
        .then((res) => {
          const { data } = res
          const detailValue = detailTransform(pageType === COMMODITY_PAGE_STATUS.DRAFT ? data.draft : data)
          setProductOriginalData(data)
          extraDataRef.current.initAttributeList = (detailValue?.commoditySkuList?.map((v) =>
            v.commoditySkuAttributeList?.map((v) => v?.customerAttribute?.id),
          )?.[0] || []) as any

          if (detailValue.formData) {
            formInstance.setFieldsValue(detailValue.formData)
          } else {
            formInstance.setFieldsValue(detailValue)
          }
          setDataSource(detailValue.specsSettingDataSource)
          setSpecsSelections(detailValue.specsSettingDataSource.map((v) => v.getRowKey()))
          // 是否从未审核
          toggleChecked(!!detailValue.isCheckPass)

          setProductData(detailValue)

          if (detailValue.isCheckPass) {
            handleCheckPass(data)
            setCodeDisabled(true)
          } else {
            setCodeDisabled(false)
          }
        })
        .finally(() => {
          togglePageLoading()
        })
    }
  }, [pageType, id])

  const sortNumbersInStrings = (arr: string[]): string[] => {
    return arr.map((str) => {
      // 将字符串分割为数字数组
      const numbers = str.split(',').map(Number)
      // 按数字大小升序排序
      numbers.sort((a, b) => a - b)
      // 转换回字符串并返回
      return numbers.join(',')
    })
  }

  const sortNumber = (str: string): string => {
    // 将字符串分割为数字数组
    const numbers = str.split(',').map(Number)
    // 按数字大小升序排序
    numbers.sort((a, b) => a - b)
    // 转换回字符串并返回
    return numbers.join(',')
  }

  const getFinalNumber = (arr: string[], str: string) => {
    const item = arr.find((v) => sortNumber(v) === sortNumber(str))
    if (item) return item
    return str
  }

  useEffect(() => {
    if (specsDataSelectValue) {
      // 监听规格属性的值变化, 每次发生变化时重置sku信息
      validateSpecsAttr(formInstance, false).then((res) => {
        const attributeModels = transformAttr(res)
        const newAttributeSKU = new AttributeSKU(attributeModels)

        const isAddDiffSku =
          pageType === COMMODITY_PAGE_STATUS.EDIT &&
          newAttributeSKU.getSKUAttributeIds().length > extraDataRef.current.initAttributeList.length

        if (isAddDiffSku) {
          // 是否是新增规格属性的列数，例如A,B变为了A,B,C, 如果只是新增属性值则不会触发
          const newColumns = newAttributeSKU.generateSKUColumns(true)
          const oldColumns = specsAttributeSKU.current?.generateSKUColumns(true) || []
          specsAttributeSKU.current = new AttributeSKU(attributeModels)
          const newItem = newColumns.find((v) => {
            const result = oldColumns.find((old) => old.dataIndex[0] === v.dataIndex[0])
            return !result
          })
          const item = newItem?.filters?.[0]

          if (dataSource.length > 0) {
            const dataSourceRowKeys = dataSource.map((v) => v.getRowKey())
            const newList = newAttributeSKU.generateSKUData().map((v) => v.getRowKey())

            const newDataSourceRowKeys = dataSourceRowKeys.map((v) =>
              newList[0].length > v.length ? getFinalNumber(newList, `${v},${item?.value}`) : v,
            )
            setSpecsSelections(newDataSourceRowKeys)
          }

          setDataSource((dataSource) => {
            // 如果添加了一个规格设置中不存在的规格属性，那么会自动给这个规格列加上默认的数据，取第一条数据
            return dataSource.map((v) => {
              const id = newItem?.dataIndex[0]
              if (item && id) {
                const specsAttributeTableItem = new SpecsAttributeTableItem({
                  label: item.label,
                  value: item.value,
                  parentAttributeId: newItem?.dataIndex[0],
                })
                v.addResource(id, specsAttributeTableItem)
              }
              return v
            })
          })
          setColumns(newColumns)
        } else {
          specsAttributeSKU.current = new AttributeSKU(attributeModels)

          const specsSettingColumns = specsAttributeSKU.current?.generateSKUColumns(true) || []

          /**
           * 可选的所有规格列表
           */
          const specsSettingData = specsAttributeSKU.current?.generateSKUData()
          setDataSource((dataSource) => {
            const rowKeys = specsSettingData?.map((data) => data.getRowKey())
            return dataSource.filter((v) => rowKeys?.includes(v.getRowKey()))
          })
          setColumns(specsSettingColumns)
        }
      })
    }
  }, [specsDataSelectValue, formInstance, pageType])

  const handleChangeDataSource = (selected?: any[]) => {
    const dispatchSelected = selected || specsSelections
    const allSpecsAttributeSKU = specsAttributeSKU.current?.generateSKUData()
    /**
     * 先获取总的sku组合
     * 判断已经选择过的应该选用dataSource中的数据（因为表格中存在输入类型的输入框，如果直接用总的sku，会导致数据被重置）
     * 没有选择过的，则从总的sku (allSpecsAttributeSKU) 里面获取
     */
    const targetDataSource = allSpecsAttributeSKU?.filter((v) => dispatchSelected.includes(v.getRowKey()))
    if (targetDataSource) {
      setDataSource((prevDataSource) => {
        return targetDataSource.map((target) => {
          const targetKey = target.getRowKey()
          const prevItem = prevDataSource.find((v) => v.getRowKey() === targetKey)
          // 是原dataSource已经存在的值，优先使用dataSource中的
          if (prevItem) {
            return prevItem
          } else {
            return target
          }
        })
      })
    }
  }

  const fetchCustomerAttributeValueListById = async (customerAttributeId: string) => {
    try {
      const res = await getProductCustomerGetCustomerAttributeValueList({
        current: '1',
        pageSize: '199',
        customerAttributeId,
      })
      if (res.code === 1000 && res.data) {
        return res.data.data
      }
      return []
    } catch (error) {
      return []
    }
  }

  /**
   * 专门处理商品是处于审核通过，并且还想修改的情况
   */
  const handleCheckPass = async (data: GetProductCommodityGetCommodityResponse) => {
    // 单规格商品逻辑判断
    if (data.commoditySkuList?.length === 1 && data.commoditySkuList?.[0]?.commoditySkuAttributeList?.length === 0) {
      toggleSingleSpecs(true)
    } else {
      toggleSingleSpecs(false)
    }
    // 类目属性
    const commodityAttributeList: any[] = []

    for (const item of data?.commodityAttributeList || []) {
      const temp = {
        name: item.customerAttribute.name,
        value: item.customerAttribute.name,
        id: item.customerAttribute.id,
        type: item.customerAttribute.type,
        isMust: false,
        isPrice: false,
        customerAttributeValueList: item.customerAttributeValueList,
      }

      if (item.customerAttribute.id && item.customerAttribute.type !== 3) {
        const list = await fetchCustomerAttributeValueListById(String(item.customerAttribute.id))
        if (list && list.length > 0) {
          temp.customerAttributeValueList = list
        }
      }

      commodityAttributeList.push(temp)
    }

    const defaultCommoditySkuAttributeList = data.commoditySkuList
      .reduce((prev, next) => {
        next.commoditySkuAttributeList.forEach((sku) => {
          const attrId = sku?.customerAttribute?.id
          const attrValueId = sku?.customerAttributeValue?.id
          if (attrId) {
            const attrTarget = prev.find((v) => v.customerAttribute.id === attrId)

            if (attrTarget) {
              const attrValueTarget = attrTarget.customerAttributeValueList.find((v) => v.id === attrValueId)
              if (attrValueTarget) {
              } else {
                // 这次遍历到的属性值不存在，则新增进去
                attrTarget.customerAttributeValueList.push(sku?.customerAttributeValue)
              }
            } else {
              const newObj: any = {}
              // 这次遍历到的属性不存在，则新增进去
              newObj.customerAttribute = sku?.customerAttribute
              newObj.customerAttributeValueList = [sku?.customerAttributeValue]
              prev.push(newObj)
            }
          }
        })
        return prev
      }, [] as any[])
      .map((v) => {
        return {
          name: v.customerAttribute.name,
          value: v.customerAttribute.name,
          id: v.customerAttribute.id,
          type: v.customerAttribute.type,
          isMust: false,
          isPrice: true,
          customerAttributeValueList: v.customerAttributeValueList,
        }
      })

    const newCommoditySkuAttributeList: any[] = []

    const skuAttributeList: any[] = []
    for (const child of data?.commoditySkuList || []) {
      if (child.commoditySkuAttributeList && child.commoditySkuAttributeList.length > 0) {
        for (const item of child.commoditySkuAttributeList) {
          if (!skuAttributeList.find((v) => v.customerAttribute.id === item.customerAttribute?.id)) {
            skuAttributeList.push({ customerAttribute: item.customerAttribute })
          }
        }
      }
    }

    for (const item of skuAttributeList) {
      const temp: any = {
        name: item.customerAttribute?.name,
        value: item.customerAttribute?.name,
        id: item.customerAttribute?.id,
        type: item.customerAttribute?.type,
        isMust: false,
        isPrice: true,
        customerAttributeValueList: [],
      }

      if (item.customerAttribute?.id && item.customerAttribute?.type !== 3) {
        const list = await fetchCustomerAttributeValueListById(String(item.customerAttribute.id))
        if (list && list.length > 0) {
          temp.customerAttributeValueList = list
        }
      }

      newCommoditySkuAttributeList.push(temp)
    }

    let commoditySkuAttributeList = defaultCommoditySkuAttributeList

    if (
      newCommoditySkuAttributeList.length > 0 &&
      newCommoditySkuAttributeList.some((v) => v.customerAttributeValueList && v.customerAttributeValueList.length > 0)
    ) {
      commoditySkuAttributeList = newCommoditySkuAttributeList
    }

    const dispatchList = [...commodityAttributeList, ...commoditySkuAttributeList]

    const attributeModels = dispatchList.map((v) => new AttributeModel(v as any))
    initAttribute(attributeModels)
  }

  /**
   * 将antdForm 收集到的表单数据转换
   * { 1: [1,2,3] } -> { AttributeModel }
   */
  const transformAttr = (target: Record<string, number[]>): AttributeModel[] => {
    const attributeModels = Object.keys(target)
      .map((attributeId) => {
        const selectedIds = target[attributeId]
        if (selectedIds && selectedIds.length > 0) {
          const attributeModel = attributeManager.findAttributeById(Number(attributeId))
          if (attributeModel) {
            attributeModel.setSelectedOptionsByIds(selectedIds)
            return attributeModel
          }
        }
      })
      .filter(Boolean) as AttributeModel[]

    return attributeModels
  }

  return {
    pageLoading,
    formInstance,
    getCategoryRun,
    getCategoryRefresh,
    specsSelections: specsSelections,
    setSpecsSelections,
    materialDataSource,
    setMaterialDataSource,
    extraDataRef,
    productOriginalData,
    // 重构后的属性
    categoryAttributeList: attributeManager.getAllCategoryAttribute(),
    specsAttributeList: attributeManager.getAllSpecsAttribute(),
    findAttributeModelById: attributeManager.findAttributeById.bind(attributeManager),

    specsSettingColumns: columns,
    setSpecsSettingColumns: setColumns,
    specsSettingDataSource: dataSource,
    setSpecsSettingDataSource: setDataSource,
    specsAttributeSKU,
    transformAttr,
    // 页面类型，分为新增，编辑，查看, add, edit, detail
    pageType,
    disabled: pageType === COMMODITY_PAGE_STATUS.DETAIL,
    // 只有编辑状态下才需要控制是否审核
    // 已提交审核的禁用状态
    checkDisabled: pageType === COMMODITY_PAGE_STATUS.DETAIL || (pageType === COMMODITY_PAGE_STATUS.EDIT && isChecked),
    // 未提交审核的禁用状态
    noCheckDisabled:
      pageType === COMMODITY_PAGE_STATUS.DETAIL || (pageType === COMMODITY_PAGE_STATUS.EDIT && !isChecked),
    isChecked: isChecked,
    handleChangeDataSource,
    codeDisabled,
    commodityType,
    handleCheckPass,
    toggleSingleSpecs,
    isSingleSpecs,
    productData,
  }
}

export type ProductFormContextProps = ReturnType<typeof initProductFormValue>

const ProductFormContext = createContext<ProductFormContextProps>({} as ProductFormContextProps)

export const useProductForm = () => {
  return useContext(ProductFormContext)
}

export const ProductFormProvider = ({ children, type }) => {
  const value = initProductFormValue(type)

  return <ProductFormContext.Provider value={value}>{children}</ProductFormContext.Provider>
}
