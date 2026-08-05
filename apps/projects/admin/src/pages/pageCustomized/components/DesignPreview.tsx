import React from 'react'
import { PageConfigType } from '@apps/design-core'
import { BrickPreview } from '@apps/design-react'

interface DesignPanelPropsType {
  pageConfig?: PageConfigType
  theme: string
  onlyEidt?: boolean
  pageName?: string
}

const DesignPanel: React.FC<DesignPanelPropsType> = (props) => {
  const { pageConfig, theme, pageName = 'index', onlyEidt } = props
  return <BrickPreview pageName={pageName} initState={{ pageConfig }} themeName={theme} onlyEidt={onlyEidt} />
}

export default DesignPanel
