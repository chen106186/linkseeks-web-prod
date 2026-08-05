import React from 'react'
import { Tabs, Row, Col } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { PropsType, ChildNodesType } from '@apps/design-core'
import { ModuleTree } from '@apps/design-react'
import { LAYOUT_TYPE } from '@apps/design-ui/src/Web/constants'
import MarketingSwitch from '../marketingSwitch'
import ICONS_CONFIG from './iconsConfig'
import styles from './index.less'

const { TabPane } = Tabs

export interface VirtualDOMType {
  key?: string
  componentName: string
  props?: PropsType
  childNodes?: ChildNodesType
  condition?: string
  isStateDomain?: boolean
  propFields?: string[]
  methods?: {
    [key: string]: string
  }
  loop?: string | any[]
  fileName?: string
  [custom: string]: any
}

interface MobileClientEditLeftProps {
  marketConfigs?: any
  layoutType: LAYOUT_TYPE
}

const MobileClientEditLeft: React.FC<MobileClientEditLeftProps> = (props: MobileClientEditLeftProps) => {
  const { marketConfigs, layoutType } = props
  const intl = useIntl()

  return (
    <div className={styles.edit_container}>
      <Tabs type="card" style={{ height: '100%' }}>
        <TabPane tab={intl.formatMessage({ id: 'editor.left.components.added' })} key="1">
          <ModuleTree />
        </TabPane>
        {marketConfigs && (
          <TabPane tab={intl.formatMessage({ id: 'editor.left.components.allmodule' })} key="2">
            <Row gutter={16}>
              {ICONS_CONFIG.map((item, index) => (
                <Col key={index} span={12} style={{ marginBottom: 16 }}>
                  <MarketingSwitch layoutType={layoutType} marketConfigs={marketConfigs} {...item} />
                </Col>
              ))}
            </Row>
          </TabPane>
        )}
      </Tabs>
    </div>
  )
}

export default MobileClientEditLeft
