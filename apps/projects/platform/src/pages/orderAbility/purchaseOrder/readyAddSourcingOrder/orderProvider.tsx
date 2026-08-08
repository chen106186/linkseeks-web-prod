import { useContext } from 'react'
import { FormInstance } from 'antd'
import { createContext } from 'react'
import { GetProductSelectGetWarehouseResponse, GetOrderBuyerDetailResponse } from '@apps/apis'
import { ProductItemType } from './components/orderProducts'

export type OrderContextProps = {
  form: FormInstance<any>
  skuList: ProductItemType[]
  warehouseOptions: GetProductSelectGetWarehouseResponse
  orderDetail: GetOrderBuyerDetailResponse
  getQuoteOrderInfo: (id: number) => void
}

const OrderContext = createContext<OrderContextProps>({} as any)

export const useOrder = () => useContext(OrderContext)

export const OrderProvider = ({ children, value }) => {
  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}
