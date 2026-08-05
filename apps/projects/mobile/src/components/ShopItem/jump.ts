import { PRICE_TYPE_ENUM } from '../../constants/const/product'

export const SHOP_ITEM_JUMP_MODE = {
  SPOT_BY_COMMODITY: 'spot_by_commodity',
  GROUP_DETAIL: 'group_detail',
  NORMAL_DETAIL: 'normal_detail',
} as const

type ShopItemJumpMode = (typeof SHOP_ITEM_JUMP_MODE)[keyof typeof SHOP_ITEM_JUMP_MODE]

type ShopItemCommodity = {
  id: number
  priceType?: number
  groupPurchase?: boolean
}

export const getShopItemJumpMode = (productItem: ShopItemCommodity): ShopItemJumpMode => {
  if (productItem.priceType === PRICE_TYPE_ENUM.SPOT) {
    return SHOP_ITEM_JUMP_MODE.SPOT_BY_COMMODITY
  }

  if (productItem.groupPurchase) {
    return SHOP_ITEM_JUMP_MODE.GROUP_DETAIL
  }

  return SHOP_ITEM_JUMP_MODE.NORMAL_DETAIL
}
