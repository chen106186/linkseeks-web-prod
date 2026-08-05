/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-28 16:44:15
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-02 17:48:56
 * @Description:
 */
import React, { useState } from 'react'
import { Button } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import { history } from '@linkseeks/router-manager'
import { usePageStatus } from '@/hooks/usePageStatus'
import fetchDetailHoc from '../../common/hoc/fetchDetailHoc'
import CouponDetail from '../../components/CouponDetail'
import VerifyModal, { ValueType as VerifyData } from '../../components/VerifyModal'
import { getMarketingCouponPlatformWaitAuditTwoGet, postMarketingCouponPlatformWaitAuditTwoAudit } from '@apps/apis'

const PlatformCouponVerify2: React.FC = () => {
  const { id } = usePageStatus()
  const [visibleVerifyModal, setVisibleVerifyModal] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const CouponDetailPro = fetchDetailHoc(
    {
      fetchDetail: (): Promise<any> =>
        getMarketingCouponPlatformWaitAuditTwoGet({
          id,
        }),
    },
    CouponDetail,
  )

  const handleVisibleVerifyModal = (flag?) => {
    setVisibleVerifyModal(!!flag)
  }

  const handleSubmit = (value: VerifyData) => {
    setSubmitLoading(true)
    postMarketingCouponPlatformWaitAuditTwoAudit(
      {
        id: +id,
        ...value,
      },
      {
        timeout: 0,
      },
    )
      .then((res) => {
        if (res.code !== 1000) {
          return
        }
        handleVisibleVerifyModal(false)
        setTimeout(() => {
          history.goBack()
        }, 800)
      })
      .finally(() => {
        setSubmitLoading(false)
      })
  }

  return (
    <div>
      <CouponDetailPro
        extra={
          <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => handleVisibleVerifyModal(true)}>
            单据审核
          </Button>
        }
      />

      <VerifyModal
        visible={visibleVerifyModal}
        onClose={() => handleVisibleVerifyModal(false)}
        submitLoading={submitLoading}
        onSubmit={handleSubmit}
      />
    </div>
  )
}

export default PlatformCouponVerify2
