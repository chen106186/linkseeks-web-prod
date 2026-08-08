import { ISchemaFormActions, FormEffectHooks, ISchemaFormAsyncActions } from '@apps/formily'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import { useLinkageUtils } from '@/utils/formEffectUtils'
import { orderCombination } from '../constant'
import { useQuery } from '@linkseeks/router-core'
import { fetchOrderApi } from '../apis'
import { authService } from '@apps/services'
import { getCookie } from '@/utils/cookie'
import { filterProductDataById } from '../components/productModalTable'
import { OrderModalType } from '@/constants/order'
import { getMemberManageUpperCreditParamGet } from '@apps/apis'
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
  // 折扣请求
  // @采购合同模式下单 不考虑会员折扣
  const asyncPriceRequests: any[] =
    ctx.getFieldValue('orderModel') < OrderModalType.PURCHASE_ENQUIRY_CONTRACT_ORDER
      ? await Promise.all(
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
              // return code === 1000 ? { value: (data.parameter * 100) + '%', id: v.id } : { value: '', id: 0 }
              return code === 1000 ? { value: data.parameter, id: v.id } : { value: '', id: 0 }
            }),
        )
      : []

  //   const asyncAddressRequests = await Promise.all(productData.filter(v => v.memberPrice === undefined).map(async v =>  {
  //     const {code, data} = await getLogisticsShipperAddressGet({
  //       id: v.logistics.sendAddress
  //     }, {ttl: 60 * 1000, useCache: true})
  //     return code === 1000 ? data : null
  //   }
  // ))
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

export const useProductTableChangeForPay = (ctx: ISchemaFormActions | ISchemaFormAsyncActions, update) => {
  const { pageStatus } = usePageStatus()
  FormEffectHooks.onFieldValueChange$('orderProductRequests').subscribe((state) => {
    const { value } = state
    // const payInfoData = ctx.getFieldValue('paymentInformationResponses')
    // 强制渲染一次, 用于触发金额总数
    update()
    // // 已经存在数据 无需请求
    // if (payInfoData && payInfoData.length > 0) {

    // } else
    const orderModel = ctx.getFieldValue('orderModel')
    if (value && value.length > 0 && !state.loading) {
      // 添加loading判断避免二次调用
      // 请求一次并复制给支付信息
      const productItem = value[0]
      console.log(productItem, 'pitem')
      if (pageStatus === PageStatus.EDIT) {
        // 编辑下 支付信息联动实现
      } else if (
        pageStatus === PageStatus.ADD &&
        ctx.getFieldValue('orderModel') < OrderModalType.PURCHASE_ENQUIRY_CONTRACT_ORDER
      ) {
        // 新增下 需要支付信息生成支付次数 // @采购合同下单无需支付信息
        fetchOrderApi
          .getPayInfoList({
            productId:
              orderModel === OrderModalType['HAND_ORDER'] ||
              orderModel === OrderModalType['CHANNEL_DIRECT_MINING_ORDER'] ||
              orderModel === OrderModalType['CHANNEL_SPOT_MANUAL_ORDER']
                ? productItem.id
                : productItem.productId || productItem.id,
            memberId: productItem?.memberId || ctx.getFieldValue('supplyMembersId'),
            memberRoleId: productItem?.memberRoleId || ctx.getFieldValue('supplyMembersRoleId'),
            orderModel: orderModel,
            shopId: ctx.getFieldValue('shopId'),
          })
          .then((data) => {
            ctx.setFieldValue('paymentInformationResponses', data)
          })
          .catch((err) => {})
      }
    }

    // 确认后 需根据商品id请求会员折扣接口， 以及配送方式
    // 由于商品存在多个， 需对接口做一定缓存
    asyncPadDataForProduct(ctx, state)

    // 下单模式为合并订单 禁用编辑采购数量
    if (orderModel === OrderModalType['CONSOLIDATED_ORDER']) {
      const numberInputs = document.getElementsByClassName('purchase_amount_input')
      if (numberInputs?.length) {
        for (let i = 0; i < numberInputs.length; i++) {
          numberInputs[i].setAttribute('disabled', 'true')
        }
      }
    } else {
      const numberInputs = document.getElementsByClassName('purchase_amount_input')
      if (numberInputs?.length) {
        for (let i = 0; i < numberInputs.length; i++) {
          numberInputs[i].removeAttribute('disabled')
        }
      }
    }
  })
}

