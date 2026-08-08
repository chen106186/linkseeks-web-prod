/**
 * @Description 供应会员-收到的评价-详情组件
 */
import React, { useState, useEffect, useRef, useMemo } from 'react'
import { PageHeader, Descriptions, Spin } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import { history } from '@linkseeks/router-manager'
import { Helmet } from 'react-helmet'
import { getIntl } from '@linkseeks/i18n'
import { usePageStatus } from '@/hooks/usePageStatus'
import { getMemberCommentSupplyReceiveTradeHistoryGet } from '@apps/apis'
import { normalizeFiledata } from '@/utils'
import { NormalizedEvaluateItem } from '../../purchaserEvaluation/utils'
import EvaluationForm from '../../purchaserEvaluation/components/EvaluationForm'

const intl = getIntl()

interface OrderInfo {
  orderNo: string
  dealTime: string
  memberName: string
  orderType: number
}

const SupplierReceivedDetail: React.FC = () => {
  const { id } = usePageStatus()
  const [orderInfo, setOrderInfo] = useState<OrderInfo>(null)
  const [evaluationInfo, setEvaluationInfo] = useState<NormalizedEvaluateItem[]>([])
  const [evaluationInfoLoading, setEvaluationInfoLoading] = useState(false)

  const getEvaluationInfo = () => {
    if (!id) {
      return
    }
    setEvaluationInfoLoading(true)
    getMemberCommentSupplyReceiveTradeHistoryGet({
      id,
    })
      .then((res) => {
        if (res.code === 1000) {
          const { product } = res.data

          setEvaluationInfo([
            {
              good: {
                pic: res.data.productImgUrl,
                productName: res.data.product,
                unit: res.data.unit,
                price: res.data.price,
                purchaseCount: res.data.purchaseCount,
                totalPrice: res.data.totalPrice,
              },
              star: res.data.star,
              comment: res.data.comment,
              picture: res.data.pics ? res.data.pics.map((item) => normalizeFiledata(item)) : [],
              smile: res.data.star,
              replyContent: res.data.replyContent,
              replyTime: res.data.replyTime as string,
            },
          ])
          setOrderInfo({
            orderNo: res.data.orderNo,
            dealTime: res.data.dealTime as string,
            memberName: res.data.memberName,
            orderType: res.data.orderType,
          })
        }
      })
      .catch((err) => {
        console.warn(err)
      })
      .finally(() => {
        setEvaluationInfoLoading(false)
      })
  }

  useEffect(() => {
    getEvaluationInfo()
  }, [])

  const productName = useMemo(() => {
    if (evaluationInfo && evaluationInfo.length > 0) {
      return evaluationInfo[0]?.good?.productName
    }
    return ''
  }, [evaluationInfo])

  return (
    <Spin spinning={evaluationInfoLoading}>
      <Helmet>
        <title>{productName}</title>
      </Helmet>
      <PageHeaderWrapper
        backDom={false}
        title={
          <>
            <PageHeader
              style={{ padding: '0' }}
              onBack={() => history.goBack()}
              title={orderInfo?.orderNo}
              extra={<></>}
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
                  {orderInfo?.dealTime}
                </Descriptions.Item>
              </Descriptions>
            </PageHeader>
          </>
        }
      >
        <EvaluationForm
          value={{
            comments: evaluationInfo,
          }}
          ediabled={false}
          orderType={orderInfo?.orderType}
          interpretation
        />
      </PageHeaderWrapper>
    </Spin>
  )
}

export default SupplierReceivedDetail
