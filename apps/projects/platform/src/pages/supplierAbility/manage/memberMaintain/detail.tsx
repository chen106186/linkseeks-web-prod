/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-06 11:36:35
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 18:02:58
 * @Description:
 */
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { history } from '@linkseeks/router-manager'
import { useIntl } from '@linkseeks/i18n'
import { Spin } from 'antd'
import { AwardIcon, BulbIcon, ChartIcon, CubeIcon, EditIcon, FolderIcon, ListIcon } from '@linkseeks/icons'
import { usePageStatus } from '@/hooks/usePageStatus'
import {
  getMemberSupplierAbilityMaintenanceDetailBasic,
  GetMemberSupplierAbilityMaintenanceDetailBasicResponse,
} from '@apps/apis'
import { PageHeaderWrapper } from '@apps/components'
import AnchorPage, { AnchorsItem } from '@/components/AnchorPage'
import AvatarWrap from '@/components/AvatarWrap'
import { MemberDetailsContextProvider } from '../../memberDetailsContext'
import Bookmark from '../../components/Bookmark'
import useCheckConfigMember from '@/hooks/useCheckConfigMember'

import ArchiveInfo from './detailed/archiveInfo'
import BasicInfo from './detailed/basicInfo'
import ChangedInfo from './detailed/changedInfo'
import EquityInfo from './detailed/equityInfo'
import LevelInfo from './detailed/levelInfo'
import SincerityInfo from './detailed/sincerityInfo'
import SupplierAbility from './detailed/supplierAbility'

const MemberMaintainDetailed: React.FC<any> = (props) => {
  const { id, validateId } = usePageStatus()
  const [memberInfo, setMemberInfo] = useState<GetMemberSupplierAbilityMaintenanceDetailBasicResponse>(null)
  const [infoLoading, setInfoLoading] = useState(false)
  const [anchors, setAnchors] = useState<{ key: string; label: string }[]>([])
  const [key, setKey] = useState<string>('basicInfo')
  const { isConfigMember } = useCheckConfigMember(validateId, 'supplier')
  const intl = useIntl()

  const getBasicInfo = async () => {
    if (!validateId) {
      return
    }

    setInfoLoading(true)
    getMemberSupplierAbilityMaintenanceDetailBasic({
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
      case 'supplier':
        return <SupplierAbility id={id} validateId={validateId} />
      default:
        break
    }
  }

  const handleBookmarkChange = (val: string) => {
    setKey(val)
    if (val === 'supplier') {
      setAnchors([])
    }
  }

  const handleAnchorsReady = (anchors: { key: string; label: string }[]) => {
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
        items={anchors}
        content={
          <div style={{ paddingLeft: 24, paddingBottom: 8 }}>
            <Bookmark value={key} onChange={handleBookmarkChange}>
              <Bookmark.Item
                value="basicInfo"
                title={intl.formatMessage({ id: 'member.management.maintain.basic' })}
                icon={<ListIcon />}
              />
              <Bookmark.Item
                value="archiveInfo"
                title={intl.formatMessage({ id: 'member.management.maintain.detail.archivalInfo' })}
                icon={<FolderIcon />}
              />
              <Bookmark.Item
                value="levelInfo"
                visible={isConfigMember}
                title={intl.formatMessage({ id: 'member.management.maintain.detail.levelInfo' })}
                icon={<ChartIcon />}
              />
              <Bookmark.Item
                value="equityInfo"
                visible={isConfigMember}
                title={intl.formatMessage({ id: 'member.management.maintain.detail.equityInfo' })}
                icon={<AwardIcon />}
              />
              <Bookmark.Item
                value="sincerityInfo"
                visible={isConfigMember}
                title={intl.formatMessage({ id: 'member.management.maintain.detail.sincerityInfo' })}
                icon={<BulbIcon />}
              />
              <Bookmark.Item
                value="supplier"
                title={intl.formatMessage({ id: 'member.management.maintain.detail.supplier' })}
                icon={<CubeIcon />}
              />
              <Bookmark.Item
                value="changedInfo"
                title={intl.formatMessage({ id: 'member.management.maintain.detail.changedInfo' })}
                icon={<EditIcon />}
              />
            </Bookmark>
          </div>
        }
      >
        <MemberDetailsContextProvider
          value={{
            details: memberInfo,
            refreshDetails: getBasicInfo,
            onAnchorsReady: (values) => {
              handleAnchorsReady(values?.map((item) => ({ key: item.key, label: item.name })))
            },
          }}
        >
          {_renderChildren()}
        </MemberDetailsContextProvider>
      </PageHeaderWrapper>
    </Spin>
  )
}

export default MemberMaintainDetailed
