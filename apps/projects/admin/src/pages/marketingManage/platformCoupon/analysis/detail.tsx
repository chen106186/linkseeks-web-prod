/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-28 17:49:52
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-03 17:30:14
 * @Description:
 */
import React, { useState, useEffect } from 'react'
import { Row, Col, Spin } from 'antd'
import { usePageStatus } from '@/hooks/usePageStatus'
import {
  getMarketingCouponPlatformWaiteExecuteGet,
  GetMarketingCouponPlatformWaiteExecuteGetResponse,
} from '@apps/apis'
import { findLastIndexFlowState } from '@/utils'
import { PageHeaderWrapper } from '@apps/components'
import AuditProcess from '@/components/AuditProcess'
import BacisInfo from '../components/BacisInfo'
import CouponRules from '../components/CouponRules'
import RunningInfo from '../components/RunningInfo'

const PlatformCouponAnalysisDetail: React.FC<{}> = () => {
  const { id } = usePageStatus()
  const [couponInfo, setCouponInfo] = useState<GetMarketingCouponPlatformWaiteExecuteGetResponse>()
  const [infoLoading, setInfoLoaading] = useState(false)

  const getBasicInfo = () => {
    if (!id) {
      return
    }
    setInfoLoaading(true)
    getMarketingCouponPlatformWaiteExecuteGet({
      id,
    })
      .then((res) => {
        if (res.code === 1000) {
          setCouponInfo(res.data)
        }
      })
      .finally(() => {
        setInfoLoaading(false)
      })
  }

  useEffect(() => {
    getBasicInfo()
  }, [])

  const anchorsArr = [
    {
      key: 'verifySteps',
      label: '流转进度',
    },
    {
      key: 'basicInfo',
      label: '基本信息',
    },
    {
      key: 'couponRules',
      label: '优惠券规则',
    },
    {
      key: 'runningInfo',
      label: '执行明细',
    },
  ].filter(Boolean)

  return (
    <Spin spinning={infoLoading}>
      <PageHeaderWrapper title={couponInfo?.name} items={anchorsArr}>
        <Row gutter={[16, 16]}>
          {/* 流转记录 */}
          <Col span={24}>
            <div id="verifySteps">
              <AuditProcess
                innerVerifySteps={couponInfo?.taskSteps.map((item) => ({
                  step: item.step,
                  stepName: item.taskName,
                  roleName: item.roleName,
                  status: item.isExecute ? 'finish' : 'wait',
                }))}
                innerVerifyCurrent={findLastIndexFlowState(couponInfo?.taskSteps as [])}
              />
            </div>
          </Col>

          {/* 基本信息 */}
          <Col span={24}>
            <div id="basicInfo">
              <BacisInfo
                dataSource={{
                  id: couponInfo?.id as number,
                  type: couponInfo?.type as number,
                  typeName: couponInfo?.typeName as string,
                  releaseTimeStart: couponInfo?.releaseTimeStart as number,
                  releaseTimeEnd: couponInfo?.releaseTimeEnd as number,
                  name: couponInfo?.name as string,
                  denomination: couponInfo?.denomination as number,
                  statusName: couponInfo?.statusName as string,
                  quantity: couponInfo?.quantity as number,
                }}
              />
            </div>
          </Col>

          {/* 优惠券规则 */}
          <Col span={24}>
            <div id="couponRules">
              <CouponRules
                dataSource={{
                  getWay: couponInfo?.getWay as number,
                  getWayName: couponInfo?.getWayName as string,
                  effectiveTimeStart: couponInfo?.effectiveTimeStart as number,
                  effectiveTimeEnd: couponInfo?.effectiveTimeEnd as number,
                  invalidDay: couponInfo?.invalidDay as number,
                  useConditionMoney: couponInfo?.useConditionMoney as number,
                  useConditionDesc: couponInfo?.useConditionDesc as string,
                  conditionGetDay: couponInfo?.conditionGetDay as number,
                  conditionGetTotal: couponInfo?.conditionGetTotal as number,
                }}
              />
            </div>
          </Col>

          {/* 优惠券规则 */}
          <Col span={24}>
            <div id="runningInfo">
              <RunningInfo couponId={+id} />
            </div>
          </Col>
        </Row>
      </PageHeaderWrapper>
    </Spin>
  )
}

export default PlatformCouponAnalysisDetail
