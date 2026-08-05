import React, { useContext, useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react'
import { Row, Col, Button, Form, Input, Space, Tabs, message, Badge } from 'antd'
import { historyContainer } from '@/hooks/useHistoryContainer'
import NiceForm from '@/components/NiceForm'
import TabTree, { useTreeActions, createTreeActions } from '@/components/TabTree'
import styled from './index.less'
import CheckboxTree from '@/components/CheckBoxTree'
import { useTreeTabs } from '@/hooks/useTreeTabs'
import { createFormActions } from '@apps/formily'
import { usePageStatus, PageStatus } from '@/hooks/usePageStatus'
import DetailPage from '@/components/DetailPage'
import {
  // getMemberManageRoleAuthButton,
  getMemberManageRoleAuthTree,
  getMemberManageRoleGet,
  postMemberManageRoleAdd,
  postMemberManageRoleUpdate,
} from '@apps/apis'
import RoleInfo from './components/roleInfo'
import RoleAuthTree from './components/roleAuthTree'
import { RoleAuthTreeProvider, useRoleAuthTreeContext } from './services/contexts'
import useRoleSubmit from './services/hooks/useRoleSubmit'

const pageTitles = ['新增', '编辑', '预览']

const TabFormErrors = (props) => {
  return (
    <Badge dot={props.dot} offset={[5, -5]}>
      {props.children}
    </Badge>
  )
}

const TabsItem = Tabs.TabPane

const MemberDetail: React.FC<{}> = () => {
  const { pageStatus, id } = usePageStatus()
  const { handleSubmit, errors, loading } = useRoleSubmit()

  const extraButtons = (
    <Space>
      <Button type="primary" disabled={pageStatus === PageStatus.PREVIEW} loading={loading} onClick={handleSubmit}>
        保存
      </Button>
    </Space>
  )

  return (
    <DetailPage
      extraPageClassName={styled['extra-page']}
      extraPageDetailClassName={styled['extra-page-detail']}
      title={pageTitles[pageStatus]}
      extra={extraButtons}
    >
      <div className={styled['wrapper-white']}>
        <Tabs type="card" className="black-tabs">
          <TabsItem tab={<TabFormErrors dot={errors}>基本信息</TabFormErrors>} key="1">
            <RoleInfo />
          </TabsItem>
          <TabsItem tab="操作权限" key="2">
            <RoleAuthTree />
          </TabsItem>
        </Tabs>
      </div>
    </DetailPage>
  )
}

export default () => (
  <RoleAuthTreeProvider>
    <MemberDetail />
  </RoleAuthTreeProvider>
)
