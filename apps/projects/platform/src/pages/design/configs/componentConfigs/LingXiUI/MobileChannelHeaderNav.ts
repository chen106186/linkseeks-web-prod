/*
 * @Author: ghua
 * @Date: 2021-02-26 11:00:24
 * @LastEditTime: 2021-03-01 10:41:16
 * @LastEditors: Please set LastEditors
 * @Description: app渠道商城头部组件
 */
import { ComponentSchemaType, PROPS_TYPES, PROPS_SETTING_TYPES } from '@apps/design-core'

const MobileChannelHeaderNav: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: '编辑',
      type: PROPS_SETTING_TYPES.mobileHeaderNav,
    },
    styleType: {
      label: '样式',
      type: PROPS_TYPES.objectArray,
    },
  },
}

export default MobileChannelHeaderNav
