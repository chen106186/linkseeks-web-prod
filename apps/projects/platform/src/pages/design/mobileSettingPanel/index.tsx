import React, { useEffect, useState } from 'react'
import { PageConfigType, SelectedInfoType, STATE_PROPS } from '@apps/design-core'
import { useSelector } from '@apps/design-react'
import { get } from 'lodash'
import { useIntl } from '@linkseeks/i18n'
import cx from 'classnames'
import { Tabs } from 'antd'
import { LAYOUT_TYPE } from '@apps/design-ui/src/Web/constants'
import StyleSettings from './styleSettings'
import PropsSettings from './propsSettings'
import SettingWrap from './settingWrap'
import styles from './index.less'

type SettingPanelType = {
  selectedInfo: SelectedInfoType
  pageConfig: PageConfigType
}

interface MobileSettingPanelProps {
  shopId: number
  environment: number
  layoutType: LAYOUT_TYPE
}

const { TabPane } = Tabs

const MobileSettingPanel: React.FC<MobileSettingPanelProps> = (props) => {
  const { selectedInfo, pageConfig } = useSelector<SettingPanelType, STATE_PROPS>(['selectedInfo', 'pageConfig'])
  const { propsConfig } = selectedInfo || {}
  const [newSelectInfo, setNewSelectInfo] = useState<SelectedInfoType>()
  const intl = useIntl()

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
          <TabPane tab={intl.formatMessage({ id: 'common.button.edit' })} key="props">
            <SettingWrap>
              <PropsSettings selectedInfo={newSelectInfo} pageConfig={pageConfig} {...props} />
            </SettingWrap>
          </TabPane>
        )}
        {propsConfig && propsConfig.styleType && (
          <TabPane tab={intl.formatMessage({ id: 'common.text.style' })} key="style">
            <SettingWrap>
              <StyleSettings selectedInfo={newSelectInfo} />
            </SettingWrap>
          </TabPane>
        )}
      </Tabs>
    </div>
  )
}

export default MobileSettingPanel
