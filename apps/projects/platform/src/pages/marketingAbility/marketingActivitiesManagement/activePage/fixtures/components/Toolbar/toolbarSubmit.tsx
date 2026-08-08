import React from 'react'
import { Button } from 'antd'
import { PageConfigType, STATE_PROPS } from '@apps/design-core'
import { useSelector } from '@apps/design-react'

type SettingPanelType = {
  pageConfig: PageConfigType
}

interface Iprops {
  onSubmit?: null | ((pageConfig: PageConfigType) => void)
  children: React.ReactNode
  loading: boolean
}

const ToolbarSubmit: React.FC<Iprops> = (props: Iprops) => {
  const { pageConfig } = useSelector<SettingPanelType, STATE_PROPS>(['pageConfig'])
  const { onSubmit = null, children, loading } = props

  const handleCilck = () => {
    onSubmit?.(pageConfig)
  }

  return (
    <Button onClick={handleCilck} loading={loading}>
      {children}
    </Button>
  )
}

export default ToolbarSubmit
