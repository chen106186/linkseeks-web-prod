import { setAsyncStorage, getAsyncStorage } from '@apps/mobile-services/utils/storage'
import { STOCK } from '@/constants/storage'

export type ActionType = 'address' | 'areaIndexes'

export type StockDataType = {
  type: ActionType
  [key: string]: any
}

export function setStockStorage(type: ActionType, data: any) {
  setAsyncStorage(STOCK, {
    type,
    ...data,
  })
}

export async function getStockStorage(): Promise<StockDataType> {
  return (await getAsyncStorage(STOCK)) as StockDataType
}
