import { FormEffectHooks, ISchemaFormActions, ISchemaFormAsyncActions } from '@apps/formily'
import { getProductCustomerGetCustomerCategoryTree, getProductSelectGetSelectBrand } from '@apps/apis'
import { PageStatus, usePageStatus } from '@/hooks/usePageStatus'
import { useLinkageUtils } from '@/utils/formEffectUtils'

export const useMaterialTableChangeForAmount = (ctx: ISchemaFormActions | ISchemaFormAsyncActions, update) => {
  FormEffectHooks.onFieldValueChange$('products').subscribe((state) => {
    // 强制渲染一次, 用于触发金额总数
    update()
  })
}

export const useInitShowField = () => {
  const { pageStatus } = usePageStatus()
  const utils = useLinkageUtils()
  FormEffectHooks.onFormInit$().subscribe(() => {
    // 初始化一些详情数据
    // if (pageStatus === PageStatus.ADD) {
    //   utils.hide('orderNo')
    //   utils.hide('createTime')
    // }
  })
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
    getProductCustomerGetCustomerCategoryTree().then((res) => {
      context.setFieldState(fieldName, (state) => {
        state.props['x-component-props'].dataoption = res.data
      })
    })
  })
}
