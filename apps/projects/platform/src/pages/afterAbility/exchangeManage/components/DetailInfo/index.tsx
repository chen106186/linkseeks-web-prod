import React, { Suspense, useEffect, useMemo, useState } from 'react'
import { Spin, Row, Col, Badge, Switch, Tooltip, message } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import { PageHeaderWrapper } from '@apps/components'
import {
  getAftersalesReplaceGoodsGetDetailBySupplier,
  GetAftersalesReplaceGoodsGetDetailBySupplierResponse,
  getAftersalesReplaceGoodsPageInnerWorkflowRecord,
  getAftersalesReplaceGoodsPageOuterWorkflowRecord,
  postAftersalesReplaceGoodsConfirmReplaceDeliveryGoods,
  postAftersalesReplaceGoodsConfirmReplaceGoodsReceipt,
  postAftersalesReplaceGoodsConfirmReturnReceiveGoods,
  postAftersalesReplaceGoodsSetNeedReturnGoods,
} from '@apps/apis'
import { EXCHANGE_OUTER_STATUS_FINISHED, EXCHANGE_INNER_STATUS_UNCOMMITTED } from '@/constants/afterService'
import {
  ORDER_TYPE_TENDER_CONTRACT,
  ORDER_TYPE2_POINTS,
  ORDER_TYPE2_CHANNEL_POINTS,
  ORDER_TYPE,
} from '@/constants/order'
import { normalizeFiledata, FileData, findLastIndexFlowState } from '@/utils'
import StatusTag from '@/components/StatusTag'
import AuditProcess from '@/components/AuditProcess'
import { EditableColumns } from '@/components/PolymericTable/interface'
import { Values as ExchangeAddressValues } from '../../../components/ExchangeAddressInfo'
import { Values as ReturnAddressValues } from '../../../components/ReturnAddressInfo'
import { OuterHistoryData, InnerHistoryData } from '../../../components/FlowRecords'
import { EXCHANGE_OUTER_STATUS_TAG_MAP, EXCHANGE_INNER_STATUS_BADGE_MAP } from '../../../constants'
import { isMaterialOrder } from '../../../utils'

const ProductList = React.lazy(() => import('../../../components/ProductList'))
const ExchangeReceivedInfo = React.lazy(() => import('../../../components/ExchangeReceivedInfo'))
const ExchangeDeliverInfo = React.lazy(() => import('../../../components/ExchangeDeliverInfo'))
const FileList = React.lazy(() => import('../../../components/FileList'))
const ReturnAddressInfo = React.lazy(() => import('../../../components/ReturnAddressInfo'))
const ExchangeAddressInfo = React.lazy(() => import('../../../components/ExchangeAddressInfo'))
const Score = React.lazy(() => import('../../../components/Score'))
const FlowRecords = React.lazy(() => import('../../../components/FlowRecords'))
const BasicInfo = React.lazy(() => import('../../../components/BasicInfo'))

interface DetailInfoProps {
  /**
   * 记录id
   */
  id: string
  /**
   * 是否是可编辑 是否需要退货
   */
  isEditReturn?: boolean
  /**
   * 是否是 可以编辑 地址的
   */
  isEditAddress?: boolean
  /**
   * 是否是 可以编辑 退货发货相关
   */
  isEditRefundDeliver?: boolean
  /**
   * 是否是 可以编辑 换货发货相关
   */
  isEditExchangeDeliver?: boolean
  /**
   * 历史记录目标路径
   */
  target: string
  /**
   * 头部右侧拓展
   */
  headExtra?: (
    info: DetailInfo,
    returnAddress: ReturnAddressValues,
    exchangeAddress: ExchangeAddressValues,
  ) => React.ReactNode
}

interface DetailInfo extends GetAftersalesReplaceGoodsGetDetailBySupplierResponse {
  fileList: FileData[]
}

