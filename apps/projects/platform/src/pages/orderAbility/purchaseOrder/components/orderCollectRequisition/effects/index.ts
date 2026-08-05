import { ISchemaFormActions, FormEffectHooks, ISchemaFormAsyncActions } from '@apps/formily'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import { useLinkageUtils } from '@/utils/formEffectUtils'
import { fetchOrderApi } from '../apis'
import { getProductCustomerGetMemberCustomerCategoryTree } from '@apps/apis'

export const useModelTypeChange = (callback) => {
  const utils = useLinkageUtils()
  // 下单模式发生改变时
  FormEffectHooks.onFieldValueChange$('orderMode').subscribe((state) => {
    callback(state)
  })
}

export const useEditHideField = () => {
  const { pageStatus } = usePageStatus()
  const utils = useLinkageUtils()
  FormEffectHooks.onFormInit$().subscribe(() => {
    if (pageStatus === PageStatus.ADD) {
      utils.hide('createTime')
    }
  })
}

// 表单初始化时，对应操作
export const useOrderFormInitEffect = (ctx: ISchemaFormActions | ISchemaFormAsyncActions) => {
  FormEffectHooks.onFormMount$().subscribe(async () => {
    // 写入收货地址数据
    useProductAddress(ctx)
  })

  FormEffectHooks.onFieldValueChange$('hasInvoice').subscribe((state) => {
    if (state.value) {
      useInvoiceList(ctx)
    }
  })
}

export const useProductAddress = (ctx: ISchemaFormActions | ISchemaFormAsyncActions) => {
  fetchOrderApi.getProductAddressAll().then((data) => {
    ctx.setFieldState('deliveryAddresId', (state) => {
      if (data.length > 0 && !state.value) {
        // 初始化时存在数据， 默认帮用户选中第一个(默认地址)
        state.value = data[0]
      }
      state.dataSource = data
      state.showMore = data.length > 3
    })
  })
}

// 获取发票信息
export const useInvoiceList = (ctx: ISchemaFormActions | ISchemaFormAsyncActions) => {
  fetchOrderApi.getInvoicesList().then((data) => {
    ctx.setFieldState('theInvoiceId', (state) => {
      if (data.length > 0 && !state.value) {
        // 初始化时存在数据， 默认帮用户选中第一个
        state.value = data[0]
      }
      state.dataSource = data
      state.showMore = data.length > 3
    })
  })
}

export const useProductTableChangeForPay = (ctx: ISchemaFormActions | ISchemaFormAsyncActions, update) => {
  FormEffectHooks.onFieldValueChange$('products').subscribe((state) => {
    const { value } = state
    // 强制渲染一次, 用于触发金额总数
    update()
  })
}

// 高级筛选schema中用于输入搜索商品品类的Effect
/**
 * @param ctx 外部表单action
 * @param mctx 模态框表单action
 * @param fieldName 字段名称
 */
export const searchCustomerCategoryOptionEffect = (ctx: any, mctx: any, fieldName: string) => {
  const params: any = {}
  params['memberId'] = ctx.getFieldValue('supplyMembersId')
  params['memberRoleId'] = ctx.getFieldValue('supplyMembersRoleId')
  mctx.getFieldState(fieldName, (state) => {
    getProductCustomerGetMemberCustomerCategoryTree(params).then((res) => {
      mctx.setFieldState(fieldName, (state) => {
        state.props['x-component-props'].dataoption = res.data
      })
    })
  })
}
