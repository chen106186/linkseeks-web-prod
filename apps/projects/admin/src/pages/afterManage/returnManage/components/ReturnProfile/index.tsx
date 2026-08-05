import React, { Suspense, useImperativeHandle, useRef } from 'react'
import { PageHeader, Descriptions, Spin, Row, Col, Badge } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import { history } from '@linkseeks/router-manager'
import {
  RETURN_OUTER_STATUS_FINISHED,
  RETURN_OUTER_STATUS_TO_BE_REFUNDED,
  RETURN_OUTER_STATUS_UNCONFIRMED_REFUNDED,
  RETURN_OUTER_STATUS_NOT_RECEIVED,
  RETURN_OUTER_STATUS_UNCONFIRMED_FINISHED,
} from '@/constants'
import { findLastIndexFlowState } from '@/utils'
import { RETURN_OUTER_STATUS_TAG_MAP, RETURN_INNER_STATUS_BADGE_MAP } from '../../constants'
import AvatarWrap from '@/components/AvatarWrap'
import StatusTag from '@/components/StatusTag'
import AuditProcess from '@/components/AuditProcess'
import FlowRecords, { IProps as FlowRecordsProps, FlowRecordsRefHandle } from '@/components/FlowRecords'
import { EditableColumns } from '@/components/PolymericTable/interface'
import { ReturnDetailInfoProps } from '../ReturnDetailInfo'
import { DetailType } from './interface'

const ReturnAnalysis = React.lazy(() => import('../ReturnAnalysis'))
const ReturnDetailInfo = React.lazy(() => import('../ReturnDetailInfo'))
const FileList = React.lazy(() => import('../FileList'))
const ReturnAddressInfo = React.lazy(() => import('../ReturnAddressInfo'))
const Score = React.lazy(() => import('../Score'))
const ReturnProductList = React.lazy(() => import('../ReturnProductList'))

interface ReturnProfileProps {
  /**
   * 数据
   */
  dataSource: DetailType
  /**
   * 是否加载中
   */
  loading: boolean
  /**
   * 获取外部流转记录方法
   */
  fetchOuterHistory?: FlowRecordsProps['fetchOuterList']
  /**
   * 是否是采购商
   */
  isPurchaser?: boolean
  /**
   * 拓展区域
   */
  extra?: (info: DetailType) => React.ReactNode
  /**
   * 是否可编辑 退货明细信息，默认 false
   */
  editableDetailInfo?: boolean
  /**
   * 退款明细点击退款触发
   */
  onRefund?: ReturnDetailInfoProps['onRefund']
  /**
   * 刷新详情信息方法
   */
  onRefresh?: () => void
}

export type ReturnProfileRefHandle = {
  /**
   * 刷新详情信息方法
   */
  refresh?: () => void
}

