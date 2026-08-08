import { ComponentSchemaType, PROPS_SETTING_TYPES } from '@apps/design-core'
import { getWebIntl } from '@apps/locales'

const translate = getWebIntl()

// 商品楼层-带店铺推荐
const CommodityStoreFloor: ComponentSchemaType = {
  propsConfig: {
    componentType: {
      label: translate('web.resource.shop.shangpinloucengdaidianputuijian'),
      type: PROPS_SETTING_TYPES.commodityStoreFloor,
    },
  },
}

export default CommodityStoreFloor
