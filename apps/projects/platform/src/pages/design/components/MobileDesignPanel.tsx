/*
 * @Author: ghua
 * @Date: 2021-01-28 10:32:29
 * @LastEditTime: 2021-03-01 10:33:50
 * @LastEditors: Please set LastEditors
 * @Description: 移动端装修面板
 * @FilePath: /lingxi-business-paltform/src/pages/editor/components/MobileDesignPanel.tsx
 */
import React from 'react'
import { PageConfigType } from '@apps/design-core'
import { useSelector } from '@apps/design-react'
// import MobileUIDemo from './mobileUIDemo'
import DesignPanel from './DesignPanel'
import DesignPreview from './PreviewPanel'
import styles from './index.less'

interface MobileDesignPanelPropsType {
  pageConfig: PageConfigType
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
          <DesignPreview onlyEidt={onlyEidt} theme={theme} pageConfig={pageConfig} />
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
