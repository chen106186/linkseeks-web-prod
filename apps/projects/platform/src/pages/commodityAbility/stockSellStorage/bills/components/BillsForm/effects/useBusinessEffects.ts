/*
 * @Author: XieZhiXiong
 * @Date: 2020-09-16 15:16:47
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 20:30:16
 * @Description: 联动逻辑相关
 */
import { FormEffectHooks, FormPath } from '@apps/formily'
import { useLinkageUtils } from '@/utils/formEffectUtils'
import { useStateFilterSearchLinkageEffect } from '@/formSchema/effects/useFilterSearch'
import {
  DEPENDENT_DOC_INTERNAL,
  DOC_TYPE_PURCHASE_RECEIPT,
  DOC_TYPE_SALES_INVOICE,
  DOC_TYPE_PROCESS_RECEIPT,
  DOC_TYPE_PROCESS_INVOICE,
  DOC_TYPE_RETURN_INVOICE,
  DOC_TYPE_RETURN_RECEIPT,
  DOC_TYPE_EXCHANGE_INVOICE,
  DOC_TYPE_EXCHANGE_RECEIPT,
  DOC_TYPE_EXCHANGE_RETURN_INVOICE,
  DOC_TYPE_EXCHANGE_RETURN_RECEIPT,
} from '@/constants/commodity'
import Search from '@/components/NiceForm/components/Search'
import Submit from '@/components/NiceForm/components/Submit'
import DateSelect from '@/components/NiceForm/components/DateSelect'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import {
  purchaseOrderBillSchema,
  machiningWarehousingBillSchema,
  machiningDeliveryBillSchema,
  afterSaleBillSchema,
} from '../schema'
import {
  purchaseOrderColumns,
  salesOrderColumns,
  machiningWarehousingColumns,
  machiningDeliveryColumns,
  getAfterSaleColumns,
} from '../columns'
import {
  fetchOrderPurchaseReceiptAddList,
  getOrderSalesInvoiceOrderList,
  getMachiningWarehousingList,
  getMachiningDeliveryList,
  getRefundDeliveryList,
  getRefundWarehousingList,
  getExchangeReturnDeliveryList,
  getExchangeReturnWarehousingList,
  getExchangeDeliveryList,
  getExchangeWarehousingList,
} from '../fetchBillList'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()
const { onFieldInputChange$, onFieldValueChange$ } = FormEffectHooks

