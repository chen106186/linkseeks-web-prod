import { onFieldValueChange } from '@apps/form'

/**
 * @param origin 触发联动的字段路径
 * @param target 关联的字段路径
 */
export const useStateFilterSearchLinkageEffect = (origin: string, target: string) => {
  onFieldValueChange(origin, (field, form) => {
    form.setFieldState(target, (state) => {
      const value = form.getValuesIn(origin)
      const display = value ? 'visible' : 'hidden'
      state.display = display
    })
  })
}
