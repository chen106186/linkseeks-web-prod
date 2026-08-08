/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-15 13:38:56
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-06-18 16:52:22
 * @Description: 联动逻辑
 */
import { FormEffectHooks, FormPath } from '@apps/formily'

const { onFieldInputChange$ } = FormEffectHooks

export const useBusinessEffects = (context, actions, fieldName: string) => {
  const { setFieldState } = actions

  // 如果勾选了长期有效，则清空 到期日
  onFieldInputChange$(`${fieldName}.*.permanent`).subscribe((fieldState) => {
    const { name, value } = fieldState
    if (value && value.length) {
      setFieldState(
        FormPath.transform(name, /^\d$/, ($1) => {
          return `${fieldName}.${$1}.expireDay`
        }),
        (state) => {
          state.value = ''
        },
      )
    }
  })

  // 如果选择了到期日，则清空 有效期
  onFieldInputChange$(`${fieldName}.*.expireDay`).subscribe((fieldState) => {
    const { name, value } = fieldState
    if (value) {
      setFieldState(
        FormPath.transform(name, /^\d$/, ($1) => {
          return `${fieldName}.${$1}.permanent`
        }),
        (state) => {
          state.value = []
        },
      )
    }
  })
}
