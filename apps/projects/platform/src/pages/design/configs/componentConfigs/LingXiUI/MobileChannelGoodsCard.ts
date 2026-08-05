/*
 * @Author: ghua
 * @Date: 2021-02-26 11:00:24
 * @LastEditTime: 2021-03-01 10:16:31
 * @LastEditors: Please set LastEditors
 * @Description: app渠道商城商品列表组件
 */
import { ComponentSchemaType, PROPS_SETTING_TYPES, PROPS_TYPES } from '@apps/design-core'

const MobileChannelGoodsCard: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: '编辑',
      type: PROPS_SETTING_TYPES.mobileChannelGoodsCard,
    },
    styleType: {
      label: '样式',
      type: PROPS_TYPES.objectArray,
    },
  },
}

export default MobileChannelGoodsCard
