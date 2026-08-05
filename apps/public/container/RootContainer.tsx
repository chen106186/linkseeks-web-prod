import { getEnv } from '@apps/utils'
import { authService } from '@apps/services'
import React, { ReactNode, FC, createContext, useContext, useEffect, useState } from 'react'

export interface RootContainerProps {
  container: ReactNode
  providerCounter?: number
}

type WsMessage = {
  action: 'msg_no_read_message' | 'purchase_bidding_message_supplier' | 'purchase_bidding_message' | 'msg_im_message'
  /**
   * 信息数
   */
  data: string | any
  /**
   * 假设 memberId: 2 memberRoleId: 3, 那么 receiver： *:2:3
   */
  receiver: string
  /**
   * 发送者
   */
  sender: string
  timestamp: number
}

export interface GlobalContextProps {
  // appLoading: boolean
  // incrementCounter(): void
  avatar: string
  setAvatar(avatar: string): void
  siteId: number
  siteUrl: string
  purchaseBiddingMessage: WsMessage | undefined
  setPurchaseBiddingMessage(purchaseBiddingMessage: WsMessage): void
  purchaseBiddingMessageSupplier: WsMessage | undefined
  setPurchaseBiddingMessageSupplier(purchaseBiddingMessageSupplier: WsMessage): void
}
const Loading = () => <div>loading</div>

const GlobalContext = createContext<GlobalContextProps>({} as any)

export const useGlobal = () => useContext(GlobalContext)

export const RootContainer = (props: RootContainerProps) => {
  const { container } = props
  const auth = authService.getAuth()
  // 用户头像
  const [avatar, setAvatar] = useState(auth?.logo || '')
  const [purchaseBiddingMessage, setPurchaseBiddingMessage] = useState<WsMessage>()
  const [purchaseBiddingMessageSupplier, setPurchaseBiddingMessageSupplier] = useState<WsMessage>()
  // const [appLoading, setAppLoading] = useState(true)
  // const [incrementCounter, setIncrementCounter] = useState(0)

  // useEffect(() => {
  //   if (incrementCounter === providerCounter) {
  //     setAppLoading(false)
  //   }
  // }, [incrementCounter])

  const value: GlobalContextProps = {
    avatar,
    setAvatar,
    siteId: import.meta.env.OUT_SITEID,
    siteUrl: getEnv('SITE_URL'),
    purchaseBiddingMessage,
    setPurchaseBiddingMessage,
    purchaseBiddingMessageSupplier,
    setPurchaseBiddingMessageSupplier,
    // appLoading,
    // incrementCounter() {
    //   setIncrementCounter((i) => i + 1)
    // },
  }

  return <GlobalContext.Provider value={value}>{container}</GlobalContext.Provider>
}
