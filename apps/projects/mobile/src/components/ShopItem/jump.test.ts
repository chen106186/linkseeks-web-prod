import { describe, expect, it } from 'vitest'
import { PRICE_TYPE_ENUM } from '../../constants/const/product'
import { getShopItemJumpMode, SHOP_ITEM_JUMP_MODE } from './jump'

describe('getShopItemJumpMode', () => {
  it('现货商品统一走补偿跳转', () => {
    expect(
      getShopItemJumpMode({
        id: 1,
        priceType: PRICE_TYPE_ENUM.SPOT,
        groupPurchase: false,
      }),
    ).toBe(SHOP_ITEM_JUMP_MODE.SPOT_BY_COMMODITY)

    expect(
      getShopItemJumpMode({
        id: 2,
        priceType: PRICE_TYPE_ENUM.SPOT,
        groupPurchase: true,
      }),
    ).toBe(SHOP_ITEM_JUMP_MODE.SPOT_BY_COMMODITY)
  })

  it('非现货拼团商品保持拼团详情跳转', () => {
    expect(
      getShopItemJumpMode({
        id: 3,
        priceType: PRICE_TYPE_ENUM.CONSULTING,
        groupPurchase: true,
      }),
    ).toBe(SHOP_ITEM_JUMP_MODE.GROUP_DETAIL)
  })

  it('普通非现货商品保持原详情跳转', () => {
    expect(
      getShopItemJumpMode({
        id: 4,
        priceType: PRICE_TYPE_ENUM.INTEGRAL,
        groupPurchase: false,
      }),
    ).toBe(SHOP_ITEM_JUMP_MODE.NORMAL_DETAIL)
  })
})