// 获取关联组件对应的 params
const getParams = (type) => {
  const basicParams = {
    modalProps: {
      title: intl.formatMessage({ id: 'stockSellStorage.biaoti' }),
    },
    columns: [],
    fetchTableData: undefined,
    formilyProps: {
      ctx: {
        schema: {},
        components: {
          Search,
          Submit,
          DateSelect,
        },
        effects: ($, actions) => {
          useStateFilterSearchLinkageEffect($, actions, 'search', FORM_FILTER_PATH)
        },
        inline: false,
      },
    },
    tableProps: {
      rowKey: 'orderNo',
      lableKey: 'orderNo',
    },
  }

  switch (type) {
    // 采购入库单
    case DOC_TYPE_PURCHASE_RECEIPT: {
      basicParams.modalProps.title = intl.formatMessage({ id: 'stockSellStorage.xuanzedingdan' })
      basicParams.columns = purchaseOrderColumns
      basicParams.fetchTableData = fetchOrderPurchaseReceiptAddList
      basicParams.formilyProps.ctx.schema = purchaseOrderBillSchema
      break
    }

    // 销售发货单
    case DOC_TYPE_SALES_INVOICE: {
      basicParams.modalProps.title = intl.formatMessage({ id: 'stockSellStorage.xuanzedingdan' })
      basicParams.columns = salesOrderColumns
      basicParams.fetchTableData = getOrderSalesInvoiceOrderList
      basicParams.formilyProps.ctx.schema = purchaseOrderBillSchema // 这里用同一个 schema 是因为接口参数名是一样的，后台做了处理
      break
    }

    // 加工入库单
    case DOC_TYPE_PROCESS_RECEIPT: {
      basicParams.modalProps.title = intl.formatMessage({ id: 'stockSellStorage.xuanzeshengchantongzhidan' })
      basicParams.columns = machiningWarehousingColumns
      basicParams.fetchTableData = getMachiningWarehousingList
      basicParams.formilyProps.ctx.schema = machiningWarehousingBillSchema
      break
    }

    // 加工发货单
    case DOC_TYPE_PROCESS_INVOICE: {
      basicParams.modalProps.title = intl.formatMessage({ id: 'stockSellStorage.xuanzeshengchantongzhidan' })
      basicParams.columns = machiningDeliveryColumns
      basicParams.fetchTableData = getMachiningDeliveryList
      basicParams.formilyProps.ctx.schema = machiningDeliveryBillSchema
      break
    }

    // 退货发货单
    case DOC_TYPE_RETURN_INVOICE: {
      basicParams.modalProps.title = intl.formatMessage({ id: 'stockSellStorage.xuanzeshouhoudan' })
      basicParams.columns = getAfterSaleColumns(true)
      basicParams.fetchTableData = getRefundDeliveryList
      basicParams.formilyProps.ctx.schema = afterSaleBillSchema(true)
      break
    }

    // 退货入库单
    case DOC_TYPE_RETURN_RECEIPT: {
      basicParams.modalProps.title = intl.formatMessage({ id: 'stockSellStorage.xuanzeshouhoudan' })
      basicParams.columns = getAfterSaleColumns(false)
      basicParams.fetchTableData = getRefundWarehousingList
      basicParams.formilyProps.ctx.schema = afterSaleBillSchema(false)
      break
    }

    // 换货退货发货单
    case DOC_TYPE_EXCHANGE_RETURN_INVOICE: {
      basicParams.modalProps.title = intl.formatMessage({ id: 'stockSellStorage.xuanzeshouhoudan' })
      basicParams.columns = getAfterSaleColumns(true)
      basicParams.fetchTableData = getExchangeReturnDeliveryList
      basicParams.formilyProps.ctx.schema = afterSaleBillSchema(true)
      break
    }

    // 换货退货入库单
    case DOC_TYPE_EXCHANGE_RETURN_RECEIPT: {
      basicParams.modalProps.title = intl.formatMessage({ id: 'stockSellStorage.xuanzeshouhoudan' })
      basicParams.columns = getAfterSaleColumns(false)
      basicParams.fetchTableData = getExchangeReturnWarehousingList
      basicParams.formilyProps.ctx.schema = afterSaleBillSchema(false)
      break
    }

    // 换货发货单
    case DOC_TYPE_EXCHANGE_INVOICE: {
      basicParams.modalProps.title = intl.formatMessage({ id: 'stockSellStorage.xuanzeshouhoudan' })
      basicParams.columns = getAfterSaleColumns(true)
      basicParams.fetchTableData = getExchangeDeliveryList
      basicParams.formilyProps.ctx.schema = afterSaleBillSchema(true)
      break
    }

    // 换货入库单
    case DOC_TYPE_EXCHANGE_RECEIPT: {
      basicParams.modalProps.title = intl.formatMessage({ id: 'stockSellStorage.xuanzeshouhoudan' })
      basicParams.columns = getAfterSaleColumns(false)
      basicParams.fetchTableData = getExchangeWarehousingList
      basicParams.formilyProps.ctx.schema = afterSaleBillSchema(false)
      break
    }

    default:
      break
  }

  return basicParams
}

