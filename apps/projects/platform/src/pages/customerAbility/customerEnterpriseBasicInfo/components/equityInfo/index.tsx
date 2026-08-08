/*
 * @Description: 供应商权益信息详情
 */
import React, { useContext, useEffect, useState } from 'react'
import { Spin, Row, Col } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import {
  getMemberCustomerAbilityInfoDetailRightBasic,
  getMemberCustomerAbilityInfoDetailRightHistoryPage,
  getMemberCustomerAbilityInfoDetailRightSpendHistoryPage,
  GetMemberCustomerAbilityMaintenanceDetailRightBasicResponse,
} from '@apps/apis'
import MemberDetailsContext from '../../../memberDetailsContext'
import MemberRightsAnalysis from '../../../components/MemberRightsAnalysis'
import MemberRights from '../../../components/MemberRights'
import MemberRightsRecords, { ReceivedData, UsageData } from '../../../components/MemberRightsRecords'

const MemberRightsInfo: React.FC<any> = (props) => {
  const { validateId } = props
  const [equityInfo, setEquityInfo] = useState<GetMemberCustomerAbilityMaintenanceDetailRightBasicResponse>(null)
  const [infoLoading, setInfoLoading] = useState(false)
  const contenxt = useContext(MemberDetailsContext)

  const intl = useIntl()

  const getEquityInfo = () => {
    setInfoLoading(true)
    getMemberCustomerAbilityInfoDetailRightBasic({
      validateId,
    })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        setEquityInfo(res.data)
      })
      .catch((err) => {
        console.warn(err)
      })
      .finally(() => {
        setInfoLoading(false)
      })
  }

  useEffect(() => {
    getEquityInfo()
  }, [])

  useEffect(() => {
    const anchors = [
      {
        key: 'basicInfo',
        label: intl.formatMessage({ id: 'customerAbility.management.maintain.basic' }),
      },
      {
        key: 'customerAbilityEquity',
        label: intl.formatMessage({ id: 'customerAbility.management.maintain.detail.memberEquity' }),
      },
      {
        key: 'equityRecords',
        label: intl.formatMessage({ id: 'customerAbility.management.maintain.detail.equityRecords' }),
      },
    ]
    contenxt?.onAnchorsReady(anchors)
  }, [])

  const getReceivedList = (params) => {
    return new Promise<{ data: ReceivedData[]; totalCount: number }>((resolve, reject) => {
      getMemberCustomerAbilityInfoDetailRightHistoryPage({
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

  const getUsageList = (params) => {
    return new Promise<{ data: UsageData[]; totalCount: number }>((resolve, reject) => {
      getMemberCustomerAbilityInfoDetailRightSpendHistoryPage({
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
        {/* 基本信息 */}
        <Col span={24}>
          <div id="basicInfo">
            <MemberRightsAnalysis
              data={{
                sumReturnMoney: equityInfo?.sumReturnMoney,
                sumUsedPoint: equityInfo?.sumUsedPoint,
                sumPoint: equityInfo?.sumPoint,
              }}
            />
          </div>
        </Col>

        {/* 会员权益 */}
        <Col span={24}>
          <div id="customerAbilityEquity">
            <MemberRights data={equityInfo?.rights} />
          </div>
        </Col>

        {/* 会员权益 */}
        <Col span={24}>
          <div id="equityRecords">
            <MemberRightsRecords fetchReceivedList={getReceivedList} fetchUsageList={getUsageList} />
          </div>
        </Col>
      </Row>
    </Spin>
  )
}

export default MemberRightsInfo
