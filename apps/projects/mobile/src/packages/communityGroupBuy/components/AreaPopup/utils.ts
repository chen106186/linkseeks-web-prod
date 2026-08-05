import { setAsyncStorage, getAsyncStorage } from '@apps/mobile-services/utils/storage'
import { AREA_SELECT_RESULT } from '@/constants/storage'

export type ActionType = 'address' | 'areaIndexes'

export type StockDataType = {
  type: ActionType
  [key: string]: any
}

export function setStockStorage(type: ActionType, data: any) {
  setAsyncStorage(AREA_SELECT_RESULT, {
    type,
    ...data,
  })
}

export async function getStockStorage(): Promise<StockDataType> {
  return (await getAsyncStorage(AREA_SELECT_RESULT)) as StockDataType
}
