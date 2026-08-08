import { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { useBusinessEffects } from './useBusinessEffects'

export const createEffects = (context, actions: ISchemaFormActions | ISchemaFormAsyncActions) => {
  useBusinessEffects(context, actions)
}
