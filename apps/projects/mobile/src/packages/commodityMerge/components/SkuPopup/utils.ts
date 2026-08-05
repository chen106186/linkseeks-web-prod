/*
 * @Author: XieZhiXiong
 * @Date: 2021-10-30 15:26:13
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-10-30 15:32:41
 * @Description: 工具方法
 */
import { PRICE_TYPE_ENUM } from '@/constants/const/product'
import { GroupsItemType, SkuListItemType, SKU_KEY_PREFIX } from './index'

type AttributeListItemType = {
  /**
   * 组id
   */
  id: number
  /**
   * 组名相关
   */
  customerAttribute: {
    /**
     * 组id
     */
    id: number
    /**
     * 组名
     */
    name: string
  }
  /**
   * 组项
   */
  customerAttributeValueList: {
    /**
     * 组子项id
     */
    id: number
    /**
     * 组子项名称
     */
    value: string
  }[]
}

type UnitPricePicListItemType = {
  /**
   * 对应的规格
   */
  commoditySkuAttributeList: {
    /**
     * 组信息
     */
    customerAttribute: {
      /**
       * 组id
       */
      id: number
      /**
       * 组名
       */
      name: string
    }
    /**
     * 规格
     */
    customerAttributeValue: {
      /**
       * 规格id
       */
      id: number
      /**
       * 规格名称
       */
      value: string
    }
  }[]
  /**
   * 规格图片?
   */
  commodityPic: string[]
  /**
   * 会员商品skuId(用于渠道商品查询库存)?
   */
  skuId?: number
  /**
   * skuId
   */
  id: number
  /**
   * 库存
   */
  stockCount: number
  /**
   * 阶梯价格
   */
  unitPrice: { [key: string]: number }
  /**
   * 副单位单价换算比率
   */
  priceRate: number
}

/**
 * 格式化规格值数据
 * @param skuList 商品详情接口返回的sku数据
 * @returns SkuPopup组件 需要规格值
 */
export function normalizeSpecGroups(skuList: UnitPricePicListItemType[]): GroupsItemType[] {
  const groups: GroupsItemType[] = []

  if (!Array.isArray(skuList)) {
    return groups
  }
  skuList.forEach((item) => {
    item.commoditySkuAttributeList.forEach((specItem) => {
      let groupItem = groups.find((group) => group.specId === specItem.customerAttribute?.id)
      if (!groupItem) {
        groupItem = {
          specId: specItem.customerAttribute?.id as number,
          skuKey: `${SKU_KEY_PREFIX}${specItem.customerAttribute.id}`,
          title: specItem.customerAttribute.name,
          items: [],
        }
        groups.push(groupItem)
      }
      if (!groupItem.items.find((valueItem) => valueItem.id === specItem.customerAttributeValue?.id)) {
        groupItem.items.push({
          id: specItem.customerAttributeValue?.id || 0,
          name: specItem.customerAttributeValue?.value || '',
          img: item.commodityPic[0] || '',
        })
      }
    })
  })
  return groups
}

export type LadderItemType = {
  /**
   * 数据id，遍历用
   */
  id: string
  /**
   * 阶梯价格
   */
  price: number
  /**
   * 起始值
   */
  star: number
  /**
   * 结束值
   */
  end: number
}

export type ProductSkuType = {
  /**
   * 阶梯价格
   */
  ladderPrice: number
  /**
   * 折合价格
   */
  aboutPrice: number
  /**
   * 阶梯
   */
  ladder: LadderItemType[]
  /**
   * 当前所在阶梯价格区间
   */
  active: number
  /**
   * 会员商品skuId(用于渠道商品查询库存)
   */
  commodityUnitPriceAndPicId: number
  commoditySkuAttributeList: any[]
  code: string
} & SkuListItemType

/**
 * 格式化业务sku数据
 * @param skuList 商品详情接口返回的sku数据
 * @param minOrder 最小起订量
 * @returns SkuPopup所需 sku列表 数据
 */
export function normalizeSpecSkuList(
  skuList: UnitPricePicListItemType[],
  minOrder: number,
  priceType: number,
): ProductSkuType[] {
  const ret: ProductSkuType[] = []

  if (!Array.isArray(skuList)) {
    return ret
  }

  skuList.forEach((item) => {
    const skuItem: ProductSkuType = {
      skuId: item.id,
      price: 0,
      stockNum: priceType === PRICE_TYPE_ENUM.CONSULTING ? undefined : item.stockCount,
      img: item.commodityPic && item.commodityPic.length > 0 ? item.commodityPic[0] : '',
      commodityUnitPriceAndPicId: item.skuId as number,
      ladderPrice: 0,
      aboutPrice: 0,
      ladder: [],
      quantity: minOrder || 1, // 默认给最小起订量
      active: 0,
      specNames: [],
      code: item.code,
      commoditySkuAttributeList: item.commoditySkuAttributeList || [],
    }

    // 处理规格对应的skuKey
    item.commoditySkuAttributeList.forEach((attributeItem) => {
      skuItem[`${SKU_KEY_PREFIX}${attributeItem.customerAttribute.id}`] = attributeItem.customerAttributeValue.id
      // 这数据的顺序 跟 sku的数据的顺序对不上？？插个眼
      skuItem.specNames.push(attributeItem.customerAttributeValue.value)
    })

    // 处理阶梯价格
    const unitPrice = item.unitPrice || {} // 可能不存在...
    // 获取 keys 并对 起始价从小到大的排序
    const objKeys = Object.keys(unitPrice).sort((a, b) => parseFloat(a) - parseFloat(b))
    let min: number = objKeys.length ? unitPrice[objKeys[0]] : 0

    objKeys.forEach((key) => {
      // “-” 分割 起始价 跟 结束价
      const section = key.split('-')
      const value = unitPrice[key]

      const star = section[0] ? +section[0] : 0
      const end = section[1] ? +section[1] : 0

      const ladderItem: LadderItemType = {
        id: key,
        price: value,
        star,
        end,
      }

      // 赋值阶梯价格中的最低价
      if (value < min) {
        min = value
      }

      skuItem.ladder.push(ladderItem)
    })
    // 阶梯价格可能不存在，eg. 询价商品
    if (skuItem.ladder.length) {
      // 初始 active
      // 如果 找不到 active，说明当前数量超过了已有的价格区间，取最后一个价格区间为准
      // 当然这样不够严谨，如果数量小于 0 的话就不适用了
      // 但是当前场景不会出现 数量小于 0 的情况
      const current = skuItem.ladder.findIndex(
        (ladderItem, index) =>
          (skuItem.quantity >= ladderItem.star && skuItem.quantity <= ladderItem.end) ||
          (skuItem.ladder[index + 1] &&
            skuItem.quantity > ladderItem.end &&
            skuItem.quantity < skuItem.ladder[index + 1].star),
      )
      // eslint-disable-next-line no-nested-ternary
      const active = skuItem.quantity > 0 ? (current !== -1 ? current : skuItem.ladder.length - 1) : 0
      skuItem.active = active
      skuItem.ladderPrice = skuItem.quantity > 0 ? skuItem.ladder[active].price : min // 如果 quantity  大于 0，ladderPrice 取当前阶梯的价格
      skuItem.price = min
      skuItem.aboutPrice = item.priceRate ? +(min * (item.priceRate / 100)).toFixed(2) : 0
    }
    ret.push(skuItem)
  })
  return ret
}
