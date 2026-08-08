import { ShopAreaType } from '../types'

/**
 * 渲染业务所在地数据
 */
export const renderShopAreas = (areas: ShopAreaType[] | undefined) => {
  if (areas && areas.length > 0) {
    return areas.map((item) => `${item.province}${item.city !== item.province ? `-${item.city}` : ''}`).join(';')
  }
  return ''
}
