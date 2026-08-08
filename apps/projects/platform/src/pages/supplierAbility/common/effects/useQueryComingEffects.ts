/*
 * @Description: Saas列表查询条件 effects
 */
import { FormEffectHooks } from '@apps/formily'
import { useLinkageUtils } from '@/utils/formEffectUtils'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { GlobalConfig } from '@/global/config'

const { onFormInit$ } = FormEffectHooks

export const useQueryComingEffects = (context, actions) => {
  const { setFieldState } = actions
  const linkage = useLinkageUtils()

  onFormInit$().subscribe(() => {
    if (GlobalConfig.global.siteInfo.enableMultiTenancy) {
      setFieldState('name', (state) => {
        state.props['x-component-props'].advanced = false
      })
      linkage.hide(`${FORM_FILTER_PATH}.*`)
    }
  })
}
