/*
 * @Author: XieZhiXiong
 * @Date: 2021-10-18 11:11:48
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 20:29:02
 * @Description:
 */
import { useBusinessEffects } from './useBusinessEffects'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { getProductInvoicesTypeAll, getProductWarehouseAll } from '@apps/apis'
import { getProductMaterialGroupTree } from '@apps/apis'
import { createFormActions, FormEffectHooks, FormPath } from '@apps/formily'
const { onFormMount$ } = FormEffectHooks

const EMPTY_ARRAY = []

// 获取单据类型
const fetchInvoicesType = (): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    getProductInvoicesTypeAll()
      .then((res) => {
        if (res.code === 1000) {
          resolve(res.data)
        }
        reject()
      })
      .catch(() => {
        reject()
      })
  })
}

// 获取仓库
const fetchInventory = (): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    getProductWarehouseAll()
      .then((res) => {
        if (res.code === 1000) {
          resolve(res.data)
        }
        reject()
      })
      .catch(() => {
        reject()
      })
  })
}

export const createEffects = (context, actions) => {
  useBusinessEffects(context, actions)

  useAsyncSelect('invoicesTypeId', fetchInvoicesType, ['name', 'id'])
  useAsyncSelect('warehouseId', fetchInventory, ['name', 'id'])
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
