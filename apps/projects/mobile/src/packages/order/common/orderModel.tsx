/**
 * 根据商城类型获取购物车的下单模式id
 */
import { SHOP_TYPE } from '@/constants/const/shop'

export default {
  [SHOP_TYPE.ENTERPRISE]: 5,
  /**
   * 渠道直采购物车下单：订单从渠道商城-购物车生成，订单商品自动根据购物车生成
   */
  [SHOP_TYPE.CHANNEL]: 10,
  /**
   * 渠道现货购物车下单：订单从渠道自有商城-购物车生成，订单商品自动根据购物车生成
   */
  [SHOP_TYPE.CHANNEL_OWNED]: 12,
}
