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
import { observer, inject } from 'mobx-react'
import { usePageStatus } from '@/hooks/usePageStatus'
import { getMemberSupplierAbilityInfoDetailBasic, GetMemberSupplierAbilityInfoDetailBasicResponse } from '@apps/apis'
import { IMemberModule } from '@/module/memberModule'
import { MEMBER_TYPE_CHANNEL_CORPORATE, MEMBER_TYPE_CHANNEL_INDIVIDUAL } from '@/constants/member'
import { PageHeaderWrapper } from '@apps/components'
import AvatarWrap from '@/components/AvatarWrap'
import Bookmark from '../../components/Bookmark'

import ArchiveInfo from './detailed/archiveInfo'
import BasicInfo from './detailed/basicInfo'
import EquityInfo from './detailed/equityInfo'
import LevelInfo from './detailed/levelInfo'
import SincerityInfo from './detailed/sincerityInfo'

interface QueryProps {
  match: {
    url: string
    path: string
  }
  location: {
    pathname: string
  }
}

const MemberQueryDetailed: React.FC<QueryProps> = (props) => {
  const { validateId } = usePageStatus()
  const [memberInfo, setMemberInfo] = useState<GetMemberSupplierAbilityInfoDetailBasicResponse>(null)
  const [infoLoading, setInfoLoading] = useState(false)
  const [key, setKey] = useState('basicInfo')

  const intl = useIntl()

  const getBasicInfo = () => {
    if (!validateId) {
      return
    }
    setInfoLoading(true)
    getMemberSupplierAbilityInfoDetailBasic({
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

  const getAnchorsArr = () => {
    const markKey = key
    let ret: { label: string; key: string }[] = []
    switch (markKey) {
      case 'basicInfo':
        ret = [
          {
            key: 'verifySteps',
            label: intl.formatMessage({ id: 'member.components.MemberProfile.verifySteps' }),
          },
          {
            key: 'basicInfo',
            label: intl.formatMessage({ id: 'member.components.MemberProfile.basicInfo' }),
          },
          // 平台录入的会员不需要填渠道信息的
          memberInfo?.memberTypeEnum === MEMBER_TYPE_CHANNEL_CORPORATE ||
          memberInfo?.memberTypeEnum === MEMBER_TYPE_CHANNEL_INDIVIDUAL
            ? {
                key: 'channelInfo',
                label: intl.formatMessage({ id: 'member.components.MemberProfile.channelInfo' }),
              }
            : null,
          ...(memberInfo && memberInfo.groups
            ? memberInfo.groups.map((item, index) => ({
                key: `group${index}`,
                label: item.groupName,
              }))
            : []),
          {
            key: 'flowRecords',
            label: intl.formatMessage({ id: 'member.components.MemberProfile.flowRecords' }),
          },
        ].filter(Boolean)
        break
      case 'levelInfo':
        ret = [
          {
            key: 'memberLevel',
            label: intl.formatMessage({ id: 'member.management.maintain.detail.memberLevel' }),
          },
          {
            key: 'activePoints',
            label: intl.formatMessage({ id: 'member.management.maintain.detail.activePoints' }),
          },
        ]
        break
      case 'equityInfo':
        ret = [
          {
            key: 'basicInfo',
            label: intl.formatMessage({ id: 'member.management.maintain.basic' }),
          },
          {
            key: 'memberEquity',
            label: intl.formatMessage({ id: 'member.management.maintain.detail.memberEquity' }),
          },
          {
            key: 'equityRecords',
            label: intl.formatMessage({ id: 'member.management.maintain.detail.equityRecords' }),
          },
        ]
        break
      case 'sincerityInfo':
        ret = [
          {
            key: 'basicInfo',
            label: intl.formatMessage({ id: 'member.management.maintain.basic' }),
          },
          {
            key: 'orderEvaluation',
            label: intl.formatMessage({ id: 'member.management.maintain.detail.orderEvaluation' }),
          },
          {
            key: 'afterServiceEvaluation',
            label: intl.formatMessage({ id: 'member.management.maintain.detail.afterServiceEvaluation' }),
          },
          {
            key: 'feedbackRecords',
            label: intl.formatMessage({ id: 'member.management.maintain.detail.feedbackRecords' }),
          },
        ]
        break
      case 'archiveInfo':
        ret = [
          {
            key: 'depositDetails',
            label: intl.formatMessage({ id: 'member.management.maintain.detail.depositDetails' }),
          },
          {
            key: 'qualitiesInfo',
            label: intl.formatMessage({ id: 'member.management.maintain.detail.qualitiesInfo' }),
          },
          {
            key: 'appraisalInfo',
            label: intl.formatMessage({ id: 'member.management.maintain.detail.appraisalInfo' }),
          },
          {
            key: 'rectifyInfo',
            label: intl.formatMessage({ id: 'member.management.maintain.detail.rectifyInfo' }),
          },
        ]
        break
      default:
        break
    }
    return ret
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
        onBack={() => history.push(`/supplierAbility/profile/memberQuery`)}
        items={getAnchorsArr()}
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
            {/* <Bookmark.Item value="levelInfo" title={intl.formatMessage({ id: 'member.management.maintain.detail.levelInfo' })} icon={<BarChartOutlined />} />
            <Bookmark.Item value="equityInfo" title={intl.formatMessage({ id: 'member.management.maintain.detail.equityInfo' })} icon={<InsuranceOutlined />} />
            <Bookmark.Item value="sincerityInfo" title={intl.formatMessage({ id: 'member.management.maintain.detail.sincerityInfo' })} icon={<BulbOutlined />} /> */}
          </Bookmark>
        }
      >
        {_renderChildren()}
      </PageHeaderWrapper>
    </Spin>
  )
}

export default MemberQueryDetailed
