import { useAsyncInitSelect } from '@/formSchema/effects/useAsyncInitSelect'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { postMemberSupplierLifecycleRuleGet } from '@apps/apis'
import { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { useBusinessEffects } from './useBusinessEffects'

export const createEffects = (context, actions: ISchemaFormActions | ISchemaFormAsyncActions) => {
  useBusinessEffects(context, actions)

  useAsyncSelect('targetLifecycleStageId', async () => {
    try {
      const { data, code } = await postMemberSupplierLifecycleRuleGet({}, { ctlType: 'none' })
      if (code === 1000) {
        return data?.lifecycle?.map((item) => ({
          label: item.lifecycleStagesName,
          value: item.lifecycleStagesId,
        }))
      }
      return []
    } catch (error) {}
  })
}
