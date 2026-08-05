import { action, makeObservable, observable, runInAction } from 'mobx'
import { IS_WEB } from '@/constants'
import { SHOP_MESSAGE_STORE } from '@/constants/storage'
import { Toast } from '@apps/mobile-ui'
import { setAsyncStorage, getAsyncStorage, removeAsyncStorage } from '@apps/mobile-services/utils/storage'
import Router from '@/utils/router'
import { getIntl } from '@linkseeks/i18n'
import { PurchaseOrderStoreModel } from './model'
import { PurchaseOrderType, orderItemType } from '../confirmOrderStore/model'
import { RootStoreModel } from '../rootStore/model'

type groupDataResType = {
  groupData: PurchaseOrderType
  allKeys: string[]
}

/**
 * 根据 店铺id 分组， 以下list 写的any 都需要做修改，时间问题，往后修改
 * @param list
 */
const groupByShop = (list: orderItemType[]): groupDataResType => {
  const res: PurchaseOrderType = {}
  const allKeys: string[] = [] // 获取所有的key。 为外层全选做准备
  for (let i = 0; i < list.length; i += 1) {
    const listItem = list[i]
    const { commodity } = listItem.commodityUnitPrice
    const { storeId, memberName, mainPic, id, name, brand, logistics, memberId, memberRoleId, priceType } =
      commodity as orderItemType['commodityUnitPrice']['commodity'] as any
    if (typeof res[`store-${storeId}`] === 'undefined') {
      res[`store-${storeId}`] = {
        storeName: memberName,
        storeId,
        mainPic: brand?.logoUrl,
        memberId,
        memberRoleId,
        dataIndex: (storeId && storeId.toString()) || 0,
        products: {},
        total: 0,
        productCount: 0,
      }
    }
    const current = res[`store-${storeId}`]
    const hasCommodity = typeof current.products[`commodity-${id}`] !== 'undefined'
    if (!hasCommodity) {
      current.products[`commodity-${id}`] = {
        id,
        name,
        logistics,
        memberParameter: null,
        dataIndex: `${storeId}-${id}`,
        commodityLogo: mainPic,
        orderList: [],
        priceType,
        stockCount: listItem.stockCount,
        isPublish: listItem.isPublish,
        commodityUnitPriceAndPicId: listItem.commodityUnitPrice.commodityUnitPriceAndPicId,
        channelCommodityId: listItem.channelCommodityId,
      }
    }
    // current.products[`commodity-${id}`].orderList.push({ ...listItem, dataIndex: `${storeId}-${id}-${listItem.commodityUnitPrice.id}` });
    // current.products[`commodity-${id}`]['dataIndex'] = `${storeId}-${id}-${listItem.commodityUnitPrice.id}`;
    if (priceType === 1) {
      allKeys.push((storeId && storeId.toString()) || 0)
      allKeys.push(`${storeId}-${id}`)
      allKeys.push(`${storeId}-${id}-${listItem.commodityUnitPrice.id}`)
    }
  }

  return {
    groupData: res,
    allKeys: Array.from(new Set(allKeys)),
  }
}
/**
 * 获取当前店铺是否拥有会员价格，如果有，那么请求接口 使用 Promise.all
 * @param list
 */
const getMemberPrice = (list: any) => {
  const res: any = {}
  for (let i = 0; i < list.length; i += 1) {
    const listItem = list[i]
    const {
      commodity: { isMemberPrice, memberId, memberRoleId, storeId, id },
    } = listItem.commodityUnitPrice
    if (isMemberPrice && typeof res[`store-${storeId}-commodity-${id}`] === 'undefined') {
      res[`store-${storeId}-commodity-${id}`] = {
        parentMemberId: memberId,
        parentMemberRoleId: memberRoleId,
      }
    }
  }
  return res
}

/**
 * 计算在店铺下的商品价格总数
 * 这层代码有点恶心，因为把店铺分组， 商品分组， sku 在最底下 所以要三层循环
 */
