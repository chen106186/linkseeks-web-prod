/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-28 17:51:33
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-03 17:33:51
 * @Description: 商家优惠券发券
 */
import React, { useState, useEffect, useRef } from 'react'
import { Row, Col, Spin, Button, message } from 'antd'
import { SendOutlined } from '@ant-design/icons'
import { history } from '@linkseeks/router-manager'
import { usePageStatus } from '@/hooks/usePageStatus'
import {
  getMarketingCouponPlatformWaiteExecuteGrantGet,
  GetMarketingCouponPlatformWaiteExecuteGrantGetResponse,
  postMarketingCouponPlatformWaiteExecuteGrant,
} from '@apps/apis'
import { PageHeaderWrapper } from '@apps/components'
import BacisInfo from '../../components/BacisInfo'
import CouponRules from '../../components/CouponRules'
import DeliverCoupon, { ChangeValueItem } from '../../components/DeliverCoupon'

const PlatformCouponAnalysisDeliver: React.FC<{}> = () => {
  const { id } = usePageStatus()
  const [couponInfo, setCouponInfo] = useState<GetMarketingCouponPlatformWaiteExecuteGrantGetResponse>()
  const [infoLoading, setInfoLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const deliverRef = useRef<ChangeValueItem[]>([])

  const getBasicInfo = () => {
    if (!id) {
      return
    }
    setInfoLoading(true)
    getMarketingCouponPlatformWaiteExecuteGrantGet({
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
      message.warning('没有可提交的发券数据')
      return
    }
    setSubmitLoading(true)
    postMarketingCouponPlatformWaiteExecuteGrant({
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
      label: '基本信息',
    },
    {
      key: 'couponRules',
      label: '优惠券规则',
    },
    {
      key: 'deliverCoupon',
      label: '发券明细',
    },
  ].filter(Boolean)

  return (
    <Spin spinning={infoLoading}>
      <PageHeaderWrapper
        backDom
        title={couponInfo?.name}
        items={anchorsArr}
        extra={
          <Button
            type="primary"
            icon={<SendOutlined style={{ transform: `rotate(-45deg)`, position: 'relative', top: -2 }} />}
            onClick={handleSubmit}
            loading={submitLoading}
          >
            提交
          </Button>
        }
      >
        <Row gutter={[16, 16]}>
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

          {/* 发券明细 */}
          <Col span={24}>
            <div id="deliverCoupon">
              <DeliverCoupon
                memberList={couponInfo?.memberList as []}
                suitableMemberLevelTypes={couponInfo?.suitableMemberLevelTypes as []}
                onChange={handleDeliverChange}
              />
            </div>
          </Col>
        </Row>
      </PageHeaderWrapper>
    </Spin>
  )
}

export default PlatformCouponAnalysisDeliver
