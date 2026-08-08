import { onFieldValueChange } from '@apps/form'
import { useLinkageUtils } from '../linkages/formEffectUtils'
/**
 * form 2.0 use
 */
export const usePublicSelectEffects = () => {
  const linkage = useLinkageUtils()
  onFieldValueChange('select', (field) => {
    linkage.visible(field, field.value)
  })
}