const _calcUnderShopCommodityPrice = (data: any) => {
  const keys = Object.keys(data)
  keys.forEach((_item) => {
    let total = 0
    let productCount = 0
    const { products } = data[_item]
    Object.keys(products).forEach((_row) => {
      const { orderList, memberParameter } = products[_row]
      orderList.forEach((element: any) => {
        const {
          count,
          commodityUnitPrice: {
            unitPrice,
            commodity: { isMemberPrice, priceType },
          },
        } = element
        // 类型为2的时候为询价单
        if (priceType === 2) {
          // eslint-disable-next-line no-param-reassign
          element.showPrice = 0
          total += 0
          productCount += count
          return
        }
        // 根据当前count 去阶梯价格
        const stepPriceKeys = Object.keys(unitPrice).sort((a, b) => parseFloat(a) - parseFloat(b))
        const minData: number = unitPrice[stepPriceKeys[0]]
        let targetValue: number = minData
        for (let i = 0; i < stepPriceKeys.length; i += 1) {
          const [start, end] = stepPriceKeys[i].split('-')
          if (i === stepPriceKeys.length - 1 && count >= end) {
            targetValue = unitPrice[stepPriceKeys[i]]
            break
          }
          if (count >= start && count <= end) {
            targetValue = unitPrice[stepPriceKeys[i]]
            break
          }
        }
        // 显示的价格 要是有成员价就 targetValye * 会员参数
        // eslint-disable-next-line no-param-reassign
        element.showPrice = isMemberPrice && memberParameter !== null ? targetValue * memberParameter : targetValue
        // eslint-disable-next-line no-param-reassign
        element.commodityPrice = targetValue
        total += isMemberPrice && memberParameter !== null ? targetValue * memberParameter * count : targetValue * count
        productCount += count
      })
    })
    // 同一商品下的总价格与总件数
    // eslint-disable-next-line no-param-reassign
    data[_item].total = +total > 0.01 ? total.toFixed(2) : total.toFixed(3)
    // eslint-disable-next-line no-param-reassign
    data[_item].productCount = productCount
  })
  return data
}

/**
 * arrayToMap 数组转化成字典
 */
function arrayToMap(list: any[], key: string) {
  const result: any = {}
  list.forEach((_row) => {
    result[_row[key]] = _row
  })
  return result
}

export default class PurchaseOrderStore implements PurchaseOrderStoreModel {
  private rootStore: RootStoreModel

  purchaseList: PurchaseOrderType | null = null

  // 直接下单
  buyNowList: PurchaseOrderType | null = null

  loading: boolean = false

  checkedKeys: string[] = []

  /**
   * 除了PriceType === 2，即询价单的商品以外的所有的dataIndex 的集合， 表示方式为 ${storeid}-${commodityId}-${orderId}
   * 例子 1-2-3
   */
  allKeys: string[] = []

  /**
   * 是否全选，这里直接判断 checkedkye === allKeys 就可以了
   */
  isCheckedAll: boolean = false

  /**
   * 货物总价
   */
  checkTotal: number | string = 0

  /**
   * 发货件数
   */
  checkedProductCount: number = 0

  /**
   * 原始的purchaseList, 这里需要用到原始列表，当某个商品删除的时候重新生成purchaseList
   */
  sourcePurchaseList: any[] = []

  /**
   * 会员参数，会员参数与上面的sourcePurchaseList 重新生成purchaseList
   */
  memberPriceMap: any = {}

  expandedKeys: string[] = []

  isExpandedAll: boolean = false

  /**
   * 购物车商品
   */
  shopMessageStore: any = {}

  constructor(rootStore: RootStoreModel) {
    makeObservable(this, {
      purchaseList: observable,
      loading: observable,
      checkedKeys: observable,
      checkTotal: observable,
      allKeys: observable,
      sourcePurchaseList: observable,
      isCheckedAll: observable,
      checkedProductCount: observable,
      expandedKeys: observable,
      isExpandedAll: observable,
      setExpandedKeys: action.bound,
      setCheckedKeys: action.bound,
      setIsExpandedAll: action.bound,
      setShopMessageStore: action.bound,
      changeOrderCount: action.bound,
      checkedAll: action.bound,
      generatePurchaseList: action.bound,
      clearCheckedKeys: action.bound,
      initStockOrder: action.bound,
      // shouldNotRefresh: observable,
      // setShouldNotRefresh: action.bound,
    })
    this.rootStore = rootStore
  }

