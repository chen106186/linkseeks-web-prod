/*
 * @Author: XieZhiXiong
 * @Date: 2021-08-04 14:43:14
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-12 17:08:09
 * @Description:
 */
import { FormEffectHooks, FormPath, ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { useLinkageUtils } from '@/utils/formEffectUtils'

const { onFieldInputChange$, onFieldValueChange$ } = FormEffectHooks

export const useBusinessEffects = (context, actions: ISchemaFormActions | ISchemaFormAsyncActions) => {
  const { getFieldValue, setFieldState, setFieldValue, getFieldState } = actions

  const linkage = useLinkageUtils()

  // 对应仓库改变
  onFieldInputChange$('inventoryId').subscribe((fieldState) => {
    const current = fieldState.originAsyncData.find((item) => item.id === fieldState.value)
    if (current) {
      linkage.value('inventoryRole', current.principal)
    }
    if (current) {
      setFieldValue('inventoryName', current.name)
    }
  })

  // 相关单据明细 数量 改变计算相关 单据金额
  onFieldInputChange$('billDetails.*.count').subscribe((fieldState) => {
    const { name, value } = fieldState
    const priceValue = getFieldValue(
      FormPath.transform(name, /\d/, ($1) => {
        return `billDetails.${$1}.price`
      }),
    )
    setFieldState(
      FormPath.transform(name, /\d/, ($1) => {
        return `billDetails.${$1}.amount`
      }),
      (state) => {
        state.value = value ? +`${(+value * +priceValue).toFixed(2)}` : undefined
      },
    )
  })
}
