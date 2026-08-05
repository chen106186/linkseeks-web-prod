import { useEffect, useState } from 'react'
import { IMMESSAGE } from './messageFactory/common'
import { MessageFactory } from './messageFactory'

export const useMessageHistory = () => {
  const [messages, setMessages] = useState<IMMESSAGE[]>([])

  useEffect(() => {
    // 自动加载历史消息
    loadHistoryMessages()
  }, [])

  const loadHistoryMessages = () => {
    const history = [
      MessageFactory.createMessage('text', 'Michael', new Date().getTime(), 'hello1'),
      MessageFactory.createMessage('text', 'Michael', new Date().getTime(), 'hello2'),
      MessageFactory.createMessage('text', 'Michael', new Date().getTime(), 'hello3'),
      MessageFactory.createMessage('text', 'Michael', new Date().getTime(), 'hello4'),
      MessageFactory.createMessage('text', 'Michael', new Date().getTime(), 'hello5'),
      MessageFactory.createMessage('text', 'Bob', new Date().getTime(), 'hello6'),
    ]

    setMessages(history)
  }

  const appendMessage = (message: IMMESSAGE) => {
    setMessages((prev) => [...prev, message])
  }

  return {
    messages,
    appendMessage,
  }
}
