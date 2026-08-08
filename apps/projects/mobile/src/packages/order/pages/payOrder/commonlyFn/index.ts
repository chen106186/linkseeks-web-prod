/**
 *x
 * @param shopMessage 进货单商品信息
 * @returns 进货单的总价格 总件数 总类数
 */
const fnGetAllType = (shopMessage: any) => {
  const allType = 0;
  const allNumber = 0;
  const allPrice = 0;
  return {
    allType,
    allNumber,
    allPrice,
  };
}

/**
 *x
 * @param shopMessage 进货单商品信息
 * @returns 进货单的总价格 总件数 总类数
 */
const fnGetShopMessagePrice = (shopMessage: any) => {
  let allPrice = 0;
  Object.keys(shopMessage).forEach((key:string) => {
    shopMessage[key].forEach((item:any) => {
      allPrice += item.count * item.newPrice;
    });
  })
  return allPrice;
}

export {
  fnGetAllType,
  fnGetShopMessagePrice,
};
