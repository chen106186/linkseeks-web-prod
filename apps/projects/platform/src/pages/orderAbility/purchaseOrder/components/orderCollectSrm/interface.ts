import type { PostOrderBuyerCreateSrmRequest } from '@apps/apis'

export type PostOrderMaterialData = PostOrderBuyerCreateSrmRequest['products'][0] & {
  /**
   * 订单物料抽屉内部key
   */
  key: string
}
