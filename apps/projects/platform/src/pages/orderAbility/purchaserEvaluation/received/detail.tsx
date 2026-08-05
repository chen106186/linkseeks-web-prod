/**
 * @Description 采购会员-收到的评价-详情组件
 */
import React, { useState, useEffect } from 'react'
import { PageHeader, Descriptions, Spin } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import { history } from '@linkseeks/router-manager'
import { getIntl } from '@linkseeks/i18n'
import { usePageStatus } from '@/hooks/usePageStatus'
import { getMemberCommentConsumerReceiveTradeHistoryGet } from '@apps/apis'
import { normalizeFiledata } from '@/utils'
import { NormalizedEvaluateItem } from '../utils'
import EvaluationForm from '../components/EvaluationForm'

const intl = getIntl()

interface OrderInfo {
  orderNo: string
  dealTime: string
  memberName: string
  orderType: number
}

const ReceivedDetail: React.FC = () => {
  const { id } = usePageStatus()
  const [orderInfo, setOrderInfo] = useState<OrderInfo>(null)
  const [evaluationInfo, setEvaluationInfo] = useState<NormalizedEvaluateItem[]>([])
  const [evaluationInfoLoading, setEvaluationInfoLoading] = useState(false)

  const getEvaluationInfo = () => {
    if (!id) {
      return
    }
    setEvaluationInfoLoading(true)
    getMemberCommentConsumerReceiveTradeHistoryGet({
      id,
    })
      .then((res) => {
        if (res.code === 1000) {
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
            },
          ])
          setOrderInfo({
            orderNo: res.data?.orderNo,
            dealTime: res.data?.dealTime as string,
            memberName: res.data?.memberName,
            orderType: res.data?.orderType,
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

  return (
    <Spin spinning={evaluationInfoLoading}>
      <PageHeaderWrapper
        title={orderInfo?.orderNo}
        content={
          <Descriptions
            size="small"
            column={3}
            style={{
              padding: '0 32px',
            }}
          >
            <Descriptions.Item label={intl.formatMessage({ id: 'purchaserEvaluation.gongyinghuiyuan' })}>
              {orderInfo?.memberName}
            </Descriptions.Item>
            <Descriptions.Item label={intl.formatMessage({ id: 'purchaserEvaluation.xiadanshijian' })} span={2}>
              {orderInfo?.dealTime}
            </Descriptions.Item>
          </Descriptions>
        }
      >
        <EvaluationForm
          value={{
            comments: evaluationInfo,
          }}
          ediabled={false}
          orderType={orderInfo?.orderType}
        />
      </PageHeaderWrapper>
    </Spin>
  )
}

export default ReceivedDetail