const DetailInfo: React.FC<DetailInfoProps> = ({
  id,
  isEditReturn = false,
  isEditAddress = false,
  isEditRefundDeliver = false,
  isEditExchangeDeliver = false,
  target,
  headExtra,
}) => {
  const [detailInfo, setDetailInfo] = useState<DetailInfo>(null)
  const [infoLoading, setInfoloading] = useState(false)
  const [exchangeAddress, setExchangeAddress] = useState<ExchangeAddressValues>(null)
  const [returnAddress, setReturnAddress] = useState<ReturnAddressValues>(null)

  const isPointsOrder =
    detailInfo?.orderType === ORDER_TYPE2_POINTS || detailInfo?.orderType === ORDER_TYPE2_CHANNEL_POINTS
  const isMateriel = isMaterialOrder(detailInfo?.orderType)

  const intl = useIntl()

  // 获取换货申请详情
  const getDetailInfo = () => {
    if (!id) {
      return
    }
    setInfoloading(true)
    getAftersalesReplaceGoodsGetDetailBySupplier({
      replaceId: id,
    })
      .then((res) => {
        if (res.code === 1000) {
          const { faultFileList, ...rest } = res.data

          setDetailInfo({
            faultFileList,
            fileList: faultFileList?.map((item) => normalizeFiledata(item.filePath)),
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

  const handleReturn = (record) => {
    if (!isEditReturn || !id) {
      return
    }
    const msg = message.loading({
      content: intl.formatMessage({ id: 'afterService.common.upload.message', defaultMessage: '正在更改...' }),
      duration: 0,
    })
    postAftersalesReplaceGoodsSetNeedReturnGoods({
      replaceId: +id,
      replaceGoodsId: record.detailId,
      isNeed: record.isNeedReturn === 1 ? 0 : 1,
    })
      .then((res) => {
        if (res.code === 1000) {
          getDetailInfo()
        }
      })
      .finally(() => {
        msg()
      })
  }

  const productColumns: EditableColumns[] = [
    {
      title: intl.formatMessage({ id: 'afterService.common.productColumns.orderNo', defaultMessage: '订单号' }),
      dataIndex: 'orderNo',
      render: (text, record) => (
        <a href={`${target}/orderDetail?id=${record.orderId}`} target="_blank">
          {text}
        </a>
      ),
    },
    ...(!isMateriel
      ? [
          {
            title: intl.formatMessage({ id: 'afterService.common.productColumns.productId', defaultMessage: '商品ID' }),
            dataIndex: 'productId',
          },
          {
            title: intl.formatMessage({
              id: 'afterService.common.productColumns.productName',
              defaultMessage: '商品名称',
            }),
            dataIndex: 'productName',
            ellipsis: true,
          },
          {
            title: intl.formatMessage({ id: 'afterService.common.productColumns.category', defaultMessage: '品类' }),
            dataIndex: 'category',
          },
          {
            title: intl.formatMessage({ id: 'afterService.common.productColumns.brand', defaultMessage: '品牌' }),
            dataIndex: 'brand',
          },
          {
            title: intl.formatMessage({ id: 'afterService.common.productColumns.unit', defaultMessage: '单位' }),
            dataIndex: 'unit',
          },
        ]
      : [
          {
            title: intl.formatMessage({
              id: 'afterService.common.productColumns.materialNo',
              defaultMessage: '物料编号',
            }),
            dataIndex: 'productId',
          },
          {
            title: `${intl.formatMessage({
              id: 'afterService.common.productColumns.materialName',
              defaultMessage: '物料名称',
            })}、${intl.formatMessage({
              id: 'afterService.common.productColumns.materialSpec',
              defaultMessage: '规格',
            })}`,
            dataIndex: 'productName',
            render: (text, record) => `${text}${record.type ? '/' + record.type : ''}`,
          },
          {
            title: intl.formatMessage({ id: 'afterService.common.productColumns.category', defaultMessage: '品类' }),
            dataIndex: 'category',
          },
          {
            title: intl.formatMessage({ id: 'afterService.common.productColumns.brand', defaultMessage: '品牌' }),
            dataIndex: 'brand',
          },
          {
            title: intl.formatMessage({ id: 'afterService.common.productColumns.unit', defaultMessage: '单位' }),
            dataIndex: 'unit',
          },
          {
            title:
              detailInfo?.orderType !== ORDER_TYPE_TENDER_CONTRACT
                ? intl.formatMessage({
                    id: 'afterService.common.productColumns.materialMergeInfo1',
                    defaultMessage: '关联报价商品ID、名称、规格、品类、品牌',
                  })
                : intl.formatMessage({
                    id: 'afterService.common.productColumns.materialMergeInfo2',
                    defaultMessage: '关联投标商品ID、名称、规格、品类、品牌',
                  }),
            dataIndex: 'associatedProductId',
            render: (text, record) =>
              `${text || ''}/${record.associatedProductName || ''}/${record.associatedType || ''}/${
                record.associatedCategory || ''
              }/${record.associatedBrand || ''}`,
          },
        ]),
    {
      title: !isPointsOrder
        ? intl.formatMessage({ id: 'afterService.common.productColumns.purchaseCount', defaultMessage: '采购数量' })
        : intl.formatMessage({
            id: 'afterService.common.productColumns.purchaseCount-integral',
            defaultMessage: '兑换数量',
          }),
      dataIndex: 'purchaseCount',
    },
    {
      title: !isPointsOrder
        ? intl.formatMessage({ id: 'afterService.common.productColumns.purchasePrice', defaultMessage: '采购单价' })
        : intl.formatMessage({
            id: 'afterService.common.productColumns.purchasePrice-integral',
            defaultMessage: '所需积分',
          }),
      dataIndex: 'purchasePrice',
    },
    {
      title: !isPointsOrder
        ? intl.formatMessage({ id: 'afterService.common.productColumns.purchaseAmount', defaultMessage: '采购金额' })
        : intl.formatMessage({
            id: 'afterService.common.productColumns.purchaseAmount-integral',
            defaultMessage: '所需积分小计',
          }),
      dataIndex: 'purchaseAmount',
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.productColumns.replaceCount', defaultMessage: '换货数量' }),
      dataIndex: 'replaceCount',
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.productColumns.replaceReason', defaultMessage: '换货原因' }),
      dataIndex: 'replaceReason',
    },
    {
      title: (
        <>
          <span style={{ marginRight: 8 }}>
            {intl.formatMessage({
              id: 'afterService.common.productColumns.needReturn',
              defaultMessage: '是否需要退货',
            })}
          </span>
          <Tooltip
            title={intl.formatMessage({
              id: 'afterService.common.productColumns.needReturn.tip',
              defaultMessage:
                '如果商品因为缺陷原因，无法再退回加工后重新使用，可选择不需要退货，选择后，采购方无须退回不良品。',
            })}
          >
            <QuestionCircleOutlined />
          </Tooltip>
        </>
      ),
      dataIndex: 'needReplaceName',
      render: (text, record) => (
        <>{!isEditReturn ? text : <Switch checked={record.isNeedReturn} onChange={() => handleReturn(record)} />}</>
      ),
    },
  ] as EditableColumns[]

  useEffect(() => {
    getDetailInfo()
  }, [])

  const handleExchangeAddressSubmit = (values) => {
    setExchangeAddress(values)
  }

  const handleReturnAddressSubmit = (values) => {
    setReturnAddress(values)
  }

  // 确认退货收货
  const handleReceivedConfirmReturnReceive = (id): Promise<any> => {
    return postAftersalesReplaceGoodsConfirmReturnReceiveGoods({
      id,
    }).then((res) => {
      if (res.code === 1000) {
        history.goBack()
      }
    })
  }

  // 确认换货发货
  const handleConfirmExchangeDeliver = (id): Promise<any> => {
    return postAftersalesReplaceGoodsConfirmReplaceDeliveryGoods({
      id,
    }).then((res) => {
      if (res.code === 1000) {
        history.goBack()
      }
    })
  }

  // 确认换货回单
  const handleConfirmExchangeBack = (id): Promise<any> => {
    return postAftersalesReplaceGoodsConfirmReplaceGoodsReceipt({
      id,
    }).then((res) => {
      if (res.code === 1000) {
        getDetailInfo()
      }
    })
  }

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

  const fetchInnerHistory = (params): Promise<InnerHistoryData> => {
    return new Promise((resolve, reject) => {
      getAftersalesReplaceGoodsPageInnerWorkflowRecord({
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
        id: 'afterService.common.return.anchors.replaceProducts',
        defaultMessage: '换货商品',
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
    {
      key: 'replaceGoodsAddress',
      label: intl.formatMessage({
        id: 'afterService.common.return.anchors.replaceGoodsAddress',
        defaultMessage: '换货收货地址',
      }),
    },
    detailInfo && detailInfo.outerStatus === EXCHANGE_OUTER_STATUS_FINISHED
      ? {
          key: 'evaluate',
          label: intl.formatMessage({ id: 'afterService.common.return.anchors.evaluate', defaultMessage: '售后评价' }),
        }
      : null,
    detailInfo && detailInfo.returnDeliveryGoodsList && detailInfo.returnDeliveryGoodsList.length > 0
      ? {
          key: 'returnDeliveryGoodsList',
          label: intl.formatMessage({
            id: 'afterService.common.return.anchors.returnDeliveryGoodsList',
            defaultMessage: '退货发货信息',
          }),
        }
      : null,
    detailInfo && detailInfo.replaceDeliveryGoodsList && detailInfo.replaceDeliveryGoodsList.length > 0
      ? {
          key: 'replaceDeliveryGoodsList',
          label: intl.formatMessage({
            id: 'afterService.common.return.anchors.replaceDeliveryGoodsList',
            defaultMessage: '换货收货信息',
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
      value: detailInfo && detailInfo.applyNo ? detailInfo.applyNo : '',
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.basicInfo.orderType', defaultMessage: '售后订单类型' }),
      value: detailInfo && detailInfo.orderType ? ORDER_TYPE[detailInfo.orderType] : '',
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.basicInfo.applyTime', defaultMessage: '单据时间' }),
      value: detailInfo && detailInfo.applyTime ? detailInfo.applyTime : '',
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.basicInfo.applyAbstract', defaultMessage: '申请摘要' }),
      value: detailInfo && detailInfo.applyAbstract ? detailInfo.applyAbstract : '',
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.basicInfo.consumerName', defaultMessage: '采购会员' }),
      value: detailInfo && detailInfo.consumerName ? detailInfo.consumerName : '',
      columnProps: {
        span: 2,
      },
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.basicInfo.outerStatus', defaultMessage: '外部状态' }),
      value: (
        <StatusTag type={EXCHANGE_OUTER_STATUS_TAG_MAP[detailInfo?.outerStatus]} title={detailInfo?.outerStatusName} />
      ),
      columnProps: {
        span: 3,
      },
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.basicInfo.innerStatus', defaultMessage: '内部状态' }),
      value: (
        <Badge
          color={EXCHANGE_INNER_STATUS_BADGE_MAP[detailInfo?.innerStatus] || '#606266'}
          text={detailInfo?.innerStatusName}
        />
      ),
      columnProps: {
        span: 3,
      },
    },
  ]

  const outerVerifyCurrent = useMemo(() => findLastIndexFlowState(detailInfo?.outerTaskList), [detailInfo])

  return (
    <PageHeaderWrapper
      title={`${detailInfo && detailInfo.applyAbstract ? detailInfo.applyAbstract : ''} ｜ ${
        detailInfo && detailInfo.applyNo ? detailInfo.applyNo : ''
      }`}
      items={anchorsArr as { key: string; label: string }[]}
      extra={headExtra && headExtra(detailInfo, returnAddress, exchangeAddress)}
    >
      <Spin spinning={infoLoading}>
        <Row gutter={[16, 16]}>
          {/* 流转进度 */}
          <Col span={24}>
            <AuditProcess
              outerVerifyCurrent={outerVerifyCurrent}
              outerVerifySteps={
                detailInfo && detailInfo.outerTaskList
                  ? detailInfo.outerTaskList.map((item, index) => ({
                      ...item,
                      status: item.isExecute ? (index === outerVerifyCurrent ? 'process' : 'finish') : 'wait',
                    }))
                  : []
              }
              customTitleKey="taskName"
              id="taskList"
              ellipsis
            />
          </Col>

          {/* 基本信息 */}
          <Col span={24}>
            <Suspense fallback={null}>
              <BasicInfo data={BasicInfoData} id="basicInfo" />
            </Suspense>
          </Col>

          {/* 换货商品 */}
          <Col span={24}>
            <Suspense fallback={null}>
              <ProductList
                title={intl.formatMessage({ id: 'afterService.common.replace.products', defaultMessage: '换货商品' })}
                rowKey="detailId"
                columns={productColumns}
                dataSource={detailInfo?.goodsDetailList}
                id="goodsDetailList"
              />
            </Suspense>
          </Col>

          {/* 附件 */}
          <Col span={24}>
            <Suspense fallback={null}>
              <FileList fileList={detailInfo?.fileList} id="faultFileList" />
            </Suspense>
          </Col>

          {/* 退货收货地址 */}
          <Col span={24}>
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
                isEdit={isEditAddress && detailInfo?.innerStatus === EXCHANGE_INNER_STATUS_UNCOMMITTED}
                onFormSubmit={handleReturnAddressSubmit}
                id="returnGoodsAddress"
              />
            </Suspense>
          </Col>

          {/* 换货收货地址 */}
          <Col span={24}>
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
                isEdit={isEditAddress && detailInfo?.innerStatus === EXCHANGE_INNER_STATUS_UNCOMMITTED}
                onFormSubmit={handleExchangeAddressSubmit}
                id="replaceGoodsAddress"
              />
            </Suspense>
          </Col>

          {/* 售后评价 */}
          {detailInfo && detailInfo.outerStatus === EXCHANGE_OUTER_STATUS_FINISHED && (
            <Col span={24}>
              <Suspense fallback={null}>
                <Score score={detailInfo?.evaluate?.level} content={detailInfo?.evaluate?.content} id="evaluate" />
              </Suspense>
            </Col>
          )}

          {/* 退货发货信息 */}
          {detailInfo && detailInfo.returnDeliveryGoodsList && detailInfo.returnDeliveryGoodsList.length > 0 && (
            <Col span={24}>
              <Suspense fallback={null}>
                <ExchangeReceivedInfo
                  summary={detailInfo && detailInfo.returnStatisticsList ? detailInfo.returnStatisticsList : []}
                  detailed={detailInfo && detailInfo.returnDeliveryGoodsList ? detailInfo.returnDeliveryGoodsList : []}
                  onConfirmReturnReceive={handleReceivedConfirmReturnReceive}
                  innerStatus={detailInfo?.innerStatus}
                  target={target}
                  isEdit={isEditRefundDeliver}
                  afterType={2}
                  deliveryType={detailInfo?.returnGoodsAddress?.deliveryType}
                  orderType={detailInfo?.orderType}
                  id="returnDeliveryGoodsList"
                />
              </Suspense>
            </Col>
          )}

          {/* 换货发货信息 */}
          {detailInfo && detailInfo.replaceDeliveryGoodsList && detailInfo.replaceDeliveryGoodsList.length > 0 && (
            <Col span={24}>
              <Suspense fallback={null}>
                <ExchangeDeliverInfo
                  summary={detailInfo && detailInfo.replaceStatisticsList ? detailInfo.replaceStatisticsList : []}
                  detailed={
                    detailInfo && detailInfo.replaceDeliveryGoodsList ? detailInfo.replaceDeliveryGoodsList : []
                  }
                  onConfirmExchangeDeliver={handleConfirmExchangeDeliver}
                  onConfirmExchangeBack={handleConfirmExchangeBack}
                  innerStatus={detailInfo?.innerStatus}
                  target={target}
                  isEdit={isEditExchangeDeliver}
                  afterType={2}
                  deliveryType={detailInfo?.replaceGoodsAddress?.deliveryType}
                  orderType={detailInfo?.orderType}
                  id="replaceDeliveryGoodsList"
                />
              </Suspense>
            </Col>
          )}

          {/* 内、外部流转记录 */}
          <Col span={24}>
            <Suspense fallback={null}>
              <FlowRecords
                fetchOuterHistory={fetchOuterHistory}
                fetchInnerHistory={fetchInnerHistory}
                outerStatusMap={EXCHANGE_OUTER_STATUS_TAG_MAP}
                innerStatusColorMap={EXCHANGE_INNER_STATUS_BADGE_MAP}
                id="workflowRecord"
              />
            </Suspense>
          </Col>
        </Row>
      </Spin>
    </PageHeaderWrapper>
  )
}

export default DetailInfo
