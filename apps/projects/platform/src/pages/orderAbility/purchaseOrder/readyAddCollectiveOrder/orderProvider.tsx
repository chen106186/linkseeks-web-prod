import { Dispatch, MutableRefObject, SetStateAction, useContext } from 'react'
import { FormInstance } from 'antd'
import { createContext } from 'react'
import { GetProductSelectGetWarehouseResponse, GetOrderCollectiveDetailResponse } from '@apps/apis'
import { ProductItemType } from './components/orderProducts'
import { ActionType } from '@apps/components'

export type OrderContextProps = {
  productsRef: MutableRefObject<ActionType>
  form: FormInstance<any>
  skuList: ProductItemType[]
  warehouseOptions: GetProductSelectGetWarehouseResponse
  orderDetail: GetOrderCollectiveDetailResponse
  sourceType: number
  setSourceType: Dispatch<SetStateAction<number>>
  getQuoteOrderInfo: (id: number) => void
}

const OrderContext = createContext<OrderContextProps>({} as any)

export const useOrder = () => useContext(OrderContext)

export const OrderProvider = ({ children, value }) => {
  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}
