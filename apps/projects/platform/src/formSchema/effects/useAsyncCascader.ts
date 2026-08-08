import { getProductMaterialGroupTree } from '@apps/apis'
import { createFormActions, FormEffectHooks, FormPath } from '@apps/formily'
const { onFormMount$ } = FormEffectHooks

const EMPTY_ARRAY = []

export const useAsyncCascader = async (name, service: () => Promise<any[]>) => {
  const { setFieldState } = createFormActions()
  onFormMount$().subscribe(() => {
    service()
      .then((res) => {
        setFieldState(name, (state) => {
          FormPath.setIn(state, 'props.x-component-props.options', res)
        })
      })
      .catch((err) => {
        setFieldState(name, (state) => {
          FormPath.setIn(state, 'props.x-component-props.options', [])
        })
      })
  })
}

export const fetchTreeData = async () => {
  try {
    const { data, code } = await getProductMaterialGroupTree({ rootNodeId: '0' })
    if (code === 1000) {
      return data
    }
    return EMPTY_ARRAY
  } catch {
    return EMPTY_ARRAY
  }
}
