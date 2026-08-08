/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-06 11:36:35
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 18:02:20
 * @Description: 会员权益信息详情
 */
import React, { useEffect, useState, useContext } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Spin, Row, Col } from 'antd'
import {
  getMemberCustomerAbilityMaintenanceDetailRightBasic,
  GetMemberCustomerAbilityMaintenanceDetailRightBasicResponse,
  getMemberCustomerAbilityMaintenanceDetailRightHistoryPage,
  getMemberCustomerAbilityMaintenanceDetailRightSpendHistoryPage,
} from '@apps/apis'
import MemberDetailsContext from '../../../../memberDetailsContext'
import MemberRightsAnalysis from '../../../../components/MemberRightsAnalysis'
import MemberRights from '../../../../components/MemberRights'
import MemberRightsRecords, { ReceivedData, UsageData } from '../../../../components/MemberRightsRecords'

const CustomerEquityInfo: React.FC<any> = (props) => {
  const { id, validateId } = props
  const [equityInfo, setEquityInfo] = useState<GetMemberCustomerAbilityMaintenanceDetailRightBasicResponse>(null)
  const [infoLoading, setInfoLoading] = useState(false)

  const contenxt = useContext(MemberDetailsContext)

  const intl = useIntl()

  const getEquityInfo = () => {
    setInfoLoading(true)
    getMemberCustomerAbilityMaintenanceDetailRightBasic({
      memberId: id,
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
        name: intl.formatMessage({ id: 'customerAbility.management.maintain.basic' }),
      },
      {
        key: 'customerAbilityEquity',
        name: intl.formatMessage({ id: 'customerAbility.management.maintain.detail.memberEquity' }),
      },
      {
        key: 'equityRecords',
        name: intl.formatMessage({ id: 'customerAbility.management.maintain.detail.equityRecords' }),
      },
    ]
    contenxt.onAnchorsReady(anchors)
  }, [])

  const getReceivedList = (params) => {
    return new Promise<{ data: ReceivedData[]; totalCount: number }>((resolve, reject) => {
      getMemberCustomerAbilityMaintenanceDetailRightHistoryPage({
        memberId: id,
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
      getMemberCustomerAbilityMaintenanceDetailRightSpendHistoryPage({
        memberId: id,
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

export default CustomerEquityInfo
