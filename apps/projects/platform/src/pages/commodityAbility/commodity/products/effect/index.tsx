import { useLinkageUtils } from '@/utils/formEffectUtils'
import { getProductCustomerGetCustomerCategoryTree, getProductSelectGetSelectBrand } from '@apps/apis'
import { FormEffectHooks } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'

const { onFormMount$ } = FormEffectHooks

// 高级筛选schema中用于输入搜索品牌的Effect

export const searchBrandOptionEffect = (context: any, fieldName: string) => {
  context.getFieldState(fieldName, (state) => {
    getProductSelectGetSelectBrand({ name: state.props['x-component-props'].searchValue }).then((res) => {
      context.setFieldState(fieldName, (state) => {
        state.props['x-component-props'].dataoption = res.data
      })
    })
  })
}

// 高级筛选schema中用于输入搜索商品品类的Effect

export const searchCustomerCategoryOptionEffect = (context: any, fieldName: string) => {
  context.getFieldState(fieldName, (state) => {
    getProductCustomerGetCustomerCategoryTree().then((res) => {
      context.setFieldState(fieldName, (state) => {
        state.props['x-component-props'].dataoption = res.data
      })
    })
  })
}

export const useSearchEffects = () => {
  const linkage = useLinkageUtils()
  onFormMount$().subscribe(() => {})
}
