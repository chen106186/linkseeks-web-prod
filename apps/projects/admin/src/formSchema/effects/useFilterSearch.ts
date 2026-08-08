import { useValueLinkageEffect, ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'

/**
 * @param origin 触发联动的字段路径
 * @param target 关联的字段路径
 */
export const useStateFilterSearchLinkageEffect = (
  context,
  actions: ISchemaFormActions | ISchemaFormAsyncActions,
  origin: string,
  target: string,
) => {
  const { setFieldState, reset } = actions
  context('onFieldChange', origin).subscribe((state) => {
    setFieldState(target, (fieldState) => {
      if (fieldState.props['x-component-props']) {
        fieldState.props['x-component-props']['colStyle'] = state.filterSearch
          ? {
              ...fieldState.props['x-component-props']['colStyle'],
              visibility: 'visible',
              height: 'auto',
              opacity: 1,
            }
          : {
              ...fieldState.props['x-component-props']['colStyle'],
              visibility: 'hidden',
              height: 0,
              opacity: 0,
            }
      } else {
        fieldState.props['x-component-props'] = state.filterSearch
          ? {
              colStyle: {
                visibility: 'visible',
                height: 'auto',
                opacity: 1,
              },
            }
          : {
              colStyle: {
                visibility: 'hidden',
                height: 0,
                opacity: 0,
              },
            }
      }
    })
  })
}
