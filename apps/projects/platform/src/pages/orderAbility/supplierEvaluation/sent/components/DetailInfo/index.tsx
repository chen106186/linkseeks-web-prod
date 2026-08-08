/**
 * @Description 供应会员-发出的评价-详情组件
 */
import React, { useState, useEffect, useRef, useMemo } from 'react'
import { PageHeader, Descriptions, Spin, Button } from 'antd'
import { FormOutlined } from '@ant-design/icons'
import { PageHeaderWrapper } from '@apps/components'
import { history } from '@linkseeks/router-manager'
import { getIntl } from '@linkseeks/i18n'
import { getMemberCommentSupplySendTradeHistoryGet, postMemberCommentSupplySendTradeHistoryUpdate } from '@apps/apis'
import { normalizeFiledata } from '@/utils'
import { Helmet } from 'react-helmet'
import { NormalizedEvaluateItem } from '../../../../purchaserEvaluation/utils'
import EvaluationForm, {
  EvaluationFormRefHandle,
  EvaluationFormValue,
} from '../../../../purchaserEvaluation/components/EvaluationForm'

const intl = getIntl()
interface OrderInfo {
  orderNo: string
  dealTime: string
  memberName: string
  orderType: number
}

interface SupplierEvaluationInfoProps {
  /**
   * 评论id
   */
  id: string
  /**
   * 是否可编辑的
   */
  ediabled?: boolean
}

const SupplierEvaluationInfo: React.FC<SupplierEvaluationInfoProps> = ({ id, ediabled = false }) => {
  const [orderInfo, setOrderInfo] = useState<OrderInfo>(null)
  const [evaluationInfo, setEvaluationInfo] = useState<NormalizedEvaluateItem[]>([])
  const [evaluationInfoLoading, setEvaluationInfoLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)

  const EvaluationFormRef = useRef<EvaluationFormRefHandle | null>(null)

  const getEvaluationInfo = () => {
    if (!id) {
      return
    }
    setEvaluationInfoLoading(true)
    getMemberCommentSupplySendTradeHistoryGet({
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

  const handleRelease = () => {
    EvaluationFormRef?.current.submit()
  }

  const handleSubmit = (value: EvaluationFormValue) => {
    setSubmitLoading(true)
    const payload = value.comments.map((item) => {
      const { comment, picture, star } = item

      return {
        id: +id,
        star,
        comment,
        pics: picture.map((item) => item.status === 'done' && item.url).filter(Boolean),
      }
    })

    if (!payload.length) {
      return
    }

    postMemberCommentSupplySendTradeHistoryUpdate(payload[0])
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
              extra={
                <>
                  {ediabled && (
                    <Button
                      type="primary"
                      icon={<FormOutlined />}
                      disabled={!id}
                      loading={submitLoading}
                      onClick={handleRelease}
                    >
                      {intl.formatMessage({ id: 'supplierEvaluation.xiugai' })}
                    </Button>
                  )}
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
          ref={EvaluationFormRef}
          onSubmit={handleSubmit}
          ediabled={ediabled}
          orderType={orderInfo?.orderType}
        />
      </PageHeaderWrapper>
    </Spin>
  )
}

export default SupplierEvaluationInfo
