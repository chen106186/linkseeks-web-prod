import { getProductPlatformGetCategoryTree, getProductSelectGetSelectPlatformBrand } from '@apps/apis'

// 高级筛选schema中用于输入搜索品牌的Effect

export const searchBrandOptionEffect = (context: any, fieldName: string) => {
  context.getFieldState(fieldName, (state) => {
    getProductSelectGetSelectPlatformBrand({ name: state.props['x-component-props'].searchValue }).then((res) => {
      context.setFieldState(fieldName, (_state) => {
        _state.props['x-component-props'].dataoption = res.data
      })
    })
  })
}

// 高级筛选schema中用于输入搜索商品品类的Effect

export const searchCustomerCategoryOptionEffect = (context: any, fieldName: string) => {
  context.getFieldState(fieldName, () => {
    getProductPlatformGetCategoryTree().then((res) => {
      context.setFieldState(fieldName, (_state) => {
        _state.props['x-component-props'].dataoption = res.data
      })
    })
  })
}
