import { FormEffectHooks } from '@apps/formily'
import { useLinkageUtils } from '@/utils/formEffectUtils'
const { onFormMount$ } = FormEffectHooks

export const useBusinessEffects = (externalStatusFetch, interiorStatusFetch) => {
  const linkage = useLinkageUtils()
  onFormMount$().subscribe(() => {
    externalStatusFetch &&
      externalStatusFetch().then((res) => {
        const _enum = res.data.map((item) => {
          return { label: item.name || item.message, value: item.satatus || item.code }
        })
        linkage.enum('externalState', _enum)
        linkage.enum('externalStatusList', _enum)
      })
    interiorStatusFetch &&
      interiorStatusFetch().then((res) => {
        const _enum = res.data.map((item) => {
          return { label: item.name || item.message, value: item.satatus || item.code }
        })
        linkage.enum('interiorState', _enum)
        linkage.enum('innerStatusList', _enum)
      })
  })
}
