/**
 * @Description 会员详情context，主要用于会员管理-会员详情、会员查询-会员详情下
 */
import * as React from 'react'
import { GetMemberCustomerAbilityMaintenanceDetailBasicResponse } from '@apps/apis'
import { AnchorsItem } from '@/components/AnchorPage'

export type MemberDetails = GetMemberCustomerAbilityMaintenanceDetailBasicResponse & {}

export interface MemberDetailsContextProps {
  /**
   * 详情信息
   */
  details: MemberDetails
  /**
   * 重新详情信息，用于某些修改请求的操作需要重现获取信息
   */
  refreshDetails?: () => void
  /**
   * 锚点数据
   */
  onAnchorsReady: (anchores: { label: string; key: string }[]) => void
}

const MemberDetailsContext = React.createContext<MemberDetailsContextProps | null>(null)

export const MemberDetailsContextProvider = MemberDetailsContext.Provider

export default MemberDetailsContext