// 表单初始化时，对应操作
export const useOrderFormInitEffect = (ctx: ISchemaFormActions | ISchemaFormAsyncActions) => {
  const { modelType = 0, spam_id } = useQuery()
  const typeEnums = parseInt(modelType)
  const auth: any = authService.getAuth()
  FormEffectHooks.onFormMount$().subscribe(async () => {
    ctx.setFieldState('orderModel', (state) => {
      state.props.enum = state.props.enum
        .map((v) => {
          const assign: any = Object.assign({}, v)
          // 过滤服务提供者
          if (auth.memberRoleType === 2) {
            // 采购商
            // 企业+个人
            // if ((auth.memberType === 1 || auth.memberType === 2) && (assign.value > 9 && assign.value !== 24)) {
            if ((auth.memberType === 1 || auth.memberType === 2) && assign.value > 9 && assign.value < 30) {
              assign.disabled = true
            }
            // 渠道（企业+个人）
            if ((auth.memberType === 3 || auth.memberType === 4) && assign.value < 10) {
              assign.disabled = true
            }
            // 商城下单
            if (orderCombination.queryPageOrderModal.includes(assign.value) && typeEnums !== assign.value) {
              assign.disabled = true
            }
            // 禁用积分
            if (assign.value === 24 || assign.value === 25) {
              assign.disabled = true
            }
          } else {
            assign.disabled = true
          }

          // if (orderCombination.queryPageOrderModal.includes(assign.value) && typeEnums !== assign.value) {
          //   assign.disabled = true
          // }
          return assign
        })
        .sort((prev, next) => (prev.disabled ? prev.value : next.value - prev.value))
    })

    // query中存在modelType参数， 则是从其他页面跳转而来，需禁用其余query选项
    // 商城跳转过来的数据
    const initValue = getCookie(spam_id)

    // 从商城跳转，需回显数据
    if (initValue) {
      const fn = async (initValue) => {
        const productInfo = initValue.orderList[0].orderList
        ctx.setFieldValue('shopId', initValue.shopId)
        ctx.setFieldValue('supplyMembersId', initValue.supplyMembersId)
        ctx.setFieldValue('supplyMembersRoleId', initValue.supplyMembersRoleId)
        ctx.setFieldValue('supplyMembersName', initValue.supplyMembersName)
        initValue.idList && ctx.setFieldValue('idList', initValue.idList)
        initValue.productType && ctx.setFieldValue('productType', initValue.productType)
        ctx.setFieldValue(
          'orderProductRequests',
          await filterProductDataById(
            [],
            productInfo.map((v) => {
              return {
                ...v,
                unitPrice: v.priceRange.reduce((prev, next) => {
                  prev[next.range] = next.price
                  return prev
                }, {}),
                isMemberPrice: v.isMemberPrice,
                purchaseCount: v.count,
                // money: v.memberDiscount ? (v.count*1000 * v.unitPrice*100 * v.memberDiscount*100)/10000000 : (v.count*1000 * v.unitPrice*100)/100000,
                money: (v.count * 1000 * v.unitPrice * 100) / 100000,
                productId: v.id,
                channelProductId: v.channelProductId,
                memberId: initValue.supplyMembersId, // 添加 memberId, memberRoleId 字段
                memberRoleId: initValue.supplyMembersRoleId,
                commodityId: v.id, // 添加commodityId用于判断是商品价格是使用price字段还是unitPrice字段（也可判断是报价订单还是其他）
                memberPrice: v.memberDiscount !== 1 ? v.memberDiscount : 1, // 添加会员折扣
                name: v.attribute?.length
                  ? v.name + '/' + v.attribute.map((item) => item.customerAttributeValue.value).join('/')
                  : v.name,
              }
            }),
          ),
        )
      }

      // 回显的数据保存在表单中， 当切换下单模式时，可以再次回显
      ctx.setFieldState('orderModel', (state) => {
        state.remoteDataFn = fn
      })
      // ctx.setFormState(state => {
      //   state.remoteDataFn = fn
      // })
      console.log(initValue, 'initValue')
      fn(initValue)
    }

    // 写入收货地址数据
    useProductAddress(ctx)
  })

  FormEffectHooks.onFieldValueChange$('needTheInvoice').subscribe((state) => {
    if (state.value) {
      useInvoiceList(ctx)
    }
  })

  // 查询商品对应的工作流 获取电子合同
  FormEffectHooks.onFieldValueChange$('orderProductRequests').subscribe((state) => {
    if (state.value?.length && state.loading) {
      useElectronicContract(ctx)
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

// 查询工作流获取电子合同
export const useElectronicContract = (ctx: ISchemaFormActions | ISchemaFormAsyncActions) => {
  const params: any = {}
  // 通过下单模式 判断是手工还是询需报价
  params['productId'] =
    ctx.getFieldValue('orderModel') === OrderModalType['HAND_ORDER']
      ? ctx.getFieldValue('orderProductRequests')[0]['id']
      : ctx.getFieldValue('orderProductRequests')[0]['productId']
  params['orderModelId'] = ctx.getFieldValue('orderModel')
  params['memberId'] = ctx.getFieldValue('supplyMembersId')
  params['memberRoleId'] = ctx.getFieldValue('supplyMembersRoleId')

  if (params['memberId'] && params['memberRoleId']) {
    fetchOrderApi.getOrderWorkFlow(params).then((data) => {
      // 简单流程并使用电子合同 强行启用电子合同
      if (data['processEnum'] === 24 && data['isElectronicContract']) {
        ctx.setFieldValue('usingElectronicContracts', 1)
        ctx.setFieldValue('electronicContractId', data['electronicContractId'])
        ctx.setFieldValue('processEnum', data['processEnum'])
      } else {
        ctx.setFieldValue('usingElectronicContracts', 0)
        ctx.setFieldValue('electronicContractId', null)
        ctx.setFieldValue('processEnum', data['processEnum'])
      }
    })
  }
}

// // 编辑订单 地址和发票变动 触发订单更新
export const useOrderUpdateChangeOther = (ctx: ISchemaFormActions | ISchemaFormAsyncActions) => {
  const { pageStatus, id } = usePageStatus()

  FormEffectHooks.onFieldValueChange$('theInvoiceId').subscribe((state) => {
    const { value, path } = state
    // console.log(state, '发票之前')
    if (pageStatus === PageStatus.EDIT) {
      if (state?.dataSource?.length && state.loading && state.props['x-component-props'].times > 2) {
        ctx.submit((values) => {
          console.log(values, value, path, state, '发票id')
          // if(values){
          //   postOrderProcurementOrderUpdate({
          //     ...values,
          //     deliveryTime: moment(values.deliveryTime).valueOf(),
          //     theInvoiceId: value?.id || null,
          //     needTheInvoice: Number(values.needTheInvoice),
          //     deliveryAddresId: values.deliveryAddresId,
          //     id,
          //   }, { ctlType: "none" })
          // }
        })
      } else {
        ctx.setFieldState(path, (_state) => {
          _state.loading = true
          _state.props['x-component-props'].times++
        })
      }
    }
  })

  FormEffectHooks.onFieldValueChange$('deliveryAddresId').subscribe((state) => {
    const { value, path } = state
    if (pageStatus === PageStatus.EDIT) {
      if (state?.dataSource?.length && state.loading && state.props['x-component-props'].times > 2) {
        ctx.submit((values) => {
          console.log(values, value, path, '发货地址id')
          if (values) {
            // postOrderProcurementOrderUpdate({
            //   ...values,
            //   deliveryTime: moment(values.deliveryTime).valueOf(),
            //   theInvoiceId: values.theInvoiceId,
            //   needTheInvoice: Number(values.needTheInvoice),
            //   deliveryAddresId: value?.id ? value.id : value,
            //   id,
            // }, { ctlType: "none" })
          }
        })
      } else {
        ctx.setFieldState(path, (_state) => {
          _state.loading = true
          _state.props['x-component-props'].times++
        })
      }
    }
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
    // getProductSelectGetMemberCategory(params).then(res => {
    getProductCustomerGetMemberCustomerCategoryTree(params).then((res) => {
      mctx.setFieldState(fieldName, (state) => {
        state.props['x-component-props'].dataoption = res.data
      })
    })
  })
}
