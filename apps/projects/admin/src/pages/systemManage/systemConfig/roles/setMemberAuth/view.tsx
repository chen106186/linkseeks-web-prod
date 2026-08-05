import React, { useRef, useCallback, useMemo, useState } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import { Button, Card, Tabs } from '@linkseeks/ui'
import styles from './index.less'
import { useLocation, useQuery } from '@linkseeks/router-core'
import { useRequest } from '@linkseeks/hooks'
import { BUSINESS_SOURCE_ENUMS } from '@apps/domains'
import './index.global.less'
import TabMenu from './components/tabMenu'
import useMemberAuth from './services/hooks/useMemberAuth'
import { MemberAuthProvider } from './services/contexts'

/**
 * 设置会员权限
 */
const SetMemberAuth = () => {
  const { id } = useQuery()

  const { rebuildMemberAuth, loading, authInfo } = useMemberAuth()
  const source = useRef<BUSINESS_SOURCE_ENUMS>(BUSINESS_SOURCE_ENUMS.PLATFORM_CENTER)

  const items = [
    {
      label: '能力中心',
      key: BUSINESS_SOURCE_ENUMS.PLATFORM_CENTER,
      children: <TabMenu source={BUSINESS_SOURCE_ENUMS.PLATFORM_CENTER} />,
    },
    // { label: '平台后台', key: BUSINESS_SOURCE_ENUMS.ADMIN, children: <TabMenu source={BUSINESS_SOURCE_ENUMS.ADMIN} /> },
    // {
    //   label: 'App',
    //   key: BUSINESS_SOURCE_ENUMS.APP,
    //   children: <TabMenu source={BUSINESS_SOURCE_ENUMS.APP} />,
    // },
  ]

  const renderHeader = (
    <div className={styles['header-container']}>
      <div className={styles['header-content']}>
        <span>会员角色: {authInfo?.roleName}</span>
        <span>业务类型: {authInfo?.roleTypeName}</span>
        <span>会员类型: {authInfo?.memberTypeName}</span>
      </div>
      <Button type="primary" loading={loading} onClick={() => rebuildMemberAuth(id, source.current)}>
        保存并批量刷新会员权限
      </Button>
    </div>
  )

  return (
    <PageHeaderWrapper extra={renderHeader} backDom>
      <div className="member-menu-tabs">
        <Tabs
          defaultActiveKey={BUSINESS_SOURCE_ENUMS.PLATFORM_CENTER}
          onChange={(key) => {
            source.current = key as BUSINESS_SOURCE_ENUMS
          }}
          items={items as any}
        />
      </div>
    </PageHeaderWrapper>
  )
}

export default () => (
  <MemberAuthProvider>
    <SetMemberAuth />
  </MemberAuthProvider>
)
