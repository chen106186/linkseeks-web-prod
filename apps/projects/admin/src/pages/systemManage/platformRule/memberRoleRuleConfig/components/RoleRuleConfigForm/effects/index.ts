import { IFormExtendsEffectSelector, ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { useBusinessEffects } from './useBusinessEffects'

export const createEffects = (
  context: IFormExtendsEffectSelector,
  actions: ISchemaFormActions | ISchemaFormAsyncActions,
) => {
  useBusinessEffects(context, actions)
}