const ReturnProfile: React.ForwardRefRenderFunction<ReturnProfileRefHandle, ReturnProfileProps> = (
  props: ReturnProfileProps,
  ref,
) => {
  const {
    dataSource,
    loading,
    fetchOuterHistory,
    isPurchaser,
    extra,
    editableDetailInfo = false,
    onRefund,
    onRefresh,
  } = props

  const flowRecordsRef = useRef<FlowRecordsRefHandle | null>(null)

  const outerColumns: EditableColumns[] = [
    {
      title: '序号',
      dataIndex: 'index',
      align: 'center',
      render: (_, record, index) => index + 1,
    },
    {
      title: '操作角色',
      dataIndex: 'roleName',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      render: (text, record) => (
        <StatusTag type={RETURN_OUTER_STATUS_TAG_MAP[record.status] || 'default'} title={text} />
      ),
    },
    {
      title: '操作',
      dataIndex: 'operate',
      align: 'center',
    },
    {
      title: '操作时间',
      dataIndex: 'operateTime',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '审核意见',
      dataIndex: 'opinion',
      align: 'center',
      ellipsis: true,
    },
  ]

  // 退款
  const handleRefund = (values): Promise<any> => {
    if (onRefund) {
      return onRefund?.(values)
    }
    return Promise.reject()
  }

  useImperativeHandle(ref, () => ({
    refresh: () => {
      onRefresh?.()
      flowRecordsRef.current?.refreshOuterList()
    },
  }))

  return (
    <Spin spinning={loading}>
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
                    name: `申请单号：${dataSource && dataSource.applyNo ? dataSource.applyNo : ''}`,
                  }}
                />
              }
              extra={extra ? extra(dataSource) : null}
            >
              <Descriptions
                size="small"
                column={3}
                style={{
                  padding: '0 32px',
                }}
              >
                <Descriptions.Item label="申请单摘要">{dataSource?.applyAbstract}</Descriptions.Item>
                <Descriptions.Item label="采购会员">{dataSource?.consumerName}</Descriptions.Item>
                <Descriptions.Item label="单据时间">{dataSource?.applyTime}</Descriptions.Item>
                <Descriptions.Item label="外部状态">
                  <StatusTag
                    type={RETURN_OUTER_STATUS_TAG_MAP[dataSource?.outerStatus]}
                    title={dataSource?.outerStatusName}
                  />
                </Descriptions.Item>
                <Descriptions.Item label="内部状态">
                  <Badge
                    color={RETURN_INNER_STATUS_BADGE_MAP[dataSource?.innerStatus]}
                    text={dataSource?.innerStatusName}
                  />
                </Descriptions.Item>
              </Descriptions>
            </PageHeader>
          </>
        }
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Suspense fallback={null}>
              <AuditProcess
                outerVerifySteps={
                  dataSource && dataSource.outerTaskList
                    ? dataSource.outerTaskList.map((item) => ({
                        step: item.step,
                        stepName: item.taskName,
                        roleName: item.roleName,
                        isExecute: item.isExecute,
                      }))
                    : []
                }
                outerVerifyCurrent={findLastIndexFlowState(dataSource?.outerTaskList)}
              />
            </Suspense>
          </Col>

          <Col span={24}>
            <Suspense fallback={null}>
              <ReturnProductList dataSource={dataSource?.goodsDetailList} />
            </Suspense>
          </Col>

          <Col span={24}>
            <Suspense fallback={null}>
              {/* 退货发货信息 */}
              <ReturnAnalysis
                summary={dataSource && dataSource.returnStatisticsList ? dataSource.returnStatisticsList : []}
                detailed={dataSource && dataSource.returnDeliveryGoodsList ? dataSource.returnDeliveryGoodsList : []}
              />
            </Suspense>
          </Col>

          {/* 退款明细信息 */}
          {dataSource &&
            (dataSource.outerStatus === RETURN_OUTER_STATUS_TO_BE_REFUNDED ||
              dataSource.outerStatus === RETURN_OUTER_STATUS_UNCONFIRMED_REFUNDED ||
              dataSource.outerStatus === RETURN_OUTER_STATUS_NOT_RECEIVED ||
              dataSource.outerStatus === RETURN_OUTER_STATUS_UNCONFIRMED_FINISHED ||
              dataSource.outerStatus === RETURN_OUTER_STATUS_FINISHED) && (
              <Col span={24}>
                <Suspense fallback={null}>
                  <ReturnDetailInfo
                    dataSource={dataSource && dataSource.refundList ? dataSource.refundList : []}
                    isPurchaser={isPurchaser}
                    outerStatus={dataSource?.outerStatus}
                    purchaserId={dataSource?.memberId}
                    purchaserRoleId={dataSource?.roleId}
                    isEdit={editableDetailInfo}
                    onRefund={handleRefund}
                  />
                </Suspense>
              </Col>
            )}

          <Col span={24}>
            <Row gutter={24}>
              <Col span={dataSource && dataSource.outerStatus === RETURN_OUTER_STATUS_FINISHED ? 6 : 9}>
                <Suspense fallback={null}>
                  <FileList fileList={dataSource?.faultFileList} />
                </Suspense>
              </Col>

              <Col span={dataSource && dataSource.outerStatus === RETURN_OUTER_STATUS_FINISHED ? 12 : 15}>
                <Suspense fallback={null}>
                  <ReturnAddressInfo
                    deliveryAddress={{
                      id: dataSource?.returnGoodsAddress?.receiveId,
                      name: dataSource?.returnGoodsAddress?.receiveUserName,
                      phone: dataSource?.returnGoodsAddress?.receiveUserTel,
                      fullAddress: dataSource?.returnGoodsAddress?.receiveAddress,
                    }}
                    shippingAddress={{
                      deliveryType: dataSource?.returnGoodsAddress?.deliveryType,
                      name: dataSource?.returnGoodsAddress?.sendUserName,
                      phone: dataSource?.returnGoodsAddress?.sendUserTel,
                      fullAddress: dataSource?.returnGoodsAddress?.sendAddress,
                    }}
                    isEdit={false}
                  />
                </Suspense>
              </Col>

              {dataSource && dataSource.outerStatus === RETURN_OUTER_STATUS_FINISHED && (
                <Col span={6}>
                  {/* 售后评价 */}
                  <Suspense fallback={null}>
                    <Score score={dataSource?.evaluate?.level} />
                  </Suspense>
                </Col>
              )}
            </Row>
          </Col>

          <Col span={24}>
            {/* 内、外部流转记录 */}
            <Suspense fallback={null}>
              <FlowRecords
                outerRowkey="step"
                outerColumns={outerColumns}
                fetchOuterList={fetchOuterHistory}
                ref={flowRecordsRef}
              />
            </Suspense>
          </Col>
        </Row>
      </PageHeaderWrapper>
    </Spin>
  )
}

const ReturnProfileForward = React.forwardRef<ReturnProfileRefHandle, ReturnProfileProps>(ReturnProfile)

export default ReturnProfileForward
