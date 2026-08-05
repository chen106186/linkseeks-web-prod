import React from 'react'
import { useSelector } from '@apps/design-react'
import DesignPanel from '@/pages/pageCustomized/components/DesignPanel'
import DesignPreview from '@/pages/pageCustomized/components/DesignPreview'
import styles from '@/pages/pageCustomized/components/index.less'

interface MobileDesignPanelPropsType {
  theme: string
  isPreview?: boolean
  onlyEidt?: boolean
  componentConfigs?: any
}

const MobileDesignPanel: React.FC<MobileDesignPanelPropsType> = (props) => {
  const { theme, isPreview, onlyEidt, componentConfigs } = props
  const { pageConfig } = useSelector(['pageConfig'])
  return (
    <div className={styles.mobileDesignContainer}>
      <div className={styles.mobileDesignWrap}>
        {isPreview ? (
          <DesignPreview theme={theme} pageConfig={componentConfigs || pageConfig || {}} />
        ) : (
          <DesignPanel onlyEidt={onlyEidt} theme={theme} pageConfig={pageConfig || {}} />
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
