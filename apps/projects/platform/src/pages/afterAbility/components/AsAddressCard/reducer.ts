import { Reducer } from 'react'

export type AsAddressType = {
  /**
   * 地址id
   */
  id: number
  /**
   * 姓名
   */
  name: string
  /**
   * 联系电话
   */
  phone: string
  /**
   * 详细地址
   */
  detailed: string
}

export type AsAddressValue = {
  /**
   * 配送方式
   */
  deliveryType: number
  /**
   * 发货地址
   */
  deliveryAddress: AsAddressType | null
  /**
   * 收货地址
   */
  shippingAddress: AsAddressType | null
}

export const initialState: AsAddressValue = {
  deliveryType: undefined,
  deliveryAddress: null,
  shippingAddress: null,
}

type ReducerActionType = {
  /**
   * 类型
   */
  type: string
  /**
   * 额外的参数
   */
  payload: Partial<AsAddressValue>
}

export const reducer: Reducer<AsAddressValue, ReducerActionType> = (
  state: AsAddressValue,
  action: ReducerActionType,
) => {
  switch (action.type) {
    case 'setAsAddress':
      return { ...state, ...action.payload }
    default:
      throw new Error()
  }
}
