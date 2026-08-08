/*
 * @Description: 供应商等级信息详情
 */
import React, { useContext, useState, useEffect } from 'react'
import { Spin, Row, Col } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import {
  getMemberCustomerAbilityInfoDetailLevelBasic,
  getMemberCustomerAbilityInfoDetailLevelHistoryPage,
  GetMemberCustomerAbilityMaintenanceDetailLevelBasicResponse,
} from '@apps/apis'
import LevelInfo from '../../../components/MemberLevelInfo'
import MemberDetailsContext from '../../../memberDetailsContext'
import MemberActivePointRecords, { ListItem } from '../../../components/MemberActivePointRecords'

const MemberLevelInfo: React.FC<any> = (props) => {
  const { validateId } = props
  const [levelInfo, setLevelInfo] = useState<GetMemberCustomerAbilityMaintenanceDetailLevelBasicResponse>(null)
  const [infoLoading, setInfoLoading] = useState(false)
  const contenxt = useContext(MemberDetailsContext)

  const intl = useIntl()

  const getMemberCustomerLevelInfo = () => {
    if (!validateId) {
      return
    }
    setInfoLoading(true)
    getMemberCustomerAbilityInfoDetailLevelBasic({
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
    getMemberCustomerLevelInfo()
  }, [])

  useEffect(() => {
    const anchors = [
      {
        key: 'customerAbilityLevel',
        label: intl.formatMessage({ id: 'customerAbility.management.maintain.detail.memberLevel' }),
      },
      {
        key: 'activePoints',
        label: intl.formatMessage({ id: 'customerAbility.management.maintain.detail.activePoints' }),
      },
    ]
    contenxt?.onAnchorsReady(anchors)
  }, [])

  const getActivePointRecords = (params) => {
    return new Promise<{ data: ListItem[]; totalCount: number }>((resolve, reject) => {
      getMemberCustomerAbilityInfoDetailLevelHistoryPage({
        validateId,
        ...params,
      })
        .then((res) => {
          const { data = [], totalCount = 0 } = res.data
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
          <div id="customerAbilityLevel">
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

export default MemberLevelInfo
