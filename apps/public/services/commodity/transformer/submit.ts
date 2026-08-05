import { cloneDeep } from 'lodash'
import { FlowDispatch } from '../FlowDispatch'
import { ProductFormContextProps, useProductForm } from '../context'
import { CATEGORY_ATTR_NAME_PREFIX, PRICE_TYPE_ENUM, SPECS_ATTR_NAME_PREFIX } from '../constants'
import { message } from '@linkseeks/ui'
import { PRICE_TYPE } from '../hooks'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()
/**
 * 提交时的参数转换
 * 这里会在提交前做数据的转变，以及补充一些默认值和删除字段等
 */
export const submitTransform = async (formValue: any, state: ProductFormContextProps, isDraft = false) => {
  // 复制一份出来，为了不改变到原有数据
  const dispatchData = cloneDeep(formValue)
  const flowDispatch = new FlowDispatch(dispatchData)

  // 对基本信息进行数据转化
  const basicTransform = (payload) => {
    // 商品品类只需要传最后一节
    if (Array.isArray(payload.customerCategoryId)) {
      if (isDraft) {
        // 如果是草稿类型，需前端自行补充字段
        payload.customerCategoryFullId = payload.customerCategoryId.join('.')
        dispatchData.customerCategoryFullId = payload.customerCategoryFullId

        if (state.extraDataRef.current.categoryFullName) {
          payload.customerCategoryFullName = state.extraDataRef.current.categoryFullName
          dispatchData.customerCategoryFullName = payload.customerCategoryFullName
        }
      } else {
        payload.customerCategoryId = Number(payload.customerCategoryId[payload.customerCategoryId.length - 1])
      }
    }
    // 选择了运费模板，useTemplate传true
    if (payload.logistics.templateId) {
      payload.logistics.useTemplate = true
    }

    if (isDraft && state.extraDataRef.current.brandName) {
      // 草稿的品牌名 需自己赋值
      payload.brandName = state.extraDataRef.current.brandName
      dispatchData.brandName = payload.brandName
    }
    if ([1, 2].includes(dispatchData.adoptionType)) {
      dispatchData.adoption = {
        adoptionType: dispatchData.adoptionType,
        partner: dispatchData.adoptionPartner,
        traceUrl: dispatchData.adoptionTraceUrl,
        certificatePic: dispatchData.adoptionCertificatePic,
        agreementId: dispatchData.adoptionAgreementId,
      }
    }
    return payload
  }

  // 对商品信息进行数据转化
  const productTransform = (payload) => {
    // 最小起订，数值最少也是1
    payload.minOrder = Number(payload.minOrder) || 1

    if (isDraft) {
      // 草稿的单位名 需自己赋值
      if (state.extraDataRef.current.unitName) {
        payload.unitName = state.extraDataRef.current.unitName
        dispatchData.unitName = payload.unitName
      }
    }
    return payload
  }

  // 对商品属性, 规格设置进行数据转化
  const attributeTransform = (payload) => {
    // 类目属性
    if (payload[CATEGORY_ATTR_NAME_PREFIX]) {
      payload.commodityAttributeList = Object.keys(payload[CATEGORY_ATTR_NAME_PREFIX])
        .filter((key) => !!payload[CATEGORY_ATTR_NAME_PREFIX][key])
        .map((attributeId) => {
          const value = payload[CATEGORY_ATTR_NAME_PREFIX][attributeId]
          if (isDraft) {
            if (typeof value !== 'string') {
              const customerAttributeValueList = Array.isArray(value) ? value : [value]
              return {
                customerAttribute: {
                  id: attributeId,
                },
                customerAttributeValueList: customerAttributeValueList.map((v) => ({
                  id: v,
                })),
              }
            } else {
              return {
                customerAttribute: {
                  id: attributeId,
                },
                customerAttributeValueList: [
                  {
                    id: null,
                    value,
                  },
                ],
              }
            }
          } else {
            if (typeof value !== 'string') {
              // 是单选或者多选
              return {
                customerAttributeId: attributeId,
                customerAttributeValueId: Array.isArray(value) ? value : [value],
              }
            } else {
              return {
                customerAttributeId: attributeId,
                // 输入属性，使用输入值
                customerAttributeValueName: value,
              }
            }
          }
        })
    }
    // 规格属性
    if (state.specsSettingDataSource && Array.isArray(state.specsSettingDataSource)) {
      payload.commoditySkuList = state.specsSettingDataSource.map((v) => {
        if (isDraft) {
          // 如果是草稿状态下，可能之前是从编辑其他商品来的，已经有id的，这里需要删除
          v.id && delete v.id
        }
        const specsAttribute = v.getSpecsAttribute()
        const commoditySkuAttributeList: any[] = []
        Object.keys(specsAttribute).forEach((attributeId) => {
          if (isDraft) {
            const attribute = state.specsAttributeList.find((v) => Number(v.id) === Number(attributeId))
            if (attribute) {
              commoditySkuAttributeList.push({
                customerAttribute: {
                  id: attributeId,
                  name: attribute.name,
                },
                customerAttributeValue: {
                  id: v[attributeId].value,
                  value: v[attributeId].label,
                },
              })
            }
          } else {
            commoditySkuAttributeList.push(
              v?.[attributeId]?.id
                ? {
                    customerAttributeId: attributeId,
                    customerAttributeValueId: v[attributeId].value,
                    id: v[attributeId].id,
                  }
                : {
                    customerAttributeId: attributeId,
                    customerAttributeValueId: v[attributeId].value,
                  },
            )
          }
        })

        const priceObj: any = {}
        // 如果是询价类型，则不需要价格字段
        if (payload[PRICE_TYPE] !== PRICE_TYPE_ENUM.INQUIRY_PRICE) {
          if (isDraft) {
            if (v.priceRate) {
              priceObj.priceRate = v.priceRate
            }

            if (v.unitPrice) {
              priceObj.unitPrice = v.unitPrice.isStep ? v.unitPrice.outputStepPrice() : v.unitPrice.outputPrice()
            }
          } else {
            if (!v.unitPrice) {
              message.error(translate('web.resource.commodity.guigeshuxingtishi2'))
              throw '请检查规格设置中，是否存在商品价格未设置'
            }
            if (v.unitPrice.isStep) {
              // 如果是阶梯价
              // 需要判断阶梯价最小数量是否大于等于最小起订

              const [firstStep] = v.unitPrice.getStepPrice()

              if (Number(firstStep.numberMin) < Number(payload.minOrder)) {
                message.error(translate('web.resource.commodity.guigeshuxingtishi3'))
                throw '规格设置中阶梯最小数量应大于等于最小起订，请检查'
              }
            }
            priceObj.priceRate = v.priceRate
            priceObj.unitPrice = v.unitPrice.isStep ? v.unitPrice.outputStepPrice() : v.unitPrice.outputPrice()
          }
        }

        return {
          id: v.id,
          commodityPic: v?.commodityPic?.filter(Boolean)?.map((com: any) => {
            // 兼容组件对象
            if (typeof com === 'object') {
              return com.url
            } else {
              return com
            }
          }),
          materielId: v.materielId,
          hsCode: v.hsCode,
          commoditySkuAttributeList,
          code: v.code ? v.code : undefined,
          ...priceObj,
        }
      })
    }

    // 如果是草稿下，有可能只选择了规格属性，而没有配置规格设置，所以需要存一份
    if (isDraft) {
      payload.formData = dispatchData
    }
    return payload
  }

  const productDetailTransform = (payload) => {
    payload.commodityRemarkList = payload.commodityRemarkList.map((v) => {
      delete v.id
      return v
    })
  }

  const logisticInfo = (payload) => {
    if (payload.logistics) {
      if (isDraft) {
        payload.logistics = {
          ...payload.logistics.sendAddressInfo,
          ...payload.logistics,
          sendAddressId: payload.logistics.sendAddressInfo?.sendAddressId || payload.logistics.sendAddressInfo?.id,
        }
      } else {
        payload.logistics = {
          deliveryType: payload.logistics.deliveryType,
          carriageType: payload.logistics.carriageType,
          weight: payload.logistics.weight,
          companyId: payload.logistics.companyId,
          useTemplate: payload.logistics.useTemplate,
          templateId: payload.logistics.templateId,
          // 整个物流信息id
          id: payload.logistics?.id,
          // 选择的地址信息id
          sendAddressId: payload.logistics.sendAddressInfo?.id,
        }
      }
    }
  }
  flowDispatch.register([
    { name: 'basic', action: basicTransform, desc: '基本信息' },
    { name: 'product', action: productTransform, desc: '商品信息' },
    { name: 'attribute', action: attributeTransform, desc: '商品属性' },
    { name: 'productDetail', action: productDetailTransform, desc: '商品详情' },
    { name: 'logisticInfo', action: logisticInfo, desc: '物流信息' },
  ])

  const target = await flowDispatch.start()
  const result = {
    ...dispatchData,
    // 开始对原有数据进行覆盖
    ...target,
  }

  // 移除那些不需要的字段
  delete result[CATEGORY_ATTR_NAME_PREFIX]
  delete result[SPECS_ATTR_NAME_PREFIX]

  // 如果没有值则不传该参数
  if (!result.code) {
    delete result.code
  }
  // 基本信息
  return result
}