export const useBusinessEffects = (context, actions) => {
  const { getFieldValue, setFieldValue, getFieldState, setFieldState } = actions
  const linkage = useLinkageUtils()

  // 根据 单据类型 联动 对应单据所选项
  onFieldInputChange$('invoicesTypeId').subscribe(() => {
    const invoicesDetailsRequestsVal = getFieldValue('invoicesDetailsDTOList')
    if (invoicesDetailsRequestsVal && invoicesDetailsRequestsVal.length) {
      linkage.value('invoicesDetailsDTOList', [])
    }

    const orderNoVal = getFieldValue('orderNo')
    if (orderNoVal && orderNoVal.length) {
      linkage.value('orderNo', [])
    }
  })

  // 根据 单据类型 联动 对应单据所选项
  onFieldValueChange$('invoicesTypeId').subscribe((fieldState) => {
    const { originAsyncData = [] } = fieldState
    const current = originAsyncData.find((item) => item.id === fieldState.value)
    // const params = getParams(fieldState.value);

    if (current) {
      linkage.value('invoicesTypeCode', current.number)
      linkage.value('direction', current.direction)
    }
    // linkage.componentProps('orderNo', params);
  })

  // 根据 单据类型 联动 对应单据所选项
  context('requestAsyncSelect').subscribe((fieldState) => {
    if (fieldState.name === 'invoicesTypeId') {
      const invoicesTypeIdState = getFieldState('invoicesTypeId')

      if (invoicesTypeIdState.value) {
        const current = invoicesTypeIdState.originAsyncData.find((item) => item.id === invoicesTypeIdState.value)

        if (current) {
          linkage.value('invoicesTypeCode', current.number)
        }
      }
    }
  })

  // 对应仓库改变
  onFieldInputChange$('warehouseId').subscribe((fieldState) => {
    console.log('🚀 ~ file: useBusinessEffects.ts ~ line 316 ~ useBusinessEffects ~ fieldState', fieldState)
    const current = fieldState.originAsyncData.find((item) => item.id === fieldState.value)
    console.log('🚀 ~ file: useBusinessEffects.ts ~ line 317 ~ useBusinessEffects ~ current', current)
    if (current) {
      linkage.value('warehouseRole', current.principal)
    }
  })

  // 关联明细
  onFieldValueChange$('invoicesDetailsDTOList').subscribe((fieldState) => {
    const { value } = fieldState

    if (!value.length) {
      // 明细数据为空，或者明细每项数据的 商品 未选，物流方式都设置成 ''
      setFieldValue('transport', '')
      setFieldValue('deliveryType', null)
    }
  })

  // 关联明细 商品数量 联动计算商品金额
  onFieldInputChange$('invoicesDetailsDTOList.*.invoicesCount').subscribe((fieldState) => {
    const { name, value } = fieldState

    const costPriceValue = getFieldState(
      FormPath.transform(name, /\d/, ($1) => {
        return `invoicesDetailsDTOList.${$1}.costPrice`
      }),
      (state) => state.value,
    )
    // 内部单据 单据金额为 成本价 * 单据数量
    setFieldState(
      FormPath.transform(name, /\d/, ($1) => {
        return `invoicesDetailsDTOList.${$1}.totalPrice`
      }),
      (state) => {
        state.value = costPriceValue
          ? `${intl.formatMessage({ id: 'common.money' })}${(+value * costPriceValue).toFixed(2)}`
          : null
      },
    )
  })

  // 对应单据改变
  onFieldValueChange$('relevanceInvoices').subscribe((fieldState) => {
    const { value } = fieldState

    // 对应单据等于内部单据
    // formily 的 bug，设置了 display 为 false，该列还是会展示在页面中
    // 所以把title设置
    if (value === DEPENDENT_DOC_INTERNAL) {
      linkage.display('*(orderNo,memberName,address,transport)', false)
      linkage.display('invoicesDetailsDTOList.*.*(product,productId,price)', false)
    } else {
      linkage.display('*(orderNo,memberName,address,transport)')
      linkage.display('invoicesDetailsDTOList.*.*(product,productId,price)')
    }
  })
}
