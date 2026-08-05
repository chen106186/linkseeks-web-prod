import { getProductMaterialGroupTree } from '@apps/apis'
import { createFormActions, FormEffectHooks, FormPath } from '@apps/formily'
const { onFormMount$, onFieldChange$ } = FormEffectHooks

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

// 高级筛选schema中用于输入搜索品牌的Effect

export const useSearchBrandOptionEffect = (context: any, fieldName: string, server: (params: any) => Promise<any>) => {
  onFieldChange$(fieldName).subscribe(() => {
    context.getFieldState(fieldName, (state) => {
      const searchValue = state.props['x-component-props'].searchValue
      server(searchValue ? { name: searchValue } : {}).then((res) => {
        context.setFieldState(fieldName, (states) => {
          states.props['x-component-props'].dataoption = res
        })
      })
    })
  })
}
