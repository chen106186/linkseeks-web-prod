/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-28 17:49:52
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-02 11:04:40
 * @Description:
 */
import React, { useState, useEffect } from 'react'
import { Row, Col, Spin } from 'antd'
import { usePageStatus } from '@/hooks/usePageStatus'
import { getMarketingCouponWaiteExecuteGet, GetMarketingCouponWaiteExecuteGetResponse } from '@apps/apis'
import { findLastIndexFlowState } from '@/utils'
import { PageHeaderWrapper } from '@apps/components'
import AuditProcess from '@/components/AuditProcess'
import BacisInfo from '../../components/BacisInfo'
import CouponRules from '../../components/CouponRules'
import RunningInfo from '../../components/RunningInfo'
import { useIntl } from '@linkseeks/i18n'

const MerchantCouponAnalysisDetail: React.FC<{}> = () => {
  const intl = useIntl()
  const { id } = usePageStatus()
  const [couponInfo, setCouponInfo] = useState<GetMarketingCouponWaiteExecuteGetResponse>(null)
  const [infoLoading, setInfoLoaading] = useState(false)

  const getBasicInfo = () => {
    if (!id) {
      return
    }
    setInfoLoaading(true)
    getMarketingCouponWaiteExecuteGet({
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
      label: intl.formatMessage({ id: 'merchantCoupon.CirculationProgress' }),
    },
    {
      key: 'basicInfo',
      label: intl.formatMessage({ id: 'merchantCoupon.baseInfo' }),
    },
    {
      key: 'couponRules',
      label: intl.formatMessage({ id: 'merchantCoupon.couponRules' }),
    },
    {
      key: 'runningInfo',
      label: intl.formatMessage({ id: 'merchantCoupon.runningInfo' }),
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
                innerVerifyCurrent={findLastIndexFlowState(couponInfo?.taskSteps)}
                id="verifySteps"
              />
            </div>
          </Col>

          {/* 基本信息 */}
          <Col span={24}>
            <div id="basicInfo">
              <BacisInfo
                dataSource={{
                  id: couponInfo?.id,
                  type: couponInfo?.type,
                  typeName: couponInfo?.typeName,
                  releaseTimeStart: couponInfo?.releaseTimeStart,
                  releaseTimeEnd: couponInfo?.releaseTimeEnd,
                  name: couponInfo?.name,
                  denomination: couponInfo?.denomination,
                  statusName: couponInfo?.statusName,
                  quantity: couponInfo?.quantity,
                }}
              />
            </div>
          </Col>

          {/* 优惠券规则 */}
          <Col span={24}>
            <div id="couponRules">
              <CouponRules
                dataSource={{
                  getWay: couponInfo?.getWay,
                  getWayName: couponInfo?.getWayName,
                  effectiveTimeStart: couponInfo?.effectiveTimeStart,
                  effectiveTimeEnd: couponInfo?.effectiveTimeEnd,
                  invalidDay: couponInfo?.invalidDay,
                  useConditionMoney: couponInfo?.useConditionMoney,
                  useConditionDesc: couponInfo?.useConditionDesc,
                  conditionGetDay: couponInfo?.conditionGetDay,
                  conditionGetTotal: couponInfo?.conditionGetTotal,
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

export default MerchantCouponAnalysisDetail
