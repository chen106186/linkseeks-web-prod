import React, { createContext, useContext, useEffect, useState } from 'react'
import { ApplyStateType } from '@/types/global'
import { getMemberAbilityInfoApplyCondition } from '@apps/apis'
import { useGlobalConext } from './globalProvider'

export interface StoreState {
  collectState?: boolean
  applyState: ApplyStateType | undefined
  updateApplyState: () => void
  updatecollectState?: (state: boolean) => void
}

export const StoreContext = createContext<StoreState | undefined>(undefined)

/** 获取会员在店铺会员信息 */
export const useInitStore = () => {
  const { shopInfo, mallInfo, userInfo } = useGlobalConext()
  const [applyState, setApplyState] = useState<ApplyStateType>()
  const [collectState, setCollectState] = useState<boolean>(false)

  const fetchMemberApplyCondition = () => {
    const param = {
      shopType: String(mallInfo?.type),
      upperMemberId: String(shopInfo?.memberId),
      upperRoleId: String(shopInfo?.roleId),
    }
    getMemberAbilityInfoApplyCondition(param).then((res) => {
      if (res.code === 1000) {
        setApplyState(res.data)
      }
    })
  }

  const updateApplyState = () => {
    fetchMemberApplyCondition()
  }

  useEffect(() => {
    if (userInfo) {
      fetchMemberApplyCondition()
    }
  }, [userInfo])

  useEffect(() => {
    if (shopInfo) {
      setCollectState(shopInfo.collectStatus)
    }
  }, [shopInfo])

  const updatecollectState = (state) => {
    setCollectState(state)
  }

  return {
    collectState,
    applyState,
    updateApplyState,
    updatecollectState,
  }
}

export const useStoreContext = () => {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStoreContext must be used within a StoreProvider')
  }
  return context
}

export const StoreProvider = ({ children, value }: { children: React.ReactNode; value: StoreState }) => {
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
