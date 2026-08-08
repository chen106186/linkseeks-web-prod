import { ComponentSchemaType, PROPS_TYPES, PROPS_SETTING_TYPES } from '@apps/design-core'

// 平台首页名企采购
const PlatformPurchase: ComponentSchemaType = {
  // nodePropsConfig: {
  //   overflowedIndicator: {
  //     type: NODE_PROPS_TYPES.reactNode,
  //     // isOnlyNode: true,
  //   },
  //   children: {
  //     type: NODE_PROPS_TYPES.reactNode,
  //     childNodesRule: [
  //       'PlatformPurchase.Banner'
  //     ],
  //   },
  // },
  propsConfig: {
    children: {
      label: '文本内容',
      type: PROPS_TYPES.string,
    },
  },
}

const Banner: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: '名企采购广告设置',
      type: PROPS_SETTING_TYPES.platformPurchaseAdvert,
    },
  },
}

export default {
  PlatformPurchase,
  'PlatformPurchase.Banner': Banner,
}
