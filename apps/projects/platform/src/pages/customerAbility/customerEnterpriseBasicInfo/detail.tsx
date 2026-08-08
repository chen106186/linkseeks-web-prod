import React, { useState, useEffect } from 'react'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { Spin } from 'antd'
import {
  UnorderedListOutlined,
  FolderOutlined,
  BarChartOutlined,
  InsuranceOutlined,
  BulbOutlined,
} from '@ant-design/icons'
import { usePageStatus } from '@/hooks/usePageStatus'
import {
  getMemberCustomerAbilityInfoDetailBasic,
  getMemberCustomerAbilityLevelSubConfiguration,
  GetMemberCustomerAbilityInfoDetailBasicResponse,
} from '@apps/apis'
import { PageHeaderWrapper } from '@apps/components'
import AnchorPage, { AnchorsItem } from '@/components/AnchorPage'
import AvatarWrap from '@/components/AvatarWrap'
import { MemberDetails, MemberDetailsContextProvider } from '../memberDetailsContext'
import Bookmark from '../components/Bookmark'
import ArchiveInfo from './components/archiveInfo'
import BasicInfo from './components/basicInfo'
import EquityInfo from './components/equityInfo'
import LevelInfo from './components/levelInfo'
import SincerityInfo from './components/sincerityInfo'
import { CubeIcon } from '@linkseeks/icons'

const MemberQueryDetailed: React.FC<{}> = (props) => {
  const { validateId } = usePageStatus()
  const [memberInfo, setMemberInfo] = useState<GetMemberCustomerAbilityInfoDetailBasicResponse>(null)
  const [infoLoading, setInfoLoading] = useState(false)
  const [tabsState, setTabsState] = useState(false)
  const [anchors, setAnchors] = useState<{ label: string; key: string }[]>([])
  const [key, setKey] = useState<string>('basicInfo')

  const intl = useIntl()

  const getBasicInfo = () => {
    if (!validateId) {
      return
    }
    setInfoLoading(true)
    getMemberCustomerAbilityInfoDetailBasic({
      validateId,
    })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        setMemberInfo(res.data)
      })
      .catch((err) => {
        console.warn(err)
      })
      .finally(() => {
        setInfoLoading(false)
      })
  }

  useEffect(() => {
    tabsFilter()
    getBasicInfo()
  }, [])

  // 判断【供应商等级信息、供应商权益信息、供应商信用信息TAB页】显示隐藏
  const tabsFilter = () => {
    getMemberCustomerAbilityLevelSubConfiguration({ validateId }).then((res) => {
      if (res.code === 1000) {
        return setTabsState(res.data)
      }
    })
  }

  const _renderChildren = () => {
    switch (key) {
      case 'basicInfo':
        return <BasicInfo validateId={validateId} />
      case 'levelInfo':
        return <LevelInfo validateId={validateId} />
      case 'equityInfo':
        return <EquityInfo validateId={validateId} />
      case 'sincerityInfo':
        return <SincerityInfo validateId={validateId} />
      case 'archiveInfo':
        return <ArchiveInfo validateId={validateId} />
      default:
        break
    }
  }

  const handleBookmarkChange = (val: string) => {
    setKey(val)
  }

  const handleAnchorsReady = (anchors: { label: string; key: string }[]) => {
    setAnchors(anchors)
  }

  return (
    <Spin spinning={infoLoading}>
      <PageHeaderWrapper
        title={
          <AvatarWrap
            info={{
              name: memberInfo?.name,
            }}
            extra={memberInfo?.levelTag}
          />
        }
        onBack={() => history.goBack()}
        items={anchors}
        content={
          <Bookmark value={key} onChange={handleBookmarkChange}>
            <Bookmark.Item
              value="basicInfo"
              title={intl.formatMessage({ id: 'member.management.maintain.basic' })}
              icon={<UnorderedListOutlined />}
            />
            <Bookmark.Item
              value="archiveInfo"
              title={intl.formatMessage({ id: 'member.management.maintain.detail.archivalInfo' })}
              icon={<FolderOutlined />}
            />
            <Bookmark.Item
              value="levelInfo"
              visible={tabsState}
              title={intl.formatMessage({ id: 'member.management.maintain.detail.levelInfo' })}
              icon={<BarChartOutlined />}
            />
            <Bookmark.Item
              value="equityInfo"
              visible={tabsState}
              title={intl.formatMessage({ id: 'member.management.maintain.detail.equityInfo' })}
              icon={<InsuranceOutlined />}
            />
            <Bookmark.Item
              value="sincerityInfo"
              visible={tabsState}
              title={intl.formatMessage({ id: 'member.management.maintain.detail.sincerityInfo' })}
              icon={<BulbOutlined />}
            />
          </Bookmark>
        }
      >
        <MemberDetailsContextProvider
          value={{
            details: memberInfo as unknown as MemberDetails,
            refreshDetails: getBasicInfo,
            onAnchorsReady: handleAnchorsReady,
          }}
        >
          {_renderChildren()}
        </MemberDetailsContextProvider>
      </PageHeaderWrapper>
    </Spin>
  )
}

export default MemberQueryDetailed
