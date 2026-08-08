import React, { Suspense, useEffect, useState } from 'react'
import { PageHeader, Descriptions, Spin, Row, Col, Badge, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { PageHeaderWrapper } from '@apps/components'
import { history } from '@linkseeks/router-manager'
import {
  GetAftersalesReplaceGoodsGetDetailByPlatformResponse,
  GetAftersalesReplaceGoodsPageReturnedGoodsResponse,
} from '@apps/apis'
import { EXCHANGE_OUTER_STATUS_FINISHED } from '@/constants'
import { normalizeFiledata, FileData, findLastIndexFlowState } from '@/utils'
import { usePageStatus } from '@/hooks/usePageStatus'
import AvatarWrap from '@/components/AvatarWrap'
import StatusTag from '@/components/StatusTag'
import AuditProcess from '@/components/AuditProcess'
import { EditableColumns } from '@/components/PolymericTable/interface'
import { OuterHistoryData } from '../components/FlowRecords'
import { EXCHANGE_OUTER_STATUS_TAG_MAP, EXCHANGE_INNER_STATUS_BADGE_MAP } from '../constants'
import {
  getAftersalesReplaceGoodsGetDetailByPlatform,
  getAftersalesReplaceGoodsPageOuterWorkflowRecord,
  getAftersalesReplaceGoodsPageReturnedGoods,
} from '@apps/apis'
import MellowCard from '@/components/MellowCard'

const ProductList = React.lazy(() => import('../components/ProductList'))
const ExchangeReceivedInfo = React.lazy(() => import('../components/ExchangeReceivedInfo'))
const ExchangeDeliverInfo = React.lazy(() => import('../components/ExchangeDeliverInfo'))
const FileList = React.lazy(() => import('../components/FileList'))
const ReturnAddressInfo = React.lazy(() => import('../components/ReturnAddressInfo'))
const ExchangeAddressInfo = React.lazy(() => import('../components/ExchangeAddressInfo'))
const Score = React.lazy(() => import('../components/Score'))
const FlowRecords = React.lazy(() => import('../components/FlowRecords'))

interface DetailInfo extends GetAftersalesReplaceGoodsGetDetailByPlatformResponse {
  fileList: FileData[]
}

const DetailInfo: React.FC = () => {
  const { id } = usePageStatus()
  const [detailInfo, setDetailInfo] = useState<DetailInfo>({})
  const [replaceGoodsList, setReplaceGoodsList] = useState<GetAftersalesReplaceGoodsPageReturnedGoodsResponse>({
    data: [],
    totalCount: 0,
  })
  const [infoLoading, setInfoloading] = useState(false)
  const [replaceGoodsLoading, setExchangeGoodsLoading] = useState(false)

  // 获取换货申请详情
  const getDetailInfo = () => {
    if (!id) {
      return
    }
    setInfoloading(true)
    getAftersalesReplaceGoodsGetDetailByPlatform({
      replaceId: id,
    })
      .then((res) => {
        if (res.code === 1000) {
          const { faultFileList, ...rest } = res.data

          setDetailInfo({
            faultFileList,
            fileList: faultFileList?.map((item) => normalizeFiledata(item.filePath, item.fileName)),
            ...rest,
          })
        }
      })
      .catch((err) => {
        console.warn(err)
      })
      .finally(() => {
        setInfoloading(false)
      })
  }

  // 获取换货明细列表
  const getReplaceGoods = () => {
    if (!id) {
      return
    }
    setExchangeGoodsLoading(true)
    getAftersalesReplaceGoodsPageReturnedGoods({
      replaceId: id,
      current: `${1}`,
      pageSize: `${99999}`,
    })
      .then((res) => {
        if (res.code === 1000) {
          setReplaceGoodsList(res.data)
        }
      })
      .finally(() => {
        setExchangeGoodsLoading(false)
      })
      .catch((err) => {
        console.warn(err)
      })
  }

  const productColumns: EditableColumns[] = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
    },
    {
      title: '商品ID',
      dataIndex: 'productId',
      align: 'center',
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      ellipsis: true,
    },
    {
      title: '品类',
      dataIndex: 'category',
      align: 'center',
    },
    {
      title: '品牌',
      dataIndex: 'brand',
      align: 'center',
    },
    {
      title: '单位',
      dataIndex: 'unit',
      align: 'center',
    },
    {
      title: '采购数量',
      dataIndex: 'purchaseCount',
      align: 'center',
    },
    {
      title: '采购单价',
      dataIndex: 'purchasePrice',
      align: 'center',
    },
    {
      title: '采购金额',
      dataIndex: 'purchaseAmount',
      align: 'center',
    },
    {
      title: '换货数量',
      dataIndex: 'replaceCount',
      align: 'center',
    },
    {
      title: '换货原因',
      dataIndex: 'replaceReason',
      align: 'center',
    },
    {
      title: (
        <>
          <span style={{ marginRight: 8 }}>是否需要退货</span>
          <Tooltip title="如果商品因为缺陷原因，无法再退回加工后重新使用，可选择不需要退货，选择后，采购方无须退回不良品。">
            <QuestionCircleOutlined />
          </Tooltip>
        </>
      ),
      dataIndex: 'needReplaceName',
      align: 'center',
    },
  ]

  useEffect(() => {
    getDetailInfo()
    getReplaceGoods()
  }, [])

  const fetchOuterHistory = (params): Promise<OuterHistoryData> => {
    return new Promise((resolve, reject) => {
      getAftersalesReplaceGoodsPageOuterWorkflowRecord({
        ...params,
        dataId: id,
      })
        .then((res) => {
          if (res.code === 1000) {
            resolve(res.data)
          }
          reject(res)
        })
        .catch((err) => {
          reject(err)
        })
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
              title={
                <AvatarWrap
                  info={{
                    aloneTxt: '单',
                    name: `申请单号：${detailInfo && detailInfo.applyNo ? detailInfo.applyNo : ''}`,
                  }}
                />
              }
            >
              <div>
                <Descriptions
                  size="small"
                  column={3}
                  style={{
                    padding: '0 32px',
                  }}
                >
                  <Descriptions.Item label="申请单摘要">{detailInfo?.applyAbstract}</Descriptions.Item>
                  <Descriptions.Item label="采购会员">{detailInfo?.consumerName}</Descriptions.Item>
                  <Descriptions.Item label="单据时间">{detailInfo?.applyTime}</Descriptions.Item>
                  <Descriptions.Item label="外部状态">
                    <StatusTag
                      type={EXCHANGE_OUTER_STATUS_TAG_MAP[detailInfo?.outerStatus]}
                      title={detailInfo?.outerStatusName}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="内部状态">
                    <Badge
                      color={EXCHANGE_INNER_STATUS_BADGE_MAP[detailInfo?.innerStatus]}
                      text={detailInfo?.innerStatusName}
                    />
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </PageHeader>
          </>
        }
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            {/* 审核流程 */}
            <Suspense fallback={null}>
              <AuditProcess
                outerVerifySteps={
                  detailInfo && detailInfo.outerTaskList
                    ? detailInfo.outerTaskList.map((item) => ({
                        step: item.step,
                        stepName: item.taskName,
                        roleName: item.roleName,
                        isExecute: item.isExecute,
                      }))
                    : []
                }
                outerVerifyCurrent={findLastIndexFlowState(detailInfo?.outerTaskList)}
              />
            </Suspense>
          </Col>

          <Col span={24}>
            <MellowCard title="基本信息">
              <Descriptions column={2} className="common-descriptions">
                <Descriptions.Item label="申请单号">{detailInfo.applyNo}</Descriptions.Item>
                <Descriptions.Item label="申请单摘要">{detailInfo?.applyAbstract}</Descriptions.Item>
                <Descriptions.Item label="采购会员">{detailInfo?.consumerName}</Descriptions.Item>
                <Descriptions.Item label="单据时间">{detailInfo?.applyTime}</Descriptions.Item>
                <Descriptions.Item label="供应会员">{detailInfo?.supplierName}</Descriptions.Item>
                <Descriptions.Item label="外部状态">
                  <StatusTag
                    type={EXCHANGE_OUTER_STATUS_TAG_MAP[detailInfo?.outerStatus]}
                    title={detailInfo?.outerStatusName}
                  />
                </Descriptions.Item>
                <Descriptions.Item label="内部状态">
                  <Badge
                    color={EXCHANGE_INNER_STATUS_BADGE_MAP[detailInfo?.innerStatus]}
                    text={detailInfo?.innerStatusName}
                  />
                </Descriptions.Item>
              </Descriptions>
            </MellowCard>
          </Col>

          <Col span={24}>
            {/* 换货商品 */}
            <Suspense fallback={null}>
              <ProductList
                title="换货商品"
                rowKey="detailId"
                columns={productColumns}
                loading={replaceGoodsLoading}
                dataSource={replaceGoodsList.data}
              />
            </Suspense>
          </Col>

          <Col span={24}>
            {/* 退货发货信息 */}
            <Suspense fallback={null}>
              <ExchangeReceivedInfo
                summary={detailInfo && detailInfo.returnStatisticsList ? detailInfo.returnStatisticsList : []}
                detailed={detailInfo && detailInfo.returnDeliveryGoodsList ? detailInfo.returnDeliveryGoodsList : []}
              />
            </Suspense>
          </Col>

          <Col span={24}>
            {/* 换货发货信息 */}
            <Suspense fallback={null}>
              <ExchangeDeliverInfo
                summary={detailInfo && detailInfo.replaceStatisticsList ? detailInfo.replaceStatisticsList : []}
                detailed={detailInfo && detailInfo.replaceDeliveryGoodsList ? detailInfo.replaceDeliveryGoodsList : []}
              />
            </Suspense>
          </Col>

          <Col span={24}>
            <Row gutter={24}>
              <Col span={detailInfo && detailInfo.outerStatus === EXCHANGE_OUTER_STATUS_FINISHED ? 6 : 8}>
                {/* 相关不良原因举证附件 */}
                <Suspense fallback={null}>
                  <FileList fileList={detailInfo?.fileList} />
                </Suspense>
              </Col>

              <Col span={detailInfo && detailInfo.outerStatus === EXCHANGE_OUTER_STATUS_FINISHED ? 6 : 8}>
                {/* 退货收货地址 */}
                <Suspense fallback={null}>
                  <ReturnAddressInfo
                    deliveryAddress={{
                      id: detailInfo?.returnGoodsAddress?.receiveId,
                      name: detailInfo?.returnGoodsAddress?.receiveUserName,
                      phone: detailInfo?.returnGoodsAddress?.receiveUserTel,
                      fullAddress: detailInfo?.returnGoodsAddress?.receiveAddress,
                    }}
                    shippingAddress={{
                      deliveryType: detailInfo?.returnGoodsAddress?.deliveryType,
                      name: detailInfo?.returnGoodsAddress?.sendUserName,
                      phone: detailInfo?.returnGoodsAddress?.sendUserTel,
                      fullAddress: detailInfo?.returnGoodsAddress?.sendAddress,
                    }}
                    isEdit={false}
                  />
                </Suspense>
              </Col>

              <Col span={detailInfo && detailInfo.outerStatus === EXCHANGE_OUTER_STATUS_FINISHED ? 6 : 8}>
                {/* 换货收货地址 */}
                <Suspense fallback={null}>
                  <ExchangeAddressInfo
                    deliveryAddress={{
                      name: detailInfo?.replaceGoodsAddress?.receiveUserName,
                      phone: detailInfo?.replaceGoodsAddress?.receiveUserTel,
                      fullAddress: detailInfo?.replaceGoodsAddress?.receiveAddress,
                    }}
                    shippingAddress={{
                      id: detailInfo?.replaceGoodsAddress?.sendId,
                      deliveryType: detailInfo?.replaceGoodsAddress?.deliveryType,
                      name: detailInfo?.replaceGoodsAddress?.sendUserName,
                      phone: detailInfo?.replaceGoodsAddress?.sendUserTel,
                      fullAddress: detailInfo?.replaceGoodsAddress?.sendAddress,
                    }}
                    isEdit={false}
                  />
                </Suspense>
              </Col>

              {detailInfo && detailInfo.outerStatus === EXCHANGE_OUTER_STATUS_FINISHED && (
                <Col span={6}>
                  {/* 售后评价 */}
                  <Suspense fallback={null}>
                    <Score score={detailInfo?.evaluate?.level} />
                  </Suspense>
                </Col>
              )}
            </Row>
          </Col>

          <Col span={24}>
            {/* 内、外部流转记录 */}
            <Suspense fallback={null}>
              <FlowRecords fetchOuterHistory={fetchOuterHistory} outerStatusMap={EXCHANGE_OUTER_STATUS_TAG_MAP} />
            </Suspense>
          </Col>
        </Row>
      </PageHeaderWrapper>
    </Spin>
  )
}

export default DetailInfo
