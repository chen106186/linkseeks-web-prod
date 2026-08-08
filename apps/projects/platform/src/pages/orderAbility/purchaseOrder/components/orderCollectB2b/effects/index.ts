import { ISchemaFormActions, FormEffectHooks, ISchemaFormAsyncActions } from '@apps/formily'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import { useLinkageUtils } from '@/utils/formEffectUtils'
import { fetchOrderApi } from '../apis'
import moment from 'moment'
import { getOrderBuyerFindDeliveryDate } from '@apps/apis'
import { getProductCustomerGetMemberCustomerCategoryTree } from '@apps/apis'

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

  const newData = productData.map((v, i) => {
    //@ b2b订单不考虑会员折扣 字段固定100
    v.discount = 100
    return v
  })
  ctx.setFieldValue('products', newData)
  ctx.setFieldState(productValue.path, (state) => {
    state.loading = false
  })
}

export const useModelTypeChange = (callback) => {
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
      utils.hide('orderNo')
      utils.hide('createTime')
    }
  })
}

export const useProductTableChangeForPay = (ctx: ISchemaFormActions | ISchemaFormAsyncActions, update) => {
  const { pageStatus } = usePageStatus()
  let sumPrice = 0

  FormEffectHooks.onFieldValueChange$('sumPrice').subscribe((state) => {
    sumPrice = state.value
  })
  FormEffectHooks.onFieldValueChange$('products').subscribe((state) => {
    const { value } = state
    // 强制渲染一次, 用于触发金额总数
    update()
    const orderMode = ctx.getFieldValue('orderMode')
    if (value && value.length > 0 && !state.loading) {
      // 添加loading判断避免二次调用
      // 请求一次并复制给支付信息
      const productItem = value[0]
      if (pageStatus === PageStatus.ADD) {
        // 新增下 需要支付信息生成支付次数
        ctx.setFieldValue('payments', []) // 变动后先 清空支付信息
        const shopId = productItem['shopId']
        const products = value.map((item) => ({ productId: item.commodityId, skuId: item.productId }))
        if (shopId && products?.length) {
          // 判断不存在物流 隐藏交付地址
          if (!value.some((item) => item.logistics.deliveryType === 1 || item.logistics.deliveryType === 4)) {
            ctx.setFieldState('deliveryAddresId', (state) => (state.visible = false))
          } else {
            ctx.setFieldState('deliveryAddresId', (state) => (state.visible = true))
          }
          fetchOrderApi
            .getPayInfoList({
              products: products,
              memberId: productItem?.memberId,
              roleId: productItem?.memberRoleId,
              orderMode: orderMode,
              shopId: shopId,
            })
            .then((data) => {
              ctx.setFieldValue(
                'payments',
                data.map((item) => ({
                  ...item,
                  payPrice: ((sumPrice * Number(item.payRate)) / 100).toFixed(2),
                })),
              )
            })
            .catch((err) => {})
        }
      }
    }

    // 确认后 需根据商品id请求会员折扣接口，以及配送方式
    // 由于商品存在多个， 需对接口做一定缓存
    asyncPadDataForProduct(ctx, state)

    const numberInputs = document.getElementsByClassName('purchase_amount_input')
    if (numberInputs?.length) {
      for (let i = 0; i < numberInputs.length; i++) {
        numberInputs[i].removeAttribute('disabled')
      }
    }
  })
}

export interface JumpFormValueType {
  shopId: number
  vendorMemberId: number
  vendorRoleId: number
}

// 异步处理发货 预约时间 时间段配置
export const useOrderDeliverTimeEffect = async (
  ctx: ISchemaFormActions | ISchemaFormAsyncActions,
  shopId,
  jumpFormValue: JumpFormValueType,
) => {
  const { pageStatus, quotationId } = usePageStatus()
  if (shopId) {
    let vendorMemberId, vendorRoleId
    // if(pageStatus === PageStatus.ADD) {
    vendorMemberId = ctx.getFieldValue('vendorMemberId') || jumpFormValue.vendorMemberId
    vendorRoleId = ctx.getFieldValue('vendorRoleId') || jumpFormValue.vendorRoleId
    // } else if(pageStatus === PageStatus.EDIT) {
    //   vendorMemberId = jumpFormValue.vendorMemberId
    //   vendorRoleId = jumpFormValue.vendorRoleId
    // }
    console.log(vendorMemberId, vendorRoleId, 'jumpFormValue')
    const { code, data } = await getOrderBuyerFindDeliveryDate({ shopId, vendorMemberId, vendorRoleId })
    if (code !== 1000) {
      return false
    }

    ctx.setFieldState('deliverDate', (state) => {
      state.props['x-component-props'].disabledDate = (current) => {
        if (data?.days) {
          return current && (current < moment().startOf('day') || current > moment().add(data.days, 'days'))
        } else {
          return current && current < moment().startOf('day')
        }
      }
      if (data.paramList?.length) {
        // 有时间段 时间控件不显示时分
        state.props['x-component-props'].showTime = false
        state.props['x-component-props'].format = 'YYYY-MM-DD'
      } else {
        state.props['x-component-props'].showTime = true
        state.props['x-component-props'].format = 'YYYY-MM-DD HH:mm'
      }
    })
    ctx.setFieldState('timeLine', (state) => {
      if (data.paramList?.length) {
        state.props.enum = data.paramList.map((item) => ({
          label: `${item.startTime}-${item.endTime}`,
          value: `${item.startTime}-${item.endTime}`,
        }))
      } else {
        state.visible = false
      }
    })
    // 默认选择第一个时间段
    setTimeout(() => {
      if (data.paramList?.length) {
        const timeObj = data.paramList[0]
        ctx.setFieldValue('timeLine', `${timeObj.startTime}-${timeObj.endTime}`)
      }
    }, 600)
  }
}

// 表单初始化时，对应操作
export const useOrderFormInitEffect = (ctx: ISchemaFormActions | ISchemaFormAsyncActions) => {
  FormEffectHooks.onFormMount$().subscribe(async () => {
    // 写入收货地址数据
    useProductAddress(ctx)
  })
  // FormEffectHooks.onFieldValueChange$('hasInvoice').subscribe(state => {
  //   if (state.value) {
  //     useInvoiceList(ctx)
  //   }
  // })
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

// 高级筛选schema中用于输入搜索商品品类的Effect
/**
 * @param ctx 外部表单action
 * @param mctx 模态框表单action
 * @param fieldName 字段名称
 */
export const searchCustomerCategoryOptionEffect = (ctx: any, mctx: any, fieldName: string) => {
  const params: any = {}
  params['memberId'] = ctx.getFieldValue('vendorMemberId')
  params['memberRoleId'] = ctx.getFieldValue('vendorRoleId')
  mctx.getFieldState(fieldName, (state) => {
    getProductCustomerGetMemberCustomerCategoryTree(params).then((res) => {
      mctx.setFieldState(fieldName, (state) => {
        state.props['x-component-props'].dataoption = res.data
      })
    })
  })
}
