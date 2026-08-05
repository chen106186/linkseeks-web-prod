import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useMessageHistory } from '../useMessageHistory'
import { MessageFactory } from '../messageFactory'
import { useToggle } from '@linkseeks/hooks'
import TencentCloudChat from '@tencentcloud/chat'
import { chat } from '../IMSDK'
const OWNER_NAME = 'Michael'
/**
 * 初始化整个状态内容
 */
const initContextChatRoomDispatch = () => {
  const { messages, appendMessage } = useMessageHistory()
  const [inputValue, setInputValue] = useState('')
  const chatEndRef = useRef<any>(null) // 用于滚动到底部
  const [isReady, toggleIsReady] = useToggle()

  // 当新消息加入时，自动滚动到底部
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleInputChange = (value: string) => {
    setInputValue(value)
  }
  const isOwner = (sender: string) => {
    return sender === OWNER_NAME
  }

  // 发送文本消息
  const sendTextMessage = () => {
    if (inputValue.length === 0) {
      return
    }

    const message = MessageFactory.createMessage('text', OWNER_NAME, MessageFactory.getNowTime(), inputValue)

    appendMessage(message)
    setInputValue('')
  }

  return {
    isReady,
    messages,
    isOwner,
    inputValue,
    handleInputChange,
    setInputValue,
    sendTextMessage,
    chatEndRef,
  }
}

export type InitContextChatRoomProps = ReturnType<typeof initContextChatRoomDispatch>

const InitContextChatRoomContainer = createContext<InitContextChatRoomProps>({} as InitContextChatRoomProps)

export const useInitContextChatRoom = () => {
  return useContext(InitContextChatRoomContainer)
}

export const InitContextChatRoomProvider = ({ children }) => {
  const value = initContextChatRoomDispatch()

  return <InitContextChatRoomContainer.Provider value={value}>{children}</InitContextChatRoomContainer.Provider>
}
