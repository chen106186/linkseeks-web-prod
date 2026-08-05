/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-28 10:12:31
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-02 17:48:44
 * @Description: 审核商家优惠券(一级)
 */
import React, { useState } from 'react'
import { Button } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import { history } from '@linkseeks/router-manager'
import { usePageStatus } from '@/hooks/usePageStatus'
import fetchDetailHoc from '../../common/hoc/fetchDetailHoc'
import CouponDetail from '../../components/CouponDetail'
import VerifyModal, { ValueType as VerifyData } from '../../components/VerifyModal'
import { getMarketingCouponWaitAuditOneGet, postMarketingCouponWaitAuditOneAudit } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'

const MerchantCouponVerify1: React.FC = () => {
  const intl = useIntl()
  const { id } = usePageStatus()
  const [visibleVerifyModal, setVisibleVerifyModal] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const CouponDetailPro = fetchDetailHoc(
    {
      fetchDetail: (): Promise<any> =>
        getMarketingCouponWaitAuditOneGet({
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
    postMarketingCouponWaitAuditOneAudit(
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
            {intl.formatMessage({ id: 'merchantCoupon.Documentaudit' })}
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

export default MerchantCouponVerify1
