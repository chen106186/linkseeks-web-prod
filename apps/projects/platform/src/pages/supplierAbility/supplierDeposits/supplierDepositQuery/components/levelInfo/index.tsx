/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-06 11:36:35
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 18:03:22
 * @Description: 会员等级信息详情
 */
import React, { useState, useEffect, useContext } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Spin, Row, Col } from 'antd'
import {
  getMemberSupplierAbilityMaintenanceDetailLevelBasic,
  GetMemberSupplierAbilityMaintenanceDetailLevelBasicResponse,
  getMemberSupplierAbilityMaintenanceDetailLevelHistoryPage,
} from '@apps/apis'
import MemberDetailsContext from '../../../../memberDetailsContext'
import LevelInfo from '../../../../components/MemberLevelInfo'
import MemberActivePointRecords, { ListItem } from '../../../../components/MemberActivePointRecords'

const SupplierLevelInfo: React.FC<any> = (props) => {
  const { id, validateId } = props
  const [levelInfo, setLevelInfo] = useState<GetMemberSupplierAbilityMaintenanceDetailLevelBasicResponse>(null)
  const [infoLoading, setInfoLoading] = useState(false)

  const contenxt = useContext(MemberDetailsContext)

  const intl = useIntl()

  const getSupplierLevelInfo = () => {
    if (!id && !validateId) {
      return
    }
    setInfoLoading(true)
    getMemberSupplierAbilityMaintenanceDetailLevelBasic({
      memberId: id,
      validateId,
    })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        setLevelInfo(res.data)
      })
      .catch((err) => {
        console.warn(err)
      })
      .finally(() => {
        setInfoLoading(false)
      })
  }

  useEffect(() => {
    getSupplierLevelInfo()
  }, [])

  useEffect(() => {
    const anchors = [
      {
        key: 'memberLevel',
        name: intl.formatMessage({ id: 'member.management.maintain.detail.memberLevel' }),
      },
      {
        key: 'activePoints',
        name: intl.formatMessage({ id: 'member.management.maintain.detail.activePoints' }),
      },
    ]
    contenxt.onAnchorsReady(anchors)
  }, [])

  const getActivePointRecords = (params) => {
    return new Promise<{ data: ListItem[]; totalCount: number }>((resolve, reject) => {
      getMemberSupplierAbilityMaintenanceDetailLevelHistoryPage({
        memberId: id,
        validateId,
        ...params,
      })
        .then((res) => {
          const { data = [], totalCount = 0 } = res.data || {}
          resolve({ data, totalCount })
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  return (
    <Spin spinning={infoLoading}>
      <Row gutter={[16, 16]}>
        {/* 会员等级信息 */}
        <Col span={24}>
          <div id="memberLevel">
            <LevelInfo
              levelInfo={{
                level: levelInfo?.levelTag,
                score: levelInfo?.score,
                nextLevel: levelInfo?.nextLevelTag,
                nextScore: levelInfo?.nextScore,
              }}
              chartData={levelInfo?.points}
            />
          </div>
        </Col>

        {/* 会员等级信息 */}
        <Col span={24}>
          <div id="activePoints">
            <MemberActivePointRecords fetchList={getActivePointRecords} />
          </div>
        </Col>
      </Row>
    </Spin>
  )
}

export default SupplierLevelInfo
