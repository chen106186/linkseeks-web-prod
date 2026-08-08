import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Input as GInput, Text, View } from '@apps/mobile-ui'
import styles from './index.module.scss'

interface Iprops {
  initialCount?: number
  beforeGetCode?: null | (() => void)
  render: (count: number) => React.ReactNode
  send?: boolean
  showState?: boolean
  className?: string
}

const Capture: React.FC<Iprops> = (props: Iprops) => {
  const { initialCount, beforeGetCode, className, render, send, showState } = props
  const [count, setCount] = useState(0)
  const ref = useRef<null | ReturnType<typeof setInterval>>(null)
  useEffect(() => {
    if (send && showState) {
      console.log('立即发送')
      handleClick()
    }
  }, [showState])

  useEffect(
    () => () => {
      clearInterval(ref.current as ReturnType<typeof setInterval>)
    },
    [],
  )

  useEffect(() => {
    if (count === (initialCount as number) - 1) {
      ref.current = setInterval(() => {
        setCount((prev) => prev - 1)
      }, 1000)
    } else if (count <= 0) {
      clearInterval(ref.current as ReturnType<typeof setInterval>)
    }
  }, [count])

  const handleClick = useCallback(() => {
    // count !== 0
    setCount((initialCount as number) - 1)
    if (beforeGetCode) {
      beforeGetCode()
    }
  }, [beforeGetCode, initialCount])

  return (
    <View className={className} onClick={count <= 0 ? handleClick : () => {}}>
      {render(count)}
    </View>
  )
}

interface CaptureInputProps {
  CaptureRender?: ((count: number) => React.ReactNode) | null
  initialCount?: number
  beforeGetCode?: null | (() => void)
}

const Input: React.FC<CaptureInputProps> = (props: CaptureInputProps) => {
  const { CaptureRender, initialCount, beforeGetCode, ...rest } = props
  const intl = useIntl()
  return (
    <GInput
      placeholder={intl.formatMessage({ id: 'user.qingshuruyanzhengma', defaultMessage: '请输入验证码' })}
      className={styles['input-text']}
      {...rest}
    >
      <Capture
        initialCount={initialCount}
        beforeGetCode={beforeGetCode}
        render={
          CaptureRender ||
          ((count: number) => (
            <Text className={styles['get-code-btn']}>
              {count === 0
                ? intl.formatMessage({ id: 'user.huoquyanzhengma', defaultMessage: '获取验证码' })
                : `${count}${intl.formatMessage({ id: 'user.miaohouchongxinhuoqu', defaultMessage: '秒后重新获取' })}`}
            </Text>
          ))
        }
      />
    </GInput>
  )
}
Input.defaultProps = {
  initialCount: 60,
  beforeGetCode: null,
  CaptureRender: null,
}

const WrapCapture: typeof Capture & {
  Input: typeof Input
} = Capture as any

WrapCapture.Input = Input

Capture.defaultProps = {
  initialCount: 60,
  beforeGetCode: null,
  send: false,
  showState: false,
}

export default WrapCapture
