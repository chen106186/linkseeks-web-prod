/*
 * @Description: 客户档案
 */
import React, { useState, useEffect, useMemo } from 'react'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { Spin } from 'antd'
import {
  UnorderedListOutlined,
  FolderOutlined,
  BarChartOutlined,
  InsuranceOutlined,
  BulbOutlined,
  EditOutlined,
} from '@ant-design/icons'
import { usePageStatus } from '@/hooks/usePageStatus'
import {
  getMemberCustomerAbilityMaintenanceDetailBasic,
  GetMemberCustomerAbilityMaintenanceDetailBasicResponse,
} from '@apps/apis'
import AnchorPage, { AnchorsItem } from '@/components/AnchorPage'
import AvatarWrap from '@/components/AvatarWrap'
import useCheckConfigMember from '@/hooks/useCheckConfigMember'
import { MemberDetailsContextProvider } from '../../memberDetailsContext'
import Bookmark from '../../components/Bookmark'
import BasicInfo from './components/basicInfo'
import ArchiveInfo from './components/archiveInfo'
import ChangedInfo from './components/changedInfo'
import EquityInfo from './components/equityInfo'
import LevelInfo from './components/levelInfo'
import SincerityInfo from './components/sincerityInfo'

const CustomerArchivesDetails: React.FC<{}> = (props) => {
  const {} = props
  const [memberInfo, setMemberInfo] = useState<GetMemberCustomerAbilityMaintenanceDetailBasicResponse>(null)
  const [infoLoading, setInfoLoading] = useState(false)
  const [anchors, setAnchors] = useState<AnchorsItem[]>([])
  const [key, setKey] = useState<string>('basicInfo')

  const { id, validateId } = usePageStatus()

  const intl = useIntl()

  const { isConfigMember, isConfigMemberLoading } = useCheckConfigMember(validateId, 'customer')

  const getBasicInfo = () => {
    if (!validateId) {
      return
    }
    setInfoLoading(true)
    getMemberCustomerAbilityMaintenanceDetailBasic({
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
    getBasicInfo()
  }, [])

  const _renderChildren = () => {
    switch (key) {
      case 'basicInfo':
        return <BasicInfo id={id} validateId={validateId} />
        break
      case 'levelInfo':
        return <LevelInfo id={id} validateId={validateId} />
        break
      case 'equityInfo':
        return <EquityInfo id={id} validateId={validateId} />
        break
      case 'sincerityInfo':
        return <SincerityInfo id={id} validateId={validateId} />
        break
      case 'archiveInfo':
        return <ArchiveInfo id={id} validateId={validateId} />
        break
      case 'changedInfo':
        return <ChangedInfo id={id} validateId={validateId} />
        break
      default:
        break
    }
  }

  const handleBookmarkChange = (val: string) => {
    setKey(val)
  }

  const handleAnchorsReady = (anchors: AnchorsItem[]) => {
    setAnchors(anchors)
  }

  return (
    <Spin spinning={infoLoading || isConfigMemberLoading}>
      <AnchorPage
        title={
          <AvatarWrap
            info={{
              name: memberInfo?.name,
            }}
            extra={memberInfo?.levelTag}
          />
        }
        onBack={() => history.goBack()}
        anchors={anchors}
        desc={
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
              title={intl.formatMessage({ id: 'member.management.maintain.detail.levelInfo' })}
              icon={<BarChartOutlined />}
              visible={isConfigMember}
            />
            <Bookmark.Item
              value="equityInfo"
              title={intl.formatMessage({ id: 'member.management.maintain.detail.equityInfo' })}
              icon={<InsuranceOutlined />}
              visible={isConfigMember}
            />
            <Bookmark.Item
              value="sincerityInfo"
              title={intl.formatMessage({ id: 'member.management.maintain.detail.sincerityInfo' })}
              icon={<BulbOutlined />}
              visible={isConfigMember}
            />
            <Bookmark.Item
              value="changedInfo"
              title={intl.formatMessage({ id: 'member.management.maintain.detail.changedInfo' })}
              icon={<EditOutlined />}
            />
          </Bookmark>
        }
      >
        <MemberDetailsContextProvider
          value={{
            details: memberInfo,
            refreshDetails: getBasicInfo,
            onAnchorsReady: handleAnchorsReady,
          }}
        >
          {_renderChildren()}
        </MemberDetailsContextProvider>
      </AnchorPage>
    </Spin>
  )
}

export default CustomerArchivesDetails
