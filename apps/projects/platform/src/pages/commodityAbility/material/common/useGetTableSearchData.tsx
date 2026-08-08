import {
  getProductCustomerGetCustomerCategoryTree,
  getProductMaterielGetInnerStatus,
  getProductMaterialGroupTree,
  getProductSelectGetSelectBrand,
  getProductSelectGetSelectUnit,
} from '@apps/apis'
import { getMemberUserPage } from '@apps/apis'
import { createFormActions, FormEffectHooks, FormPath } from '@apps/formily'
const { onFormMount$ } = FormEffectHooks

const EMPTY_ARRAY = []

export const EMPTY = {
  totalCount: 0,
  data: [],
}

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

export const fetchCategoryData = async () => {
  try {
    const { data, code } = await getProductCustomerGetCustomerCategoryTree()
    if (code === 1000) {
      return data
    }
    return EMPTY_ARRAY
  } catch {
    return EMPTY_ARRAY
  }
}

export const fetchBrand = async () => {
  try {
    const { data, code } = await getProductSelectGetSelectBrand()
    if (code === 1000) {
      return data
    }
    return EMPTY_ARRAY
  } catch {
    return EMPTY_ARRAY
  }
}
export const fetchStatus = async () => {
  try {
    const { data, code } = await getProductMaterielGetInnerStatus()
    if (code === 1000) {
      return data
    }
    return EMPTY_ARRAY
  } catch {
    return EMPTY_ARRAY
  }
}

export const fetchUnit = async (name?: string) => {
  try {
    const { data, code } = await getProductSelectGetSelectUnit({ name })
    if (code === 1000) {
      return data.map((_item) => ({ name: _item.label, id: Number(_item.value) }))
    }
    return EMPTY_ARRAY
  } catch {
    return EMPTY_ARRAY
  }
}

export const fetchUserPage = async (params) => {
  try {
    const { data } = await getMemberUserPage(params)
    return data
  } catch {
    return EMPTY_ARRAY
  }
}
