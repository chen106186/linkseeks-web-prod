import React from 'react'
import { Tabs, Row, Col } from 'antd'
import { PropsType, ChildNodesType } from '@apps/design-core'
import { ModuleTree } from '@apps/design-react'

import ICONS_CONFIG, { ICON_CONFIGS_B } from './iconsConfig'
import styles from './index.less'

import MarketingSwitch from '../marketingSwitch'

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

interface IProps {
  isClient?: boolean
}

const MobileClientEditLeft: React.FC<IProps> = (props) => {
  const { isClient = true } = props

  return (
    <div className={styles.edit_container}>
      <Tabs type="card" style={{ height: '100%' }}>
        <TabPane tab="已添加" key="1">
          <ModuleTree />
        </TabPane>
        <TabPane tab="全部模块" key="2">
          <Row gutter={16}>
            {(isClient ? ICONS_CONFIG : ICON_CONFIGS_B).map((item, index) => (
              <Col key={index} span={12} style={{ marginBottom: 16 }}>
                <MarketingSwitch {...item} />
              </Col>
            ))}
          </Row>
        </TabPane>
      </Tabs>
    </div>
  )
}

export default MobileClientEditLeft
