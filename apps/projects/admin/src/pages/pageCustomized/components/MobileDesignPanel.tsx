import React from 'react'
import { PageConfigType } from '@apps/design-core'
// import MobileUIDemo from './mobileUIDemo'
import DesignPanel from './MobileDesign'
import DesignPreview from './MobilePreview'
import styles from './index.less'
import { useSelector } from '@apps/design-react'
interface MobileDesignPanelPropsType {
  pageConfig?: PageConfigType
  theme: string
  isPreview?: boolean
  onlyEidt?: boolean
}

const MobileDesignPanel: React.FC<MobileDesignPanelPropsType> = (props) => {
  const { pageConfig, theme, isPreview, onlyEidt } = props

  return (
    <div className={styles.mobileDesignContainer}>
      <div className={styles.mobileDesignWrap}>
        {isPreview ? (
          <DesignPreview theme={theme} pageConfig={pageConfig} />
        ) : (
          <DesignPanel onlyEidt={onlyEidt} theme={theme} pageConfig={pageConfig} />
        )}
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
