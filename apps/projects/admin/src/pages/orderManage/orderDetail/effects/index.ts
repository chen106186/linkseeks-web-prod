import { ISchemaFormActions, FormEffectHooks, ISchemaFormAsyncActions } from '@apps/formily'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import { useLinkageUtils } from '@/utils/formEffectUtils'
import { orderCombination } from '../constant'
import { history } from '@linkseeks/router-manager'
import { fetchOrderApi } from '../apis'
import { getMemberManageUpperCreditParamGet } from '@apps/apis'

// 异步填充表格字段
const asyncPadDataForProduct = async (ctx: ISchemaFormActions | ISchemaFormAsyncActions, productValue: any) => {
  const productData = productValue.value
  const loading = productValue.loading

  if (productData.length === 0 || loading) {
    return false
  }

  ctx.setFieldState(productValue.path, (state) => {
    state.loading = true
  })
  // 折扣请求
  const asyncPriceRequests: any[] = await Promise.all(
    productData
      .filter((v) => v.memberPrice === undefined)
      .map(async (v) => {
        const { code, data } = await getMemberManageUpperCreditParamGet(
          {
            parentMemberId: v.memberId,
            parentMemberRoleId: v.memberRoleId,
          },
          { ttl: 60 * 1000, useCache: true },
        )
        return code === 1000 ? { value: data.parameter * 100 + '%', id: v.id } : { value: '', id: 0 }
      }),
  )

  // 存在需要异步请求的， 则进行赋值
  if (asyncPriceRequests.length > 0) {
    const newData = productData.map((v, i) => {
      if (!v.memberPrice) {
        v.memberPrice = asyncPriceRequests.find((j) => j.id === v.id)?.value || ''
      }
      return v
    })
    ctx.setFieldValue('orderProductRequests', newData)
  }
  ctx.setFieldState(productValue.path, (state) => {
    state.loading = false
  })
  // if (asyncAddressRequests.length > 0) {
  //   ctx.setFieldValue('orderProductRequests', productData.map((v, i) => {
  //     v.memberPrice = asyncPriceRequests[i]
  //     return v
  //   }))
  // }

  // 配送方式请求
  // const asyncAddressRequests = productData.filter(v => v.distributeMode !== undefined)
}
export const createEffects = (context) => () => {}

export const useModelTypeChange = (callback) => {
  const utils = useLinkageUtils()
  // 下单模式发生改变时
  FormEffectHooks.onFieldValueChange$('orderModel').subscribe((state) => {
    callback(state)
  })
}

export const useEditHideField = () => {
  const { pageStatus } = usePageStatus()
  const utils = useLinkageUtils()
  FormEffectHooks.onFormInit$().subscribe(() => {
    if (pageStatus === PageStatus.ADD) {
      utils.hide('orderNo')
      utils.hide('createTime')
    }
  })
}

// 表单初始化时，对应操作
export const useOrderFormInitEffect = (ctx: ISchemaFormActions | ISchemaFormAsyncActions) => {
  const { orderModel = 0 } = history.location.query
  FormEffectHooks.onFormMount$().subscribe(() => {
    // query中存在orderModel参数， 则是从其他页面跳转而来，需禁用其余query选项
    const typeEnums = parseInt(orderModel)
    ctx.setFieldState('orderModel', (state) => {
      state.props.enum = state.props.enum
        .map((v) => {
          const assign: any = Object.assign({}, v)
          if (orderCombination.queryPageOrderModal.includes(assign.value) && typeEnums !== assign.value) {
            assign.disabled = true
          }
          return assign
        })
        .sort((prev, next) => (prev.disabled ? prev.value : next.value - prev.value))
    })

    // 写入收货地址数据
    useProductAddress(ctx)
  })

  FormEffectHooks.onFieldValueChange$('needTheInvoice').subscribe((state) => {
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
        state.value = data[0].id
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
        state.value = data[0].id
      }
      state.dataSource = data
      state.showMore = data.length > 3
    })
  })
}