  setCheckedKeys(target: string, children: string[], checked: boolean) {
    const keys = this.checkedKeys
    const splitData = target.split('-')
    const { length } = splitData
    if (checked) {
      const temp = [target, ...keys, ...children]
      // 检查父亲是否应该勾选,如果儿子全部勾选了，那么父亲应该也要勾选
      if (length > 2) {
        const orderLength = (this.purchaseList as PurchaseOrderType)[`store-${splitData[0]}`].products[
          `commodity-${splitData[1]}`
        ].orderList.length
        const parentKey = splitData.slice(0, 2).join('-') // 3-2
        const reg = new RegExp(`${parentKey}-\\d+$`)
        const childrenLength = temp.filter((item) => reg.test(item)).length
        if (orderLength === childrenLength) {
          temp.push(parentKey)
        }
      }
      if (length > 1) {
        const productLength = Object.keys(
          (this.purchaseList as PurchaseOrderType)[`store-${splitData[0]}`].products,
        ).length
        const tempKey = splitData.slice(0, 1).join('-')
        const reg = new RegExp(`${tempKey}-\\d+$`)
        const childrenLength = temp.filter((item) => reg.test(item)).length
        if (productLength === childrenLength) {
          temp.push(tempKey)
        }
      }
      this.checkedKeys = Array.from(new Set(temp))
    } else {
      // 去除他的parent
      const parents = []
      if (length > 1) {
        for (let i = length - 1; i > 0; i -= 1) {
          parents.push(splitData.slice(0, i).join('-'))
        }
      }
      const uncheckeList = [target, ...children, ...parents]

      this.checkedKeys = Array.from(new Set(keys.filter((item) => !uncheckeList.includes(item))))
      // this.total -= count * price
    }
    const { productTotal, productCount } = this.getCheckTotal()
    this.checkTotal = productTotal
    this.checkedProductCount = productCount
    this.isCheckedAll = this.checkedKeys.length === this.allKeys.length
  }

  /**
   * 时间问题，没有单独跟上面的方法抽离出来，先这样写，往后改
   */
  getCheckTotal() {
    const checkedKeylist = this.checkedKeys.filter((_item: string) => /\d+-\d+-\d/.test(_item))
    const data = this.purchaseList as any
    const keys = Object.keys(data)
    let total = 0
    let productCount = 0
    keys.forEach((_item) => {
      const { products } = data[_item]
      Object.keys(products).forEach((_row) => {
        const { orderList, memberParameter } = products[_row]
        orderList.forEach((element: any) => {
          const {
            count,
            dataIndex,
            commodityUnitPrice: {
              unitPrice,
              commodity: { isMemberPrice },
            },
          } = element
          if (!checkedKeylist.includes(dataIndex)) {
            return
          }
          productCount += count
          // 根据当前count 去阶梯价格
          const stepPriceKeys = Object.keys(unitPrice).sort((a, b) => parseFloat(a) - parseFloat(b))
          const minData: number = unitPrice[stepPriceKeys[0]]
          let targetValue: number = minData
          for (let i = 0; i < stepPriceKeys.length; i += 1) {
            const [start, end] = stepPriceKeys[i].split('-')
            if (i === stepPriceKeys.length - 1 && count >= end) {
              targetValue = unitPrice[stepPriceKeys[i]]
              break
            }
            if (count > start && count < end) {
              targetValue = unitPrice[stepPriceKeys[i]]
              break
            }
          }
          total +=
            isMemberPrice && memberParameter !== null ? targetValue * memberParameter * count : targetValue * count
        })
      })
    })
    return {
      productTotal: total > 0.01 ? total.toFixed(2) : total.toFixed(3),
      productCount,
    }
  }

  changeOrderCount(key: string, count: number) {
    const [storeId, shopId, orderId] = key.split('-')
    const list = this.purchaseList as PurchaseOrderType
    const { orderList } = list[`store-${storeId}`].products[`commodity-${shopId}`]
    const index = orderList.findIndex((item: any) => item.commodityUnitPrice.id.toString() === orderId)

    if (index > -1) {
      orderList[index] = {
        ...orderList[index],
        count,
      }
    }
    const newList = { ...list }
    this.purchaseList = _calcUnderShopCommodityPrice(newList)
    // this.checkTotal = this.getCheckTotal()
    const { productTotal, productCount } = this.getCheckTotal()
    this.checkTotal = productTotal
    this.checkedProductCount = productCount
  }

