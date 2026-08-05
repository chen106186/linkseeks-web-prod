import { createContext } from 'react'

// 招标详情 Context
export const BidDetailContext = createContext<any>({})

// 待新增招标 详情
export const ReadyAddBidDetailContext = createContext<any>({})

// 专家评标详情
export const RemarkDetailContext = createContext<any>({})

// 待提交评标报告详情
export const ReportDetailContext = createContext<any>({})

// 待定标（审核定标、确认定标）详情
export const ReadyConfirmBidContext = createContext<any>({})

// 待发中标公示
export const ReadySendBidNoticeContext = createContext<any>({})
