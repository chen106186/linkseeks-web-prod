import React from 'react'
import { PageConfigType } from '@apps/design-core'
// import MobileUIDemo from './mobileUIDemo'
import { BrickPreview, useSelector, BrickDesign } from '@apps/design-react'

import styles from './index.less'

interface WebDesignPanelPropsType {
  theme: string
  isPreview?: boolean
}

const WebDesignPanel: React.FC<WebDesignPanelPropsType> = (props) => {
  const { theme, isPreview } = props
  const { pageConfig } = useSelector(['pageConfig'])
  const Component = isPreview ? BrickPreview : BrickDesign

  return (
    <div className={styles.container}>
      <Component pageName={'index'} initState={{ pageConfig }} themeName={theme} />
    </div>
  )
}

WebDesignPanel.defaultProps = {
  isPreview: false,
}

export default WebDesignPanel
