/*
 * @Author: XieZhiXiong
 * @Date: 2021-01-06 11:36:35
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 18:19:34
 * @Description: 会员等级信息详情
 */
import React, { useState, useEffect } from 'react'
import { Spin, Row, Col } from 'antd'
import {
  getMemberSupplierAbilityInfoDetailLevelBasic,
  getMemberSupplierAbilityInfoDetailLevelHistoryPage,
  GetMemberSupplierAbilityMaintenanceDetailLevelBasicResponse,
} from '@apps/apis'
import LevelInfo from '../../../components/MemberLevelInfo'
import MemberActivePointRecords, { ListItem } from '../../../components/MemberActivePointRecords'

const MemberLevelInfo: React.FC<any> = (props) => {
  const { validateId } = props
  const [levelInfo, setLevelInfo] = useState<GetMemberSupplierAbilityMaintenanceDetailLevelBasicResponse>(null)
  const [infoLoading, setInfoLoading] = useState(false)

  const getMemberSupplierLevelInfo = () => {
    if (!validateId) {
      return
    }
    setInfoLoading(true)
    getMemberSupplierAbilityInfoDetailLevelBasic({
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
    getMemberSupplierLevelInfo()
  }, [])

  const getActivePointRecords = (params) => {
    return new Promise<{ data: ListItem[]; totalCount: number }>((resolve, reject) => {
      getMemberSupplierAbilityInfoDetailLevelHistoryPage({
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

export default MemberLevelInfo
