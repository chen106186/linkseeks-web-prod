import React, { useState, useEffect } from 'react'
export interface UseCountDownProps {
  maxTime: number
  minTime: number
  initText: React.ReactNode
  delay: number
  onEnd(): void
  decayRate: number
}

export interface ReturnValue {
  start(): void
  text: React.ReactNode
  isActive: boolean
}

const useCountDown = (options: UseCountDownProps): ReturnValue => {
  const [activeText, setActiveText] = useState(options.initText)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const {
      maxTime = 60,
      minTime = 0,
      initText = '获取验证码',
      delay = 1 * 1000,
      onEnd = () => {},
      decayRate = 1,
    } = options
    let activeInterval: any = null
    let activeTime = maxTime
    if (isOpen) {
      activeInterval = setInterval(() => {
        if (activeTime === minTime) {
          setActiveText(initText)
          setIsOpen(false)
          clearInterval(activeInterval)
          onEnd && onEnd()
        } else {
          setActiveText((activeTime -= decayRate) + 's')
        }
      }, delay)
    }
    return () => {
      clearInterval(activeInterval)
    }
  }, [isOpen])

  function start() {
    if (isOpen) {
      return false
    }
    setIsOpen(true)
    setActiveText(options.maxTime + 's')
  }
  return {
    start,
    text: activeText,
    isActive: isOpen,
  }
}

export default useCountDown
