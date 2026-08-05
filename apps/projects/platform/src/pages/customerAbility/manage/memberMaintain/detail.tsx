/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-06 11:36:35
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 18:02:58
 * @Description:
 */
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
  EditOutlined,
} from '@ant-design/icons'
import { usePageStatus } from '@/hooks/usePageStatus'
import {
  getMemberCustomerAbilityMaintenanceDetailBasic,
  GetMemberCustomerAbilityMaintenanceDetailBasicResponse,
} from '@apps/apis'
import AnchorPage, { AnchorsItem } from '@/components/AnchorPage'
import AvatarWrap from '@/components/AvatarWrap'
import { MemberDetailsContextProvider } from '../../memberDetailsContext'
import Bookmark from '../../components/Bookmark'
import ArchiveInfo from './detailed/archiveInfo'
import BasicInfo from './detailed/basicInfo'
import ChangedInfo from './detailed/changedInfo'
import EquityInfo from './detailed/equityInfo'
import LevelInfo from './detailed/levelInfo'
import SincerityInfo from './detailed/sincerityInfo'

const MemberMaintainDetailed: React.FC<any> = (props) => {
  const { id, validateId } = usePageStatus()
  const [memberInfo, setMemberInfo] = useState<GetMemberCustomerAbilityMaintenanceDetailBasicResponse>(null)
  const [infoLoading, setInfoLoading] = useState(false)
  const [anchors, setAnchors] = useState<AnchorsItem[]>([])
  const [key, setKey] = useState<string>('basicInfo')

  const intl = useIntl()

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
      case 'levelInfo':
        return <LevelInfo id={id} validateId={validateId} />
      case 'equityInfo':
        return <EquityInfo id={id} validateId={validateId} />
      case 'sincerityInfo':
        return <SincerityInfo id={id} validateId={validateId} />
      case 'archiveInfo':
        return <ArchiveInfo id={id} validateId={validateId} />
      case 'changedInfo':
        return <ChangedInfo id={id} validateId={validateId} />
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
    <Spin spinning={infoLoading}>
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
              title={intl.formatMessage({ id: 'customerAbility.management.maintain.basic' })}
              icon={<UnorderedListOutlined />}
            />
            <Bookmark.Item
              value="archiveInfo"
              title={intl.formatMessage({ id: 'customerAbility.management.maintain.detail.archivalInfo' })}
              icon={<FolderOutlined />}
            />
            <Bookmark.Item
              value="levelInfo"
              title={intl.formatMessage({ id: 'customerAbility.management.maintain.detail.levelInfo' })}
              icon={<BarChartOutlined />}
            />
            <Bookmark.Item
              value="equityInfo"
              title={intl.formatMessage({ id: 'customerAbility.management.maintain.detail.equityInfo' })}
              icon={<InsuranceOutlined />}
            />
            <Bookmark.Item
              value="sincerityInfo"
              title={intl.formatMessage({ id: 'customerAbility.management.maintain.detail.sincerityInfo' })}
              icon={<BulbOutlined />}
            />
            <Bookmark.Item
              value="changedInfo"
              title={intl.formatMessage({ id: 'customerAbility.management.maintain.detail.changedInfo' })}
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

export default MemberMaintainDetailed
