/*
 * @Author: XieZhiXiong
 * @Date: 2020-10-22 17:31:08
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2020-10-26 18:29:35
 * @Description: 联动逻辑相关
 */
import { FormEffectHooks, FormPath } from '@apps/formily'
import { useLinkageUtils } from '@/utils/formEffectUtils'

const { onFieldInputChange$, onFieldValueChange$ } = FormEffectHooks

export const useBusinessEffects = (context, actions) => {
  const { getFieldValue, setFieldValue, getFieldState, setFieldState } = actions
  const linkage = useLinkageUtils()

  // 还款金额 联动 滑块条
  onFieldInputChange$('applyQuota').subscribe((fieldState) => {
    linkage.value('quotaSlide', +fieldState.value)
  })

  // 滑块条 联动 还款金额
  onFieldInputChange$('quotaSlide').subscribe((fieldState) => {
    linkage.value('applyQuota', `${fieldState.value}`)
  })
}
