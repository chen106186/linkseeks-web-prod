import { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'

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
  const { setFieldState } = actions
  context('onFieldChange', origin).subscribe((state) => {
    setFieldState(target, (fieldState) => {
      if (fieldState.props['x-component-props']) {
        const style = state.filterSearch
          ? {
              ...fieldState.props['x-component-props']['colStyle'],
              marginTop: 8,
              visibility: 'visible',
              height: 'auto',
              opacity: 1,
            }
          : {
              ...fieldState.props['x-component-props']['colStyle'],
              marginTop: 0,
              visibility: 'hidden',
              height: 0,
              opacity: 0,
            }
        fieldState.props['x-component-props']['colStyle'] = style
        fieldState.props['x-component-props']['style'] = style
      } else {
        fieldState.props['x-component-props'] = state.filterSearch
          ? {
              style: {
                visibility: 'visible',
                height: 'auto',
                opacity: 1,
                marginTop: 8,
              },
              colStyle: {
                visibility: 'visible',
                height: 'auto',
                opacity: 1,
                marginTop: 8,
              },
            }
          : {
              style: {
                visibility: 'hidden',
                height: 0,
                opacity: 0,
                marginTop: 0,
              },
              colStyle: {
                marginTop: 0,
                visibility: 'hidden',
                height: 0,
                opacity: 0,
              },
            }
      }
    })
  })
}
