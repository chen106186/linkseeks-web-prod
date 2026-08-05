import { GetProductCommodityGetCommodityResponse } from '@apps/apis'
import { cloneDeep } from 'lodash'
import { SpecsAttributeTableItem, SpecsAttributeTableRow } from '../models/SpecsAttributeTableItem'
import { PriceDataModal } from '../models/PriceDispatch'
import {
  CATEGORY_ATTR_NAME_PREFIX,
  CATEGORY_ATTR_NAME_TEXT_PREFIX,
  PRICE_TYPE_ENUM,
  SPECS_ATTR_NAME_PREFIX,
  SPECS_ATTR_NAME_TEXT_PREFIX,
} from '../constants'
import { PRICE_TYPE } from '../hooks'

export interface detailTransformData extends Omit<GetProductCommodityGetCommodityResponse, 'customerCategoryId'> {
  customerCategoryId: string[]
  specsSettingDataSource: SpecsAttributeTableRow[]
  logistics: GetProductCommodityGetCommodityResponse['logistics'] & {
    sendAddressInfo: any
  }

  /**
   * 草稿状态下会出现该字段,用来回显之前选过的表单数据
   */
  formData: any

  // 是否含税，其实是当taxRate大于0时，就为true
  isTax: boolean
}
/**
 * 商品详情返回之后进行回显，需要进行一定的数据适配才能回显到表单中
 *
 * 注意这里如果涉及到状态的变化，应该在context文件中处理
 *
 * 只做数据转化，不做具体赋值
 */
export const detailTransform = (detailData: GetProductCommodityGetCommodityResponse): detailTransformData => {
  const dispatchData: detailTransformData = cloneDeep(detailData) as any

  // 基本信息转化
  dispatchData.customerCategoryId = dispatchData?.customerCategoryFullId?.split('.').map((v) => parseInt(v).toString())

  dispatchData.sellingPoint = dispatchData.sellingPoint || []
  // 销售模板
  if (dispatchData?.salesAreaTemplate?.id) {
    ;(dispatchData as any).salesAreaTemplateId = dispatchData?.salesAreaTemplate?.id
  }
  // 商品设置转化
  // 商品属性转化

  // 类目属性
  if (dispatchData.commodityAttributeList) {
    dispatchData[CATEGORY_ATTR_NAME_PREFIX] = dispatchData.commodityAttributeList.reduce((prev, next) => {
      if (next.customerAttribute) {
        // 该属性的id
        const attributeId = next.customerAttribute.id
        // 属性值的id，这里因为是多选，所以是一个数组
        const attributeValueIds = next.customerAttributeValueList.map((v) => v.id)

        if (attributeId) {
          if (attributeValueIds.every((v) => v)) {
            // 是单选或者多选
            prev[attributeId] = attributeValueIds
          } else {
            // 如果id都为空，说明这是输入属性
            prev[attributeId] = next.customerAttributeValueList?.[0].value
          }
        }
      }
      return prev
    }, {} as any)

    // 按名称显示的类目属性
    dispatchData[CATEGORY_ATTR_NAME_TEXT_PREFIX] = dispatchData.commodityAttributeList?.reduce((prev, next) => {
      if (next?.customerAttribute?.name) {
        prev[next.customerAttribute.name] = next.customerAttributeValueList.map((v) => v.value)
      }
      return prev
    }, {} as any)
  }

  const specsAttributeMaps: any = {}
  const specsAttributeTextMaps: any = {}
  // 首先处理一下规格属性，由于规格属性是不会储存在后端的，所以前端自行从内部sku列表提取出来进行回显

  // 规格设置
  dispatchData.specsSettingDataSource = dispatchData.commoditySkuList.map((v) => {
    const item = new SpecsAttributeTableRow()
    item.addResources(v)

    v.commoditySkuAttributeList.forEach((skuItem) => {
      const attributeId = skuItem.customerAttribute?.id
      const attributeName = skuItem.customerAttribute?.name
      const dataId = skuItem.id

      if (attributeId && attributeName) {
        const attributeValueItem = skuItem.customerAttributeValue
        item.addResource(
          attributeId,
          new SpecsAttributeTableItem({
            label: attributeValueItem?.value,
            value: attributeValueItem?.id,
            parentAttributeId: attributeId,
            id: dataId,
          }),
        )

        const mergeKey = attributeId + '-' + attributeName
        // 寻找id相同的项，组合成数据返回给规格属性回显
        if (specsAttributeMaps[attributeId] && Array.isArray(specsAttributeMaps[attributeId])) {
          if (specsAttributeMaps[attributeId].includes(skuItem.customerAttributeValue?.id)) {
            // 如果已经存在该id了，则不需要新增
          } else {
            specsAttributeMaps[attributeId].push(skuItem.customerAttributeValue?.id)
            specsAttributeTextMaps[mergeKey].push(skuItem.customerAttributeValue?.value)
          }
        } else {
          specsAttributeMaps[attributeId] = [skuItem.customerAttributeValue?.id]
          specsAttributeTextMaps[mergeKey] = [skuItem.customerAttributeValue?.value]
        }
      }
    })

    // 如果不是询价，则需要处理价格相关逻辑
    if (Number(dispatchData[PRICE_TYPE]) !== PRICE_TYPE_ENUM.INQUIRY_PRICE) {
      // 价格处理
      const unitPriceModal = new PriceDataModal()
      if (v.unitPrice) {
        unitPriceModal.initUnitPrice(v.unitPrice)
        unitPriceModal.initSubUnitPrice(v.unitPrice, v.priceRate)
        item.setUnitPrice(unitPriceModal)
      }
    }

    return item
  })
  // 商品详情
  dispatchData.commodityRemarkList = dispatchData.commodityRemarkList || []

  // 物流信息
  // 如果是草稿的回显，则会带上自定义字段sendAddressInfo
  if (!dispatchData.logistics) {
    dispatchData.logistics = {} as any
  }
  dispatchData.logistics.sendAddressInfo = dispatchData.logistics?.sendAddressInfo || cloneDeep(dispatchData.logistics)
  dispatchData.logistics.sendAddressInfo.id = dispatchData.logistics?.sendAddressInfo?.sendAddressId
  // 将遍历得到的map结构，返回给规格属性回显
  dispatchData[SPECS_ATTR_NAME_PREFIX] = specsAttributeMaps
  dispatchData[SPECS_ATTR_NAME_TEXT_PREFIX] = specsAttributeTextMaps

  // 是否含税
  dispatchData.isTax = Number(dispatchData.taxRate) > 0

  return dispatchData as unknown as detailTransformData
}
