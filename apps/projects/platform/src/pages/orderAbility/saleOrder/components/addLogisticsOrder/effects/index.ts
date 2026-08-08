import { FormEffectHooks, ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'

export const useDetailTableChangeForAmount = (ctx: ISchemaFormActions | ISchemaFormAsyncActions, update) => {
  FormEffectHooks.onFieldValueChange$('detailList').subscribe(() => {
    // 强制渲染一次, 用于统计总数
    update()
  })
}
