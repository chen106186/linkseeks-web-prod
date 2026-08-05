import React from 'react'
import { Button } from 'antd'
import { PageConfigType, STATE_PROPS } from '@apps/design-core'
import { useSelector } from '@apps/design-react'

type SettingPanelType = {
  pageConfig: PageConfigType
}

interface Iprops {
  onSubmit?: null | ((pageConfig: PageConfigType, others: any) => void)
  children: React.ReactNode
  loading: boolean
  dataConfig?: string[]
}

const ToolbarSubmit: React.FC<Iprops> = (props: Iprops) => {
  const { onSubmit = null, children, loading, dataConfig = ['pageConfig'] } = props
  const { pageConfig, ...rest } = useSelector<SettingPanelType, STATE_PROPS>(dataConfig as any)

  const handleCilck = () => {
    onSubmit?.(pageConfig, rest)
  }

  return (
    <Button onClick={handleCilck} loading={loading}>
      {children}
    </Button>
  )
}

export default ToolbarSubmit
