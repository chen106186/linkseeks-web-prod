import { Button } from '@apps/mobile-ui'
import { useEAccountContext } from './context'
import React from 'react'
export const useButtonStatus = ({ submit }) => {
  const { buttonStatus, setButtonStatus } = useEAccountContext()

  const renderButton = () => {
    return (
      <Button type="primary" onClick={submit}>
        提交审核
      </Button>
    )
  }

  return {
    renderButton: renderButton(),
  }
}
