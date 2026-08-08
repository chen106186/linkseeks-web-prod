import React from 'react'
import { PageConfigType } from '@apps/design-core'
import { BrickPreview } from '@apps/design-react'
import { useIntl } from '@linkseeks/i18n'

interface DesignPanelPropsType {
  pageConfig: PageConfigType
  theme: string
  onlyEidt?: boolean
  pageName?: string
}

const DesignPanel: React.FC<DesignPanelPropsType> = (props) => {
  const { pageConfig, theme, pageName = 'index', onlyEidt } = props
  const { i18n } = useIntl()

  return (
    <BrickPreview
      pageName={pageName}
      locale={i18n.language}
      initState={{ pageConfig }}
      themeName={theme}
      onlyEidt={onlyEidt}
    />
  )
}

export default DesignPanel
