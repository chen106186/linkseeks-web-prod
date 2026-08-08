import { createContext } from 'react';

/** 详情 */
export const Context = createContext<any>({})

/**招标详情 Context */
export const BidDetailContext = createContext<any>({})

/**采购竞价单详情 Context */
export const PurchaseBidContext = createContext<any>({})

/** 营销活动 */
export const EditableContext = createContext(null);
