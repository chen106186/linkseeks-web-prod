import React, { useEffect, useState } from 'react'
import { PageConfigType, SelectedInfoType, STATE_PROPS } from '@apps/design-core'
import { useSelector } from '@apps/design-react'
import { get } from 'lodash'
import cx from 'classnames'
import { Tabs } from 'antd'
import StyleSettings from './styleSettings'
import PropsSettings from './propsSettings'
import SettingWrap from './settingWrap'
import styles from './index.less'

type SettingPanelType = {
  selectedInfo: SelectedInfoType
  pageConfig: PageConfigType
}

const { TabPane } = Tabs

interface MobileSettingPanelProps {
  shopId: number
  property: number
  environment: number
}

const MobileSettingPanel: React.FC<MobileSettingPanelProps> = (props) => {
  const { selectedInfo, pageConfig } = useSelector<SettingPanelType, STATE_PROPS>(['selectedInfo', 'pageConfig'])
  const { propsConfig } = selectedInfo || {}
  const [newSelectInfo, setNewSelectInfo] = useState<SelectedInfoType>()

  useEffect(() => {
    const updateSelectInfo = () => {
      if (selectedInfo) {
        const { props: oldProps, selectedKey } = selectedInfo
        const newProps = get(pageConfig, [selectedKey, 'props'], oldProps)
        const updateSelectInfo = { ...selectedInfo }
        updateSelectInfo.props = newProps
        setNewSelectInfo(updateSelectInfo)
      }
    }

    updateSelectInfo()
  }, [selectedInfo, pageConfig])

  return (
    <div className={cx(styles.mobileSettingPanel, selectedInfo ? styles.show : styles.hide)}>
      <Tabs defaultActiveKey="1" className={styles.settingTabs}>
        {propsConfig && propsConfig.componentType && (
          <TabPane tab={propsConfig.componentType.label || '编辑'} key="props">
            <SettingWrap shopId={props.shopId} property={props.property}>
              <PropsSettings selectedInfo={newSelectInfo} pageConfig={pageConfig} {...props} />
            </SettingWrap>
          </TabPane>
        )}
        {propsConfig && propsConfig.styleType && (
          <TabPane tab="样式" key="style">
            <SettingWrap shopId={props.shopId} property={props.property}>
              <StyleSettings selectedInfo={newSelectInfo} />
            </SettingWrap>
          </TabPane>
        )}
      </Tabs>
    </div>
  )
}

export default MobileSettingPanel
