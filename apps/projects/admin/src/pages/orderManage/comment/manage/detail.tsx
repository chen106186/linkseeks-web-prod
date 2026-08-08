/*
 * @Author: XieZhiXiong
 * @Date: 2020-09-23 11:02:03
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2020-12-04 11:21:50
 * @Description:
 */
import React, { useState, useEffect } from 'react'
import { PageHeader, Descriptions, Spin, message } from 'antd'
import { history } from '@linkseeks/router-manager'
// import { GetOrderPlatformOrderDetailsResponse } from '@apps/apis';
import { PageHeaderWrapper } from '@apps/components'
import { createFormActions, Rating } from '@apps/formily'
import { usePageStatus } from '@/hooks/usePageStatus'
import AvatarWrap from '@/components/AvatarWrap'
import NiceForm from '@/components/NiceForm'
import { evaluateSchema } from './schema/evaluate'
import type { Unevaluated } from '../utils'
import { normalizeUnevaluatedList } from '../utils'
import EvaluationList from './components/EvaluationList'
import { getMemberPlatformCommentOrderTradeHistoryGet } from '@apps/apis'

const formActions = createFormActions()

interface OrderInfo {
  // 下单时间
  created: string
  // 订单号
  orderNo: string
}

const CommentManageDetailed: React.FC = () => {
  const { id, orderId } = usePageStatus()
  const [orderInfo, setOrderInfo] = useState<OrderInfo>()
  const [commentInfo, setCommentInfo] = useState<Unevaluated[]>([])
  const [commentInfoLoading, setCommentInfoLoading] = useState(false)

  // 获取订单详情
  const getOrderInfo = (data) => {
    if (!data || !data.id) {
      return
    }
    return {
      created: data.dealTime,
      orderNo: data.orderNo,
    }
  }

  // 获取评论详情
  const getCommentInfo = () => {
    if (!id) {
      return
    }
    setCommentInfoLoading(true)
    getMemberPlatformCommentOrderTradeHistoryGet({
      id,
    })
      .then((res) => {
        if (res.code === 1000) {
          setCommentInfo(normalizeUnevaluatedList([res.data]))
          setOrderInfo(getOrderInfo(res.data))
        }
      })
      .catch((err) => {
        console.warn(err)
      })
      .finally(() => {
        setCommentInfoLoading(false)
      })
  }

  useEffect(() => {
    getCommentInfo()
  }, [])

  const beforeUpload = (file) => {
    if (file.size / 1024 < 10) {
      message.warning('图片大小超过10M')
      return Promise.reject()
    }
  }

  return (
    <Spin spinning={commentInfoLoading}>
      <PageHeaderWrapper
        backDom={false}
        title={
          <>
            <PageHeader
              style={{ padding: '0' }}
              onBack={() => history.goBack()}
              title={
                <AvatarWrap
                  info={{
                    aloneTxt: '单',
                    name: orderInfo ? orderInfo.orderNo : '',
                  }}
                />
              }
            >
              <Descriptions
                size="small"
                column={3}
                style={{
                  padding: '0 32px',
                }}
              >
                <Descriptions.Item label="下单时间" span={2}>
                  {orderInfo?.created}
                </Descriptions.Item>
              </Descriptions>
            </PageHeader>
          </>
        }
      >
        <NiceForm
          layout="vertical"
          actions={formActions}
          initialValues={{
            comments: commentInfo,
          }}
          editable={false}
          expressionScope={{
            UploadTip: null,
            beforeUpload,
          }}
          onSubmit={() => {}}
          components={{
            EvaluationList,
            Rating,
          }}
          effects={($, actions) => {}}
          schema={evaluateSchema}
          previewPlaceholder=" "
        />
      </PageHeaderWrapper>
    </Spin>
  )
}

export default CommentManageDetailed
