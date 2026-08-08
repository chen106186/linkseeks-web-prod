import React from 'react'
import { PageConfigType } from '@apps/design-core'
import { BrickPreview, useSelector, BrickDesign, STATE_PROPS } from '@apps/design-react'

import styles from './index.less'

interface MobileDesignPanelPropsType {
  theme: string
  isPreview?: boolean
  onlyEidt?: boolean
}

type SettingPanelType = {
  pageConfig: PageConfigType
}

const MobileDesignPanel: React.FC<MobileDesignPanelPropsType> = (props) => {
  const { theme, isPreview, onlyEidt } = props
  const { pageConfig } = useSelector<SettingPanelType, STATE_PROPS>(['pageConfig'])
  const Component = isPreview ? BrickPreview : BrickDesign

  return (
    <div className={styles.mobileDesignContainer}>
      <div className={styles.mobileDesignWrap}>
        <Component pageName={'index'} initState={{ pageConfig }} themeName={theme} onlyEidt={onlyEidt} />
      </div>
      <div className={styles.appBottom}>
        <div className={styles.appBottomStrip}></div>
      </div>
    </div>
  )
}

MobileDesignPanel.defaultProps = {
  isPreview: false,
}

export default MobileDesignPanel
