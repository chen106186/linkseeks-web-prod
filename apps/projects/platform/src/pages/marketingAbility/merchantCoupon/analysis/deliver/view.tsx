/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-28 17:51:33
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-03 17:33:46
 * @Description: 商家优惠券发券
 */
import React, { useState, useEffect, useRef } from 'react'
import { Row, Col, Spin, Button, message } from 'antd'
import { SendOutlined } from '@ant-design/icons'
import { history } from '@linkseeks/router-manager'
import { usePageStatus } from '@/hooks/usePageStatus'
import {
  getMarketingCouponWaiteExecuteGrantGet,
  GetMarketingCouponWaiteExecuteGrantGetResponse,
  postMarketingCouponWaiteExecuteGrant,
} from '@apps/apis'
import { PageHeaderWrapper } from '@apps/components'
import BacisInfo from '../../components/BacisInfo'
import CouponRules from '../../components/CouponRules'
import DeliverCoupon, { ChangeValueItem } from '../../components/DeliverCoupon'
import { useIntl } from '@linkseeks/i18n'
import { AuthButton } from '@apps/components'
import { customAuthUrl as AuthUrl } from '@apps/domains'

const MerchantCouponAnalysisDeliver: React.FC<{}> = () => {
  const intl = useIntl()
  const { id } = usePageStatus()
  const [couponInfo, setCouponInfo] = useState<GetMarketingCouponWaiteExecuteGrantGetResponse>(null)
  const [infoLoading, setInfoLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const deliverRef = useRef<ChangeValueItem[]>([])

  const getBasicInfo = () => {
    if (!id) {
      return
    }
    setInfoLoading(true)
    getMarketingCouponWaiteExecuteGrantGet({
      id,
    })
      .then((res) => {
        if (res.code === 1000) {
          setCouponInfo(res.data)
        }
      })
      .finally(() => {
        setInfoLoading(false)
      })
  }

  useEffect(() => {
    getBasicInfo()
  }, [])

  const handleDeliverChange = (value: ChangeValueItem[]) => {
    deliverRef.current = value
  }

  const handleSubmit = () => {
    if (!id) {
      return
    }
    if (!deliverRef.current.length) {
      message.warning(`${intl.formatMessage({ id: 'merchantCoupon.Noticketdatathatcanbesubmitted' })}`)
      return
    }
    setSubmitLoading(true)
    postMarketingCouponWaiteExecuteGrant({
      id: +id,
      grantMembers: deliverRef.current.map((item) => ({
        subMemberId: item.memberId,
        subRoleId: item.roleId,
        subMemberName: item.name,
        suitableMemberType: item.suitableMemberType,
      })),
    })
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        setTimeout(() => {
          history.goBack()
        }, 800)
      })
      .finally(() => {
        setSubmitLoading(false)
      })
  }

  const anchorsArr = [
    {
      key: 'basicInfo',
      label: `${intl.formatMessage({ id: 'merchantCoupon.baseInfo' })}`,
    },
    {
      key: 'couponRules',
      label: intl.formatMessage({ id: 'merchantCoupon.couponRules' }),
    },
    {
      key: 'deliverCoupon',
      label: `${intl.formatMessage({ id: 'merchantCoupon.moneyDetail' })}`,
    },
  ].filter(Boolean)

  return (
    <Spin spinning={infoLoading}>
      <PageHeaderWrapper
        title={couponInfo?.name}
        items={anchorsArr}
        extra={
          <Button
            type="primary"
            icon={<SendOutlined style={{ transform: `rotate(-45deg)`, position: 'relative', top: -2 }} />}
            onClick={handleSubmit}
            loading={submitLoading}
          >
            {intl.formatMessage({ id: 'merchantCoupon.submit' })}
          </Button>
        }
      >
        <Row gutter={[16, 16]}>
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

          {/* 发券明细 */}
          <Col span={24}>
            <div id="deliverCoupon">
              <DeliverCoupon
                memberList={couponInfo?.memberList}
                suitableMemberLevelTypes={couponInfo?.suitableMemberLevelTypes}
                onChange={handleDeliverChange}
              />
            </div>
          </Col>
        </Row>
      </PageHeaderWrapper>
    </Spin>
  )
}

export default MerchantCouponAnalysisDeliver
