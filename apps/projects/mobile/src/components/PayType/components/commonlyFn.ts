/**
 * 初始化支付方式
 */
const initPayType = (payTypeListPar: any) => {
  const obj: any = {}
  payTypeListPar.forEach((item: any) => {
    if (item.payType === 3) {
      // 去掉授信支付
      return
    }
    if (obj[item.payType]) {
      obj[item.payType].payChannels.push(item)
    } else {
      obj[item.payType] = {
        payTypeName: item.payTypeName,
        payChannels: [item],
      }
    }
  })
  const arrDesc = Object.values(obj)
  return arrDesc
}

/**
 *x
 * @param shopMessage 购物车商品信息
 * @returns 购物车的总价格 总件数 总类数
 */
const fnGetShopMessagePrice = (shopMessage: any) => {
  let allPrice = 0
  Object.keys(shopMessage).forEach((key: string) => {
    shopMessage[key].forEach((item: any) => {
      allPrice += item.count * item.newPrice
    })
  })
  return allPrice
}
/**
 * @param item 当前商品
 * @returns 返回当前价格
 */
const fnGetNewPrice = (item: any) => {
  const { newPrice } = item
  return newPrice
}
export { initPayType, fnGetShopMessagePrice, fnGetNewPrice }
