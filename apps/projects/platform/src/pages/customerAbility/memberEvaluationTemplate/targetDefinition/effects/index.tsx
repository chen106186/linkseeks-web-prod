import { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { useBusinessEffects } from './useBusinessEffects'

export const createEffects = (context, actions: ISchemaFormActions | ISchemaFormAsyncActions, mockId: number) => {
  useBusinessEffects(context, actions, mockId)
}
