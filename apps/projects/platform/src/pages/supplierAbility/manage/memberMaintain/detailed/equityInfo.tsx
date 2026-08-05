/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-06 11:36:35
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 18:02:20
 * @Description: 会员权益信息详情
 */
import React, { useEffect, useState } from 'react'
import { Spin, Row, Col } from 'antd'
import {
  getMemberSupplierAbilityMaintenanceDetailRightBasic,
  GetMemberSupplierAbilityMaintenanceDetailRightBasicResponse,
  getMemberSupplierAbilityMaintenanceDetailRightHistoryPage,
  getMemberSupplierAbilityMaintenanceDetailRightSpendHistoryPage,
} from '@apps/apis'
import MemberRightsAnalysis from '../../../components/MemberRightsAnalysis'
import MemberRights from '../../../components/MemberRights'
import MemberRightsRecords, { ReceivedData, UsageData } from '../../../components/MemberRightsRecords'

const MemberRightsInfo: React.FC<any> = (props) => {
  const { id, validateId } = props
  const [equityInfo, setEquityInfo] = useState<GetMemberSupplierAbilityMaintenanceDetailRightBasicResponse>(null)
  const [infoLoading, setInfoLoading] = useState(false)

  const getEquityInfo = () => {
    setInfoLoading(true)
    getMemberSupplierAbilityMaintenanceDetailRightBasic({
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

  const getReceivedList = (params) => {
    return new Promise<{ data: ReceivedData[]; totalCount: number }>((resolve, reject) => {
      getMemberSupplierAbilityMaintenanceDetailRightHistoryPage({
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
      getMemberSupplierAbilityMaintenanceDetailRightSpendHistoryPage({
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
          <div id="memberEquity">
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
