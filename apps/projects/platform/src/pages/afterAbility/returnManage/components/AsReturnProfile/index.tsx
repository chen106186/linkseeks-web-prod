/**
 * @Description: 售后退货申请信息
 */
import React, { Suspense, useMemo } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Spin, Row, Col, Badge } from 'antd'
import { GetAftersalesReturnGoodsGetDetailBySupplierResponse } from '@apps/apis'
import {
  RETURN_OUTER_STATUS_FINISHED,
  RETURN_OUTER_STATUS_NOT_RECEIVED,
  RETURN_OUTER_STATUS_TO_BE_REFUNDED,
  RETURN_OUTER_STATUS_UNCONFIRMED_FINISHED,
  RETURN_OUTER_STATUS_UNCONFIRMED_REFUNDED,
} from '@/constants/afterService'
import { ORDER_TYPE } from '@/constants/order'
import { findLastIndexFlowState, normalizeFiledata } from '@/utils'
import { PageHeaderWrapper } from '@apps/components'
import AuditProcess from '@/components/AuditProcess'
import StatusTag from '@/components/StatusTag'
import { isMaterialOrder } from '../../../utils'
import { RETURN_INNER_STATUS_BADGE_MAP, RETURN_OUTER_STATUS_TAG_MAP } from '../../../constants'
import { AsFlowRecordsProps } from '../../../components/FlowRecords'

const BasicInfo = React.lazy(() => import('../../../components/BasicInfo'))
const AsRefundProductList = React.lazy(() => import('../../../components/AsRefundProductList'))
const FileList = React.lazy(() => import('../../../components/FileList'))
const AsAddressCard = React.lazy(() => import('../../../components/AsAddressCard'))
const Score = React.lazy(() => import('../../../components/Score'))
const ReturnAnalysis = React.lazy(() => import('../../../components/ReturnAnalysis'))
const ReturnDetailInfo = React.lazy(() => import('../../../components/ReturnDetailInfo'))
const FlowRecords = React.lazy(() => import('../../../components/FlowRecords'))

export type AsReturnInfo = GetAftersalesReturnGoodsGetDetailBySupplierResponse & {}

interface AsReturnProfileProps extends Pick<AsFlowRecordsProps, 'fetchOuterHistory' | 'fetchInnerHistory'> {
  /**
   * 数据
   */
  data: AsReturnInfo
  /**
   * 数据 loading
   */
  loading: boolean
  /**
   * 订单详情路由前缀，
   */
  orderDetailedPrefix: string
  /**
   * 拓展区域
   */
  extra?: (info: AsReturnInfo) => React.ReactNode
}

