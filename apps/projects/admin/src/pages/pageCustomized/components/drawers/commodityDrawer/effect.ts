import {
  getProductCommodityTemplateGetBrandList,
  getProductCommodityTemplateGetFirstCategoryListByMemberId,
} from '@apps/apis'

// 高级筛选schema中用于输入搜索品牌的Effect

export const searchBrandOptionEffect = (shopId: any, context: any, fieldName: string) => {
  context.getFieldState(fieldName, (state) => {
    getProductCommodityTemplateGetBrandList({
      current: '1',
      pageSize: '100',
      name: state.props['x-component-props'].searchValue,
      shopId,
    }).then((res) => {
      context.setFieldState(fieldName, (state) => {
        state.props['x-component-props'].dataoption = res.data?.data?.map((item) => {
          return { name: item.name, id: item.id }
        })
      })
    })
  })
}

// 高级筛选schema中用于输入搜索商品品类的Effect

export const searchCustomerCategoryOptionEffect = (shopId: any, context: any, fieldName: string) => {
  context.getFieldState(fieldName, (state) => {
    getProductCommodityTemplateGetFirstCategoryListByMemberId({
      shopId,
    }).then((res) => {
      // getProductPlatformGetCategoryTree().then(res => {
      context.setFieldState(fieldName, (state) => {
        state.props['x-component-props'].dataoption = res.data?.map((item) => {
          return { name: item.name, id: item.id }
        })
      })
    })
  })
}