  /**
   * 全选
   */
  checkedAll() {
    if (this.isCheckedAll) {
      this.checkedKeys = []
      this.isCheckedAll = false
      this.checkTotal = 0
      return
    }
    this.checkedKeys = this.allKeys
    this.isCheckedAll = true
    const { productTotal, productCount } = this.getCheckTotal()
    this.checkTotal = productTotal
    this.checkedProductCount = productCount
  }

  /**
   * 重新生成Purchaselist
   */
  generatePurchaseList(ids: string[]) {
    const { sourcePurchaseList, memberPriceMap } = this
    const newList = sourcePurchaseList.filter((item) => !ids.includes(item.id.toString()))
    const { groupData, allKeys } = groupByShop(newList)
    const memberPrice = Object.keys(memberPriceMap)
    memberPrice.forEach((_row) => {
      const [, storeId, , commodityId] = _row.split('-')
      const parameter = memberPriceMap[_row]
      const storeTarget = groupData[`store-${storeId}`]
      if (typeof storeTarget === 'undefined') {
        return
      }
      const commodityTarget = storeTarget.products[`commodity-${commodityId}`]
      if (typeof commodityTarget === 'undefined') {
        return
      }
      storeTarget.products[`commodity-${commodityId}`] = {
        ...commodityTarget,
        memberParameter: parameter,
      }
      memberPriceMap[_row] = parameter
      groupData[`store-${storeId}`] = {
        ...storeTarget,
        products: storeTarget.products,
      }
    })
    this.sourcePurchaseList = newList
    this.purchaseList = _calcUnderShopCommodityPrice(groupData)
    this.allKeys = allKeys
    // 去除所有多余的checkedKeys
    const checkeds = this.checkedKeys.filter((_item) => allKeys.includes(_item))
    this.checkedKeys = checkeds
    const { productTotal, productCount } = this.getCheckTotal()
    this.checkTotal = productTotal
    this.checkedProductCount = productCount
    this.isCheckedAll = this.checkedKeys.length > 0 && this.checkedKeys.length === this.allKeys.length
  }

  /**
   * 当提交完购物车后清空checkedKeys
   */
  clearCheckedKeys() {
    this.checkedKeys = []
    this.isCheckedAll = false
    this.checkTotal = 0
  }

  // setShouldNotRefresh(flag: boolean) {
  //   this.shouldNotRefresh = flag;
  // }

  setExpandedKeys(dataIndex: string) {
    const newExpandedKeys = [...this.expandedKeys]
    if (newExpandedKeys.includes(dataIndex)) {
      this.expandedKeys = newExpandedKeys.filter((item) => item !== dataIndex)
    } else {
      newExpandedKeys.push(dataIndex)
      this.expandedKeys = newExpandedKeys
    }
  }

  /**
   * 从现货商品直接下单
   */
  initStockOrder(list: PurchaseOrderType, keys: string[], amount: number) {
    // this.purchaseList = list;
    this.buyNowList = list
    // this.checkedKeys = keys;
    // this.checkTotal = amount;
  }

  /** */

  setIsExpandedAll(toggle: boolean) {
    this.isExpandedAll = toggle
    if (toggle) {
      this.expandedKeys = this.checkedKeys.filter((_row) => /\d+-\d+-\d/.test(_row))
    } else {
      this.expandedKeys = []
    }
  }

  setShopMessageStore(message: any) {
    this.shopMessageStore = message
    if (IS_WEB) {
      const overdueTime = new Date().getTime() + 15 * 60 * 1000
      setAsyncStorage(SHOP_MESSAGE_STORE, { ...message, overdueTime })
    }
  }

  getShopMessageStore() {
    if (IS_WEB) {
      if (!!Object.keys(this.shopMessageStore).length) {
        return this.shopMessageStore
      } else {
        const shopMessageStoreStorage = getAsyncStorage(SHOP_MESSAGE_STORE)
        const nowTime = new Date().getTime()
        if (shopMessageStoreStorage && nowTime < shopMessageStoreStorage?.overdueTime) {
          const { overdueTime, ...rest } = shopMessageStoreStorage
          return rest
        } else {
          removeAsyncStorage(SHOP_MESSAGE_STORE)
          Toast.show({
            title: getIntl().formatMessage({ id: `order.info.expired`, defaultMessage: '订单信息已过期' }),
            icon: 'none',
          })
          setTimeout(() => {
            Router.navigateBack()
          }, 100)
          return {}
        }
      }
    } else {
      return this.shopMessageStore
    }
  }
}