const AsReturnProfile: React.FC<AsReturnProfileProps> = (props: AsReturnProfileProps) => {
  const { data, loading, orderDetailedPrefix, fetchOuterHistory, fetchInnerHistory, extra } = props

  const intl = useIntl()

  const isMateriel = isMaterialOrder(data?.orderType)

  const anchorsArr = [
    {
      key: 'taskList',
      label: intl.formatMessage({ id: 'afterService.common.return.anchors.taskList', defaultMessage: '流转进度' }),
    },
    {
      key: 'basicInfo',
      label: intl.formatMessage({ id: 'afterService.common.return.anchors.basicInfo', defaultMessage: '基本信息' }),
    },
    {
      key: 'goodsDetailList',
      label: intl.formatMessage({
        id: 'afterService.common.return.anchors.refundProducts',
        defaultMessage: '退货商品',
      }),
    },
    {
      key: 'faultFileList',
      label: intl.formatMessage({ id: 'afterService.common.return.anchors.faultFileList', defaultMessage: '附件' }),
    },
    {
      key: 'returnGoodsAddress',
      label: intl.formatMessage({
        id: 'afterService.common.return.anchors.returnGoodsAddress',
        defaultMessage: '退货收货地址',
      }),
    },
    data && data.outerStatus === RETURN_OUTER_STATUS_FINISHED
      ? {
          key: 'evaluate',
          label: intl.formatMessage({ id: 'afterService.common.return.anchors.evaluate', defaultMessage: '售后评价' }),
        }
      : null,
    data && data.returnDeliveryGoodsList && data.returnDeliveryGoodsList.length > 0
      ? {
          key: 'returnDeliveryGoodsList',
          label: intl.formatMessage({
            id: 'afterService.common.return.anchors.returnDeliveryGoodsList',
            defaultMessage: '退货发货信息',
          }),
        }
      : null,
    data &&
    !isMateriel &&
    (data.outerStatus === RETURN_OUTER_STATUS_TO_BE_REFUNDED ||
      data.outerStatus === RETURN_OUTER_STATUS_UNCONFIRMED_REFUNDED ||
      data.outerStatus === RETURN_OUTER_STATUS_NOT_RECEIVED ||
      data.outerStatus === RETURN_OUTER_STATUS_UNCONFIRMED_FINISHED ||
      data.outerStatus === RETURN_OUTER_STATUS_FINISHED)
      ? {
          key: 'refundList',
          label: intl.formatMessage({
            id: 'afterService.common.return.anchors.refundList',
            defaultMessage: '退款明细',
          }),
        }
      : null,
    {
      key: 'workflowRecord',
      label: intl.formatMessage({
        id: 'afterService.common.return.anchors.workflowRecord',
        defaultMessage: '流转记录',
      }),
    },
  ].filter(Boolean)

  const BasicInfoData = [
    {
      title: intl.formatMessage({ id: 'afterService.common.basicInfo.applyNo', defaultMessage: '申请单号' }),
      value: data && data.applyNo ? data.applyNo : '',
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.basicInfo.orderType', defaultMessage: '售后订单类型' }),
      value: data && data.orderType ? ORDER_TYPE[data.orderType] : '',
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.basicInfo.applyTime', defaultMessage: '单据时间' }),
      value: data && data.applyTime ? data.applyTime : '',
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.basicInfo.applyAbstract', defaultMessage: '申请摘要' }),
      value: data && data.applyAbstract ? data.applyAbstract : '',
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.basicInfo.consumerName', defaultMessage: '采购会员' }),
      value: data && data.consumerName ? data.consumerName : '',
      columnProps: {
        span: 2,
      },
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.basicInfo.outerStatus', defaultMessage: '外部状态' }),
      value: <StatusTag type={RETURN_OUTER_STATUS_TAG_MAP[data?.outerStatus]} title={data?.outerStatusName} />,
      columnProps: {
        span: 3,
      },
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.basicInfo.innerStatus', defaultMessage: '内部状态' }),
      value: (
        <Badge color={RETURN_INNER_STATUS_BADGE_MAP[data?.innerStatus] || '#606266'} text={data?.innerStatusName} />
      ),
      columnProps: {
        span: 3,
      },
    },
  ]

  const faultFileList = useMemo(
    () => data?.faultFileList?.map((item) => normalizeFiledata(item.filePath)),
    [data, data?.faultFileList],
  )

  const outerVerifyCurrent = useMemo(() => findLastIndexFlowState(data?.outerTaskList), [data])
  const innerVerifyCurrent = useMemo(() => findLastIndexFlowState(data?.innerTaskList), [data])

  return (
    <Spin spinning={loading}>
      <PageHeaderWrapper
        title={`${data && data.applyAbstract ? data.applyAbstract : ''} ｜ ${data && data.applyNo ? data.applyNo : ''}`}
        items={
          anchorsArr as {
            key: string
            label: string
          }[]
        }
        extra={extra && extra(data)}
      >
        <Row gutter={[16, 16]}>
          {/* 流转进度 */}
          <Col span={24}>
            <AuditProcess
              outerVerifySteps={
                data && data.outerTaskList
                  ? data.outerTaskList.map((item, index) => ({
                      step: item.step,
                      stepName: item.taskName,
                      roleName: item.roleName,
                      status: item.isExecute ? (index === outerVerifyCurrent ? 'process' : 'finish') : 'wait',
                    }))
                  : []
              }
              outerVerifyCurrent={outerVerifyCurrent}
              innerVerifySteps={
                data && data.innerTaskList
                  ? data.innerTaskList.map((item, index) => ({
                      step: item.step,
                      stepName: item.taskName,
                      roleName: item.roleName,
                      status: item.isExecute ? (index === innerVerifyCurrent ? 'process' : 'finish') : 'wait',
                    }))
                  : []
              }
              innerVerifyCurrent={innerVerifyCurrent}
              id="taskList"
            />
          </Col>

          {/* 基本信息 */}
          <Col span={24}>
            <div id="basicInfo">
              <Suspense fallback={null}>
                <BasicInfo data={BasicInfoData} />
              </Suspense>
            </div>
          </Col>

          {/* 退货商品 */}
          <Col span={24}>
            <div id="goodsDetailList">
              <Suspense fallback={null}>
                <AsRefundProductList
                  orderType={data?.orderType}
                  orderDetailedPrefix={orderDetailedPrefix}
                  dataSource={data?.goodsDetailList as any}
                />
              </Suspense>
            </div>
          </Col>

          {/* 附件 */}
          <Col span={24}>
            <div id="faultFileList">
              <Suspense fallback={null}>
                <FileList fileList={faultFileList} />
              </Suspense>
            </div>
          </Col>

          {/* 退货地址信息 */}
          <Col span={24}>
            <div id="returnGoodsAddress">
              <Suspense fallback={null}>
                <AsAddressCard
                  asType={3}
                  deliveryType={data?.returnGoodsAddress?.deliveryType}
                  deliveryAddress={{
                    id: data?.returnGoodsAddress?.sendId,
                    name: data?.returnGoodsAddress?.sendUserName,
                    phone: data?.returnGoodsAddress?.sendUserTel,
                    detailed: data?.returnGoodsAddress?.sendAddress,
                  }}
                  shippingAddress={
                    data?.returnGoodsAddress?.receiveId
                      ? {
                          id: data?.returnGoodsAddress?.receiveId,
                          name: data?.returnGoodsAddress?.receiveUserName,
                          phone: data?.returnGoodsAddress?.receiveUserTel,
                          detailed: data?.returnGoodsAddress?.receiveAddress,
                        }
                      : null
                  }
                />
              </Suspense>
            </div>
          </Col>

          {/* 售后评价 */}
          {data && data.outerStatus === RETURN_OUTER_STATUS_FINISHED && (
            <Col span={24}>
              <div id="evaluate">
                <Suspense fallback={null}>
                  <Score score={data?.evaluate?.level} content={data?.evaluate?.content} />
                </Suspense>
              </div>
            </Col>
          )}

          {/* 退货发货信息 */}
          {data && data.returnDeliveryGoodsList && data.returnDeliveryGoodsList.length > 0 && (
            <Col span={24}>
              <div id="returnDeliveryGoodsList">
                <Suspense fallback={null}>
                  <ReturnAnalysis
                    summary={data && data.returnStatisticsList ? data.returnStatisticsList : []}
                    detailed={data && data.returnDeliveryGoodsList ? data.returnDeliveryGoodsList : []}
                    innerStatus={data?.innerStatus}
                    afterType={3}
                    deliveryType={data?.returnGoodsAddress?.deliveryType}
                    orderType={data?.orderType}
                  />
                </Suspense>
              </div>
            </Col>
          )}

          {/* 退款明细信息 */}
          {data &&
            !isMateriel &&
            (data.outerStatus === RETURN_OUTER_STATUS_TO_BE_REFUNDED ||
              data.outerStatus === RETURN_OUTER_STATUS_UNCONFIRMED_REFUNDED ||
              data.outerStatus === RETURN_OUTER_STATUS_NOT_RECEIVED ||
              data.outerStatus === RETURN_OUTER_STATUS_UNCONFIRMED_FINISHED ||
              data.outerStatus === RETURN_OUTER_STATUS_FINISHED) && (
              <Col span={24}>
                <div id="refundList">
                  <Suspense fallback={null}>
                    <ReturnDetailInfo
                      dataSource={data && data.refundList ? data.refundList : []}
                      outerStatus={data?.outerStatus}
                      purchaserId={data?.memberId}
                      purchaserRoleId={data?.roleId}
                      supplierId={data?.parentMemberId}
                      supplierRoleId={data?.parentMemberRoleId}
                    />
                  </Suspense>
                </div>
              </Col>
            )}

          {/* 内、外部流转记录 */}
          <Col span={24}>
            <div id="workflowRecord">
              <Suspense fallback={null}>
                <FlowRecords
                  fetchOuterHistory={fetchOuterHistory}
                  fetchInnerHistory={fetchInnerHistory}
                  outerStatusMap={RETURN_OUTER_STATUS_TAG_MAP}
                  innerStatusColorMap={RETURN_INNER_STATUS_BADGE_MAP}
                />
              </Suspense>
            </div>
          </Col>
        </Row>
      </PageHeaderWrapper>
    </Spin>
  )
}

export default AsReturnProfile
