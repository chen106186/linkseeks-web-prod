import {
  getOrderBuyerCreatePageItems,
  getOrderBuyerPageItems,
  GetOrderBuyerPageItemsResponse,
  getOrderBuyerTakePageItems,
  getOrderBuyerValidatePageItems,
  getOrderVendorPageItems,
  getOrderVendorTakePageItems,
  getOrderVendorValidatePageItems,
  getOrderVendorOrderTypeAll,
  getOrderBuyerOrderTypeAll,
} from '@apps/apis'
import { getProductSelectGetSelectCategory } from '@apps/apis'
import { getProductMaterialGroupTree } from '@apps/apis'
import { getPurchaseRequisitionFindInnerStatusEnum } from '@apps/apis'
import { useEffect, useState } from 'react'

// 高级筛选schema中用于输入搜索需求发布品类的Effect
export const searchSelectGetSelectCategoryOptionEffect = (context: any, fieldName: string) => {
  context.getFieldState(fieldName, (state) => {
    getProductSelectGetSelectCategory({ name: state.props['x-component-props'].searchValue }).then((res) => {
      context.setFieldState(fieldName, (state) => {
        state.props['x-component-props'].dataoption = res.data
      })
    })
  })
}

/** 订单状态逻辑复用 */
interface IState {
  status: number
  name: string
}

/** 获取 采购订单查询 下拉项：订单类型、内部状态、外部状态 */
export const getPurchaseOrderSelectOption = () => {
  const [state, setstate] = useState<GetOrderBuyerPageItemsResponse>()

  useEffect(() => {
    getOrderBuyerPageItems({}).then((res) => {
      const { code, data } = res
      if (code === 1000) {
        setstate(data)
      }
    })
  }, [])

  return state
}

/** 获取 销售订单查询 下拉项：订单类型、内部状态、外部状态 */
export const getSaleOrderSelectOption = () => {
  const [state, setstate] = useState<any>()

  useEffect(() => {
    getOrderVendorPageItems({}).then((res) => {
      const { code, data } = res
      if (code === 1000) {
        setstate(data)
      }
    })
  }, [])

  return state
}

/** （采购订单审核各个页面）获取前端页面下拉框列表 */
export const getPurchaseOrderAuditPageSelectOption = () => {
  const [state, setstate] = useState<any>()

  useEffect(() => {
    getOrderBuyerValidatePageItems({}).then((res) => {
      const { code, data } = res
      if (code === 1000) {
        setstate(data)
      }
    })
  }, [])

  return state
}

/** （销售订单审核各个页面）获取前端页面下拉框列表 */
export const getSaleOrderAuditPageSelectOption = () => {
  const [state, setstate] = useState<any>()

  useEffect(() => {
    getOrderVendorValidatePageItems({}).then((res) => {
      const { code, data } = res
      if (code === 1000) {
        setstate(data)
      }
    })
  }, [])

  return state
}

/** （采购订单-待新增订单）获取前端页面下拉框列表 */
export const getPurchaseOrderReadyAddPageSelectOption = () => {
  const [state, setstate] = useState<any>()

  useEffect(() => {
    getOrderBuyerCreatePageItems({}).then((res) => {
      const { code, data } = res
      if (code === 1000) {
        setstate(data)
      }
    })
  }, [])

  return state
}

/** （采购待分配订单查询）获取前端页面下拉框列表 */
export const getPurchaseOrderReadyDistributionPageSelectOption = () => {
  const [state, setstate] = useState<any>()

  useEffect(() => {
    getOrderBuyerTakePageItems({}).then((res) => {
      const { code, data } = res
      if (code === 1000) {
        setstate(data)
      }
    })
  }, [])

  return state
}

/** （销售待分配订单查询）获取前端页面下拉框列表 */
export const getSaleOrderReadyDistributionPageSelectOption = () => {
  const [state, setstate] = useState<any>()

  useEffect(() => {
    getOrderVendorTakePageItems({}).then((res) => {
      const { code, data } = res
      if (code === 1000) {
        setstate(data)
      }
    })
  }, [])

  return state
}

/** 销售订单 通用 订单类型下拉框列表 */
export const getSaleOrderPublicUsePageSelectOption = () => {
  const [state, setstate] = useState<any>([])

  useEffect(() => {
    getOrderVendorOrderTypeAll({}).then((res) => {
      const { code, data } = res
      if (code === 1000) {
        setstate(data)
      }
    })
  }, [])

  return state
}

/** 采购订单 通用 订单类型下拉框列表 */
export const getPurchaseOrderPublicUsePageSelectOption = () => {
  const [state, setstate] = useState<any>([])

  useEffect(() => {
    getOrderBuyerOrderTypeAll({}).then((res) => {
      const { code, data } = res
      if (code === 1000) {
        setstate(data)
      }
    })
  }, [])

  return state
}

export const searchCustomerMaterialGroupOptionEffect = (context: any, fieldName: string) => {
  context.getFieldState(fieldName, (state) => {
    getProductMaterialGroupTree().then((res) => {
      context.setFieldState(fieldName, (state) => {
        state.props['x-component-props'].dataoption = res.data
      })
    })
  })
}
