import { getProductSelectGetSelectBrand } from '@apps/apis'

export const searchOptionEffect = (context: any, fieldName: string) => {
  context.getFieldState(fieldName, (state) => {
    getProductSelectGetSelectBrand({ name: state.props['x-component-props'].searchValue }).then((res) => {
      context.setFieldState(fieldName, (state) => {
        state.props['x-component-props'].dataoption = res.data
      })
    })
  })
}
