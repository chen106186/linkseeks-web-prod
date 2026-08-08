import React, { useState, useEffect, useMemo } from 'react'
import { history } from '@linkseeks/router-manager'
import { PageHeaderWrapper } from '@apps/components'
import { PageHeader, Descriptions, Badge, Spin, Tabs } from 'antd'
import { MEMBER_STATUS_TAG_MAP, MEMBER_INNER_STATUS_BADGE_COLOR, MEMBER_OUTER_STATUS_TYPE } from '../../constant'
import HeadInfo from '../../components/HeadInfo'
import StatusTag from '../../components/StatusTag'
import BasicInfo from '../memberBasicInfo'
import EquityInfo from '../memberEquityInfo'
import LevelInfo from '../memberLevelInfo'
import AuthInfo from '../memberAuthInfo'
import SincerityInfo from '../memberSincerityInfo'
import { MemberProvider, useMemberInfo } from '../../services/contexts/memberContext'
import useMemberBasicInfo from '../../services/hooks/useMemberBasicInfo'

const MemberMaintainDetailed: React.FC<any> = ({ type, extraButton }) => {
  const [tabKey, setTabKey] = useState('basicInfo')
  const { loading } = useMemberBasicInfo(type)
  const { memberMaintainInfo } = useMemberInfo()

  const tabList = useMemo(() => {
    if (type === 'approved') {
      return [
        {
          key: 'basicInfo',
          label: '基本信息',
        },
        {
          key: 'authInfo',
          label: '权限信息',
        },
      ]
    } else {
      return [
        {
          key: 'basicInfo',
          label: '基本信息',
        },
        {
          key: 'authInfo',
          label: '权限信息',
        },
        {
          key: 'levelInfo',
          label: '等级信息',
        },
        {
          key: 'equityInfo',
          label: '权益信息',
        },
        {
          key: 'sincerityInfo',
          label: '诚信信息',
        },
      ]
    }
  }, [type])

  const handleTabChange = (val: string) => {
    setTabKey(val)
  }

  const renderChild = () => {
    switch (tabKey) {
      case 'basicInfo':
        return <BasicInfo />
      case 'equityInfo':
        return <EquityInfo />
      case 'levelInfo':
        return <LevelInfo />
      case 'authInfo':
        return <AuthInfo />
      case 'sincerityInfo':
        return <SincerityInfo />

      default:
        break
    }
  }

  return (
    <Spin spinning={loading}>
      <PageHeaderWrapper
        backDom={false}
        title={
          <>
            <PageHeader
              style={{ padding: '0' }}
              onBack={() => history.back()}
              title={
                <HeadInfo
                  info={{
                    name: memberMaintainInfo?.name,
                    levelTag: memberMaintainInfo?.levelTag!,
                  }}
                />
              }
              extra={extraButton}
            >
              <Descriptions
                size="small"
                column={3}
                style={{
                  padding: '0 32px',
                }}
              >
                <Descriptions.Item label="会员类型">{memberMaintainInfo?.memberTypeName}</Descriptions.Item>
                <Descriptions.Item label="会员角色" span={2}>
                  {memberMaintainInfo?.roleName}
                </Descriptions.Item>
                <Descriptions.Item label="会员状态">
                  <StatusTag
                    type={memberMaintainInfo?.status ? MEMBER_STATUS_TAG_MAP[memberMaintainInfo?.status] : 'default'}
                    title={memberMaintainInfo?.statusName}
                  />
                </Descriptions.Item>
                <Descriptions.Item label="外部状态">
                  <StatusTag
                    type={
                      memberMaintainInfo?.outerStatus
                        ? MEMBER_OUTER_STATUS_TYPE[memberMaintainInfo?.outerStatus]
                        : 'default'
                    }
                    title={memberMaintainInfo?.outerStatusName}
                  />
                </Descriptions.Item>
                <Descriptions.Item label="内部状态">
                  <Badge
                    color={
                      memberMaintainInfo?.innerStatus
                        ? MEMBER_INNER_STATUS_BADGE_COLOR[memberMaintainInfo?.innerStatus]
                        : '#606266'
                    }
                    text={memberMaintainInfo?.innerStatusName}
                  />
                </Descriptions.Item>
              </Descriptions>
            </PageHeader>
          </>
        }
        isTabs
        items={tabList}
        onTabChange={handleTabChange}
      >
        {renderChild()}
      </PageHeaderWrapper>
    </Spin>
  )
}

export default ({ children, ...props }: any) => {
  return (
    <MemberProvider>
      <MemberMaintainDetailed {...props} />
      {children}
    </MemberProvider>
  )
}
