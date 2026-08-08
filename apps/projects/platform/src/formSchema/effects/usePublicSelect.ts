import { createFormActions, FormEffectHooks } from '@apps/formily'
import { useLinkageUtils } from '@/utils/formEffectUtils'

/**
 * 定义表单副作用的集合
 */
const { onFieldValueChange$ } = FormEffectHooks

export const usePublicSelectEffects = (context) => {
  const linkage = useLinkageUtils()
  onFieldValueChange$('select').subscribe(({ value }) => {
    linkage.visible(value)
  })
}
