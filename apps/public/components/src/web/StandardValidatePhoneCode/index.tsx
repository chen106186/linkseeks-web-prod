import { Button, Input, Space } from '@linkseeks/ui'
import React from 'react'

export interface StandardValidatePhoneCode {
  handleSendCode(): void
  sendLoading: boolean
  canSend: boolean
  countdown: number
  value?: any
  onChange?(value: any): void
}
export const StandardValidatePhoneCode = (props: StandardValidatePhoneCode) => {
  const { countdown, handleSendCode, sendLoading, canSend, value, onChange } = props

  const renderCodeBtn = (
    <Button onClick={handleSendCode} loading={sendLoading} disabled={!canSend}>
      {canSend ? '发送验证码' : countdown + ' s'}
    </Button>
  )

  return (
    <Space>
      <Input value={value} onChange={onChange} />
      {renderCodeBtn}
    </Space>
  )
}
