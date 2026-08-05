/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-28 16:51:24
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-06-28 16:51:25
 * @Description:
 */
import React, { useState } from 'react'
import { history } from '@linkseeks/router-manager'
import { Button } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import { usePageStatus } from '@/hooks/usePageStatus'
import fetchDetailHoc from '../../common/hoc/fetchDetailHoc'
import CouponDetail from '../../components/CouponDetail'
import { getMarketingCouponWaitSubmitGet, postMarketingCouponWaitSubmitSubmitBatch } from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'

const MerchantCouponConfirm: React.FC = () => {
  const intl = useIntl()
  const { id } = usePageStatus()
  const [submitLoading, setSubmitLoading] = useState(false)

  const CouponDetailPro = fetchDetailHoc(
    {
      fetchDetail: (): Promise<any> =>
        getMarketingCouponWaitSubmitGet({
          id,
        }),
    },
    CouponDetail,
  )

  const handleSubmit = () => {
    setSubmitLoading(true)
    postMarketingCouponWaitSubmitSubmitBatch(
      {
        idList: [+id],
      },
      {
        timeout: 0,
      },
    )
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

  return (
    <div>
      <CouponDetailPro
        extra={
          <Button type="primary" icon={<CheckCircleOutlined />} loading={submitLoading} onClick={handleSubmit}>
            {intl.formatMessage({ id: 'merchantCoupon.submit' })}
          </Button>
        }
      />
    </div>
  )
}

export default MerchantCouponConfirm
