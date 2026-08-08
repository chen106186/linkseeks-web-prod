import { ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import {
  getProductCustomerGetCustomerCategoryTree,
  getProductSelectGetSelectBrand,
  getProductSelectGetSelectUnit,
} from '@apps/apis'

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
    getProductCustomerGetCustomerCategoryTree().then((res) => {
      context.setFieldState(fieldName, (state) => {
        state.props['x-component-props'].dataoption = res.data
      })
    })
  })
}

// select显示单位

export const showAllUnitList = (context: any, fieldName: string) => {
  context.getFieldState(fieldName, (state) => {
    getProductSelectGetSelectUnit({ name: '' }).then((res) => {
      context.setFieldState(fieldName, (state) => {
        state.props['enum'] = res.data
      })
    })
  })
}

// 监听附件列表字段变动 处理编辑情况下的id问题
export const useAttachmentChangeForEdit = (ctx: ISchemaFormActions | ISchemaFormAsyncActions) => {
  // FormEffectHooks.onFieldValueChange$('orderProductRequests').subscribe(state => {
  // })
}
