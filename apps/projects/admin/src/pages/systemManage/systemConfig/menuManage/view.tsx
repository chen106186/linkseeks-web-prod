import React, { useState, useRef } from 'react'
import { Tabs, Button } from '@linkseeks/ui'
import './index.global.less'
import TabMenu from './components/tabMenu'
import { BUSINESS_SOURCE_ENUMS } from '@apps/domains'
import memberMenuService from './services/member.service'
import { PageHeaderWrapper } from '@apps/components'
import { useEventEmitter } from '@linkseeks/hooks'
import { useTabs } from '@linkseeks/hooks'

const MemberMenu: React.FC = () => {
  const { activeTabKey, setActiveTabKey } = useTabs<BUSINESS_SOURCE_ENUMS>(BUSINESS_SOURCE_ENUMS.PLATFORM_CENTER)

  const items = [
    {
      label: '能力中心',
      key: BUSINESS_SOURCE_ENUMS.PLATFORM_CENTER,
      children: <TabMenu source={BUSINESS_SOURCE_ENUMS.PLATFORM_CENTER} />,
    },
    { label: '平台后台', key: BUSINESS_SOURCE_ENUMS.ADMIN, children: <TabMenu source={BUSINESS_SOURCE_ENUMS.ADMIN} /> },
    // { label: 'App', key: BUSINESS_SOURCE_ENUMS.APP, children: <TabMenu source={BUSINESS_SOURCE_ENUMS.APP} /> },
  ]
  return (
    <PageHeaderWrapper>
      <div className="member-menu-tabs">
        <Tabs
          defaultActiveKey={BUSINESS_SOURCE_ENUMS.PLATFORM_CENTER}
          activeKey={activeTabKey}
          onChange={(key) => {
            setActiveTabKey(key as BUSINESS_SOURCE_ENUMS)
          }}
          items={items as any}
        />
      </div>
    </PageHeaderWrapper>
  )
}

export default MemberMenu
