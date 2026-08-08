/*
 * @Author: XieZhiXiong
 * @Date: 2021-08-04 14:42:57
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 20:30:29
 * @Description:
 */
import { FormEffectHooks, IFormExtendsEffectSelector, ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { getProductInvoicesTypeAll, getProductWarehouseAll } from '@apps/apis'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import { useBusinessEffects } from './useBusinessEffects'

const { onFieldMount$ } = FormEffectHooks

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

export const createEffects = (
  context: IFormExtendsEffectSelector,
  actions: ISchemaFormActions | ISchemaFormAsyncActions,
  editable: boolean,
) => {
  useBusinessEffects(context, actions)

  useAsyncSelect('billType', fetchInvoicesType, ['name', 'id'])

  // 不可编辑状态不请求
  if (editable) {
    useAsyncSelect('inventoryId', fetchInventory, ['name', 'id'])
  }
}
