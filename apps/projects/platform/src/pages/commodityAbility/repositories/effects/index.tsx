import { useEffect } from 'react'
import { history } from '@linkseeks/router-manager'
import { ISchemaFormActions, FormEffectHooks } from '@apps/formily'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import {
  getProductCustomerGetCustomerCategoryTree,
  getProductInventoryByItemNo,
  getProductSelectGetSelectBrand,
  getProductWarehouseAll,
} from '@apps/apis'
import { clearModalParams } from '@/utils'
const { onFieldValueChange$ } = FormEffectHooks

export const useWarehouseSelect = (context: ISchemaFormActions) => {
  onFieldValueChange$('warehouseId').subscribe((state) => {
    // 货品ID
    const goodsId = context.getFieldValue('goodsId')
    const warehouseId = state.value
    getProductInventoryByItemNo({
      warehouseId,
      itemId: goodsId,
    }).then((res) => {
      const { data } = res
      context.setFieldValue('NO_SUBMIT3', data.inventory)
    })
  })
}

export const createAddRepositoryEffect = (context: ISchemaFormActions) => {
  const fetchWarehouseAll = async () => {
    const { data } = await getProductWarehouseAll()
    let _data = [].concat(data)
    context.setFieldState('warehouseId', (state) => {
      state.warehouseLists = _data
    })
    return _data.map((v) => ({
      value: v.id,
      label: v.name,
    }))
  }

  useAsyncSelect('warehouseId', fetchWarehouseAll)
  useWarehouseSelect(context)
}

export const useUnitPreview = (initValue, context) => {
  useEffect(() => {
    if (initValue) {
      context.setFieldState('inventory', (state) => {
        if (!state.props['x-props']) {
          state.props['x-props'] = {}
        }
        state.props['x-props'].addonAfter = <div style={{ marginLeft: 4 }}>{initValue.unit}</div>
      })
      context.setFieldValue('itemNo', initValue.itemNo)
    }
  }, [initValue])
}

// 高级筛选schema中用于输入搜索品牌的Effect

export const searchBrandOptionEffect = (context: any, fieldName: string) => {
  context.getFieldState(fieldName, (state) => {
    getProductSelectGetSelectBrand({ name: state.props['x-component-props'].searchValue }).then((res) => {
      context.setFieldState(fieldName, (state) => {
        state.props['x-component-props'].dataoption = res.data
      })
    })
  })
}

// 高级筛选schema中用于输入搜索商品品类的Effect

export const searchCustomerCategoryOptionEffect = (context: any, fieldName: string) => {
  context.getFieldState(fieldName, (state) => {
    // getProductSelectGetSelectCustomerCategory({ name: state.props['x-component-props'].searchValue }).then(res => {
    //   context.setFieldState(fieldName, state => {
    //     state.props['x-component-props'].dataoption = res.data
    //   })
    // })
    getProductCustomerGetCustomerCategoryTree().then((res) => {
      context.setFieldState(fieldName, (state) => {
        state.props['x-component-props'].dataoption = res.data
      })
    })
  })
}

/* 对于二级页面返回 清空筛选条件 */
export const returnClear = () => {
  clearModalParams()
  history.goBack()
}
