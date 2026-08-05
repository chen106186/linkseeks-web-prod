import React, { ReactNode, useMemo } from 'react'
import './index.less'
import { useToggle } from '@linkseeks/hooks'
import { Checkbox } from '@linkseeks/ui'

export interface StandardAgreementProps {
  isRead?: boolean
  toggleReadStatus?(isRead?: boolean): void
  desc?: ReactNode
}

export const StandardAgreement = (props: StandardAgreementProps) => {
  const { desc, isRead, toggleReadStatus } = props
  const [_isRead, _toggleReadStatus] = useToggle()

  const isReadUsed = useMemo(() => {
    if (isRead !== undefined) {
      return isRead
    } else {
      return _isRead
    }
  }, [isRead, _isRead])

  const toggleReadStatusUsed = useMemo(() => {
    if (toggleReadStatus !== undefined) {
      return toggleReadStatus
    } else {
      return _toggleReadStatus
    }
  }, [toggleReadStatus, _toggleReadStatus])

  return (
    <div className={'cp-check-container'}>
      <Checkbox checked={isReadUsed} onChange={() => toggleReadStatusUsed()}></Checkbox>
      <span className={'cp-desc'}>{desc}</span>
    </div>
  )
}

StandardAgreement.useAgreement = () => {
  const [isRead, toggleReadStatus] = useToggle()

  return {
    isRead,
    toggleReadStatus,
  }
}
