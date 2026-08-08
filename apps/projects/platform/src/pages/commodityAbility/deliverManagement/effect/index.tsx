import { FormEffectHooks } from '@apps/formily'
const { onFieldChange$ } = FormEffectHooks

// 高级筛选schema中用于输入搜索品牌的Effect

export const useSearchBrandOptionEffect = (context: any, fieldName: string, server: (params: any) => Promise<any>) => {
  onFieldChange$(fieldName).subscribe(() => {
    context.getFieldState(fieldName, (state) => {
      const searchValue = state.props['x-component-props'].searchValue
      server(searchValue ? { name: searchValue } : {}).then((res) => {
        context.setFieldState(fieldName, (states) => {
          states.props['x-component-props'].dataoption = res
        })
      })
    })
  })
}
