import { FormEffectHooks } from '@apps/formily'
import { useLinkageUtils } from '@/utils/formEffectUtils'

const { onFieldValueChange$ } = FormEffectHooks
/**
 * @description 用于同步表单的值
 * @param target 同步的目标路径
 * @param syncArr 被同步的表单字段
 */
export const useSyncValues = (target: string, syncArr: string[]) => {
  const linkage = useLinkageUtils()
  onFieldValueChange$(target).subscribe((state) => {
    syncArr.forEach((v) => {
      linkage.value(v, state.value)
    })
  })
}
