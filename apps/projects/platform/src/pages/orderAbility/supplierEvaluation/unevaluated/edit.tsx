/**
 * @Description 供应会员-待评价订单-评价
 */
import React, { useState, useEffect, useRef } from 'react'
import { PageHeader, Descriptions, Spin, Button } from 'antd'
import { FormOutlined } from '@ant-design/icons'
import { PageHeaderWrapper } from '@apps/components'
import { history } from '@linkseeks/router-manager'
import { getIntl } from '@linkseeks/i18n'
import { usePageStatus } from '@/hooks/usePageStatus'
import {
  getMemberCommentSupplyOrderTradeDetail,
  GetMemberCommentSupplyOrderTradeDetailResponse,
  postMemberCommentSupplyOrderTradeSubmit,
} from '@apps/apis'
import { normalizeUnevaluatedList, NormalizedEvaluateItem } from '../../purchaserEvaluation/utils'
import EvaluationForm, {
  EvaluationFormRefHandle,
  EvaluationFormValue,
} from '../../purchaserEvaluation/components/EvaluationForm'

const intl = getIntl()
interface OrderInfo extends GetMemberCommentSupplyOrderTradeDetailResponse {
  unevaluatedList: NormalizedEvaluateItem[]
}

const SupplierEvaluateOrder: React.FC = () => {
  const { id } = usePageStatus()
  const [orderInfo, setOrderInfo] = useState<OrderInfo>(null)
  const [infoLoading, setInfoLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const EvaluationFormRef = useRef<EvaluationFormRefHandle | null>(null)

  const getOrderInfo = () => {
    if (!id) {
      return
    }
    setInfoLoading(true)
    getMemberCommentSupplyOrderTradeDetail({
      id,
    })
      .then((res) => {
        if (res.code === 1000) {
          const { orderProductCommentList } = res.data
          const unevaluatedList = normalizeUnevaluatedList(orderProductCommentList)
          setOrderInfo({
            ...res.data,
            unevaluatedList,
          })
        }
      })
      .finally(() => {
        setInfoLoading(false)
      })
  }

  useEffect(() => {
    getOrderInfo()
  }, [])

  const handleRelease = () => {
    EvaluationFormRef?.current.submit()
  }

  const handleSubmit = (value: EvaluationFormValue) => {
    setSubmitLoading(true)
    const payload = value.comments.map((item) => {
      const { comment, good, picture, star } = item

      // 被评价方是 采购会员（订单创建者数据）
      return {
        star,
        comment,
        orderProductId: good.orderProductId,
        pics: picture.map((item) => item.status === 'done' && item.url).filter(Boolean),
      }
    })

    postMemberCommentSupplyOrderTradeSubmit({
      orderId: orderInfo.orderId,
      commentSubmitDetailList: payload,
    })
      .then((res) => {
        if (res.code === 1000) {
          setTimeout(() => {
            history.goBack()
          }, 800)
        } else {
          setSubmitLoading(false)
        }
      })
      .catch(() => {
        setSubmitLoading(false)
      })
  }

  return (
    <Spin spinning={infoLoading}>
      <PageHeaderWrapper
        backDom={false}
        title={
          <>
            <PageHeader
              style={{ padding: '0' }}
              onBack={() => history.goBack()}
              title={orderInfo?.orderNo}
              extra={
                <>
                  <Button
                    type="primary"
                    icon={<FormOutlined />}
                    disabled={!orderInfo}
                    loading={submitLoading}
                    onClick={handleRelease}
                  >
                    {intl.formatMessage({ id: 'supplierEvaluation.fabu' })}
                  </Button>
                </>
              }
            >
              <Descriptions
                size="small"
                column={3}
                style={{
                  padding: '0 32px',
                }}
              >
                <Descriptions.Item label={intl.formatMessage({ id: 'supplierEvaluation.caigouhuiyuan' })}>
                  {orderInfo?.memberName}
                </Descriptions.Item>
                <Descriptions.Item label={intl.formatMessage({ id: 'supplierEvaluation.xiadanshijian' })} span={2}>
                  {orderInfo?.createTime}
                </Descriptions.Item>
              </Descriptions>
            </PageHeader>
          </>
        }
      >
        <EvaluationForm
          value={{
            comments: orderInfo ? orderInfo.unevaluatedList : [],
          }}
          ref={EvaluationFormRef}
          onSubmit={handleSubmit}
          orderType={orderInfo?.orderType}
          ediabled
        />
      </PageHeaderWrapper>
    </Spin>
  )
}

export default SupplierEvaluateOrder
