import React, { Suspense, useEffect, useMemo, useState } from 'react'
import { PageHeader, Descriptions, Spin, Button, Row, Col, Badge } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import {
  getAftersalesReturnGoodsGetDetailByConsumer,
  GetAftersalesReturnGoodsGetDetailByConsumerResponse,
  getAftersalesReturnGoodsPageInnerWorkflowRecord,
  getAftersalesReturnGoodsPageOuterWorkflowRecord,
  getAftersalesReturnGoodsPageReturnedGoods,
  GetAftersalesReturnGoodsPageReturnedGoodsResponse,
  postAftersalesReturnGoodsConfirmRefund,
  postAftersalesReturnGoodsConfirmReturnDeliveryGoods,
  postAftersalesReturnGoodsConfirmReturnGoodsReceipt,
} from '@apps/apis'
import {
  RETURN_OUTER_STATUS_FINISHED,
  RETURN_OUTER_STATUS_TO_BE_REFUNDED,
  RETURN_OUTER_STATUS_UNCONFIRMED_REFUNDED,
  RETURN_OUTER_STATUS_NOT_RECEIVED,
  RETURN_OUTER_STATUS_UNCONFIRMED_FINISHED,
  RETURN_INNER_STATUS_UNCOMMITTED,
} from '@/constants/afterService'
import { PageHeaderWrapper } from '@apps/components'
import { ORDER_TYPE_TENDER_CONTRACT, ORDER_TYPE } from '@/constants/order'
import { normalizeFiledata, FileData, findLastIndexFlowState } from '@/utils'
import StatusTag from '@/components/StatusTag'
import { EditableColumns } from '@/components/PolymericTable/interface'
import DescProgress from '@/components/DescProgress'
import AuditProcess from '@/components/AuditProcess'
import ReturnInfoDrawer, { ReturnApplyInfo } from '../../../components/ReturnInfoDrawer'
import { OuterHistoryData, InnerHistoryData } from '../../../components/FlowRecords'
import { RETURN_OUTER_STATUS_TAG_MAP, RETURN_INNER_STATUS_BADGE_MAP } from '../../../constants'
import { isMaterialOrder } from '../../../utils'
import { getWebIntl } from '@apps/locales'
const translate = getWebIntl()
const ProductList = React.lazy(() => import('../../../components/ProductList'))
const ReturnAnalysis = React.lazy(() => import('../../../components/ReturnAnalysis'))
const ReturnDetailInfo = React.lazy(() => import('../../../components/ReturnDetailInfo'))
const FileList = React.lazy(() => import('../../../components/FileList'))
const ReturnAddressInfo = React.lazy(() => import('../../../components/ReturnAddressInfo'))
const Score = React.lazy(() => import('../../../components/Score'))
const FlowRecords = React.lazy(() => import('../../../components/FlowRecords'))
const BasicInfo = React.lazy(() => import('../../../components/BasicInfo'))

export interface DetailInfoData extends GetAftersalesReturnGoodsGetDetailByConsumerResponse {
  fileList: FileData[]
}

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
   * 是否是 可以退款的
   */
  isEditRefund?: boolean
  /**
   * 是否是 可以编辑 地址的
   */
  isEditAddress?: boolean
  /**
   * 是否是 可以编辑 退货发货相关
   */
  isEditRefundDeliver?: boolean
  /**
   * 历史记录目标路径
   */
  target: string
  /**
   * 头部右侧拓展
   */
  headExtra?: (info: DetailInfoData) => React.ReactNode
}

const DetailInfo: React.FC<DetailInfoProps> = ({
  id,
  isEditRefund = false,
  isEditAddress = false,
  isEditRefundDeliver = false,
  target,
  headExtra = null,
}) => {
  const [detailInfo, setDetailInfo] = useState<DetailInfoData>(null)
  const [returnGoodsList, setReturnGoodsList] = useState<GetAftersalesReturnGoodsPageReturnedGoodsResponse>({
    data: [],
    totalCount: 0,
  })
  const [returnGoodsLoading, setReturnGoodsLoading] = useState(false)
  const [infoLoading, setInfoloading] = useState(false)
  const [visibleOrderDetial, setVisibleReturnInfo] = useState<boolean>(false)
  const [applyInfo, setApplyInfo] = useState<ReturnApplyInfo>(null)

  const intl = useIntl()

  const handleCheckOrderDetial = (record) => {
    setApplyInfo({
      orderId: record.orderId,
      orderNo: record.orderNo,
      productName: record.productName,
      category: record.category,
      brand: record.brand,
      unit: record.unit,
      purchaseCount: record.purchaseCount,
      purchasePrice: record.purchasePrice,
      purchaseAmount: record.purchaseAmount,
      returnCount: record.returnCount,
      returnReason: record.returnReason,
      payList: record.payList.map((item) => ({
        ...item,
        payWayTxt: item.payWayName,
        channelTxt: item.channelName,
      })),
      orderType: detailInfo?.orderType,
      refundAmount: record.refundAmount,
    })
    setVisibleReturnInfo(true)
  }

  const isMateriel = isMaterialOrder(detailInfo?.orderType)

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
      title: intl.formatMessage({ id: 'afterService.common.productColumns.purchaseCount', defaultMessage: '采购数量' }),
      dataIndex: 'purchaseCount',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.productColumns.purchasePrice', defaultMessage: '采购单价' }),
      dataIndex: 'purchasePrice',
      align: 'center',
    },
    !isMateriel
      ? {
          title: `${intl.formatMessage({
            id: 'afterService.common.productColumns.payAmount',
            defaultMessage: '已支付',
          })}/${intl.formatMessage({
            id: 'afterService.common.productColumns.purchaseAmount',
            defaultMessage: '采购金额',
          })}`,
          dataIndex: 'payAmount',
          render: (text, record) => (
            <DescProgress
              descriptions={[
                {
                  title: `${intl.formatMessage({
                    id: 'afterService.common.productColumns.payAmount2',
                    defaultMessage: '已支付金额',
                  })}:`,
                  value: `${translate('web.common.currencySymbol')}${text}`,
                },
                {
                  title: `${intl.formatMessage({
                    id: 'afterService.common.productColumns.purchaseAmount',
                    defaultMessage: '采购金额',
                  })}:`,
                  value: `${translate('web.common.currencySymbol')}${record.purchaseAmount}`,
                },
              ]}
              percent={(text / record.purchaseAmount) * 100}
            />
          ),
        }
      : {
          title: intl.formatMessage({
            id: 'afterService.common.productColumns.purchaseAmount',
            defaultMessage: '采购金额',
          }),
          dataIndex: 'purchaseAmount',
          align: 'center',
          render: (text) => `${translate('web.common.currencySymbol')}${text}`,
        },
    {
      title: intl.formatMessage({ id: 'afterService.common.productColumns.returnCount', defaultMessage: '退货数量' }),
      dataIndex: 'returnCount',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.productColumns.refundAmount', defaultMessage: '退货金额' }),
      dataIndex: 'refundAmount',
      align: 'center',
    },
    {
      title: intl.formatMessage({
        id: 'afterService.common.productColumns.needReturnName',
        defaultMessage: '是否退货',
      }),
      dataIndex: 'needReturnName',
      align: 'center',
      render: (text) => text,
    },
    {
      title: intl.formatMessage({ id: 'common.table.action' }),
      dataIndex: 'option',
      align: 'center',
      render: (text, record) => (
        <>
          <Button type="link" onClick={() => handleCheckOrderDetial(record)}>
            {intl.formatMessage({ id: 'afterService.common.productColumns.checkInfo', defaultMessage: '查看详情' })}
          </Button>
        </>
      ),
    },
  ] as EditableColumns[]

  // 获取退货申请详情
  const getDetailInfo = () => {
    if (!id) {
      return
    }
    setInfoloading(true)
    getAftersalesReturnGoodsGetDetailByConsumer({
      returnId: id,
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

  // 获取退货明细列表
  const getReturnGoods = () => {
    if (!id) {
      return
    }
    setReturnGoodsLoading(true)
    getAftersalesReturnGoodsPageReturnedGoods({
      returnId: id,
      current: `${1}`,
      pageSize: `${99999}`,
    })
      .then((res) => {
        if (res.code === 1000) {
          setReturnGoodsList(res.data)
        }
      })
      .catch((err) => {
        console.warn(err)
      })
      .finally(() => {
        setReturnGoodsLoading(false)
      })
  }

  useEffect(() => {
    getDetailInfo()
    getReturnGoods()
  }, [])

  const handleReceivedConfirmReturnDeliver = (id): Promise<any> => {
    return postAftersalesReturnGoodsConfirmReturnDeliveryGoods({
      id,
    }).then((res) => {
      if (res.code === 1000) {
        setTimeout(() => {
          history.goBack()
        }, 800)
      }
    })
  }

  const handleConfirmReturnBack = (id): Promise<any> => {
    return postAftersalesReturnGoodsConfirmReturnGoodsReceipt({
      id,
    }).then((res) => {
      if (res.code === 1000) {
        getDetailInfo()
      }
    })
  }

  const fetchOuterHistory = (params): Promise<OuterHistoryData> => {
    return new Promise((resolve, reject) => {
      getAftersalesReturnGoodsPageOuterWorkflowRecord({
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
      getAftersalesReturnGoodsPageInnerWorkflowRecord({
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

  // 确认退款到账
  const handleConfirm = (id, flag): Promise<void> => {
    return new Promise((resolve, reject) => {
      postAftersalesReturnGoodsConfirmRefund({
        refundId: id,
        isReceipt: flag,
      })
        .then((res) => {
          if (res.code === 1000) {
            getDetailInfo()
            resolve()
          } else {
            reject()
          }
        })
        .catch(() => {
          reject()
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
    detailInfo && detailInfo.outerStatus === RETURN_OUTER_STATUS_FINISHED
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
    detailInfo &&
    !isMateriel &&
    (detailInfo.outerStatus === RETURN_OUTER_STATUS_TO_BE_REFUNDED ||
      detailInfo.outerStatus === RETURN_OUTER_STATUS_UNCONFIRMED_REFUNDED ||
      detailInfo.outerStatus === RETURN_OUTER_STATUS_NOT_RECEIVED ||
      detailInfo.outerStatus === RETURN_OUTER_STATUS_UNCONFIRMED_FINISHED ||
      detailInfo.outerStatus === RETURN_OUTER_STATUS_FINISHED)
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
      title: intl.formatMessage({ id: 'afterService.common.basicInfo.supplierName', defaultMessage: '供应会员' }),
      value: detailInfo && detailInfo.supplierName ? detailInfo.supplierName : '',
      columnProps: {
        span: 2,
      },
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.basicInfo.outerStatus', defaultMessage: '外部状态' }),
      value: (
        <StatusTag type={RETURN_OUTER_STATUS_TAG_MAP[detailInfo?.outerStatus]} title={detailInfo?.outerStatusName} />
      ),
      columnProps: {
        span: 3,
      },
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.basicInfo.innerStatus', defaultMessage: '内部状态' }),
      value: (
        <Badge
          color={RETURN_INNER_STATUS_BADGE_MAP[detailInfo?.innerStatus] || '#606266'}
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
      extra={headExtra && headExtra(detailInfo)}
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

          {/* 退货商品 */}
          <Col span={24}>
            <Suspense fallback={null}>
              <ProductList
                title={intl.formatMessage({ id: 'afterService.common.return.products', defaultMessage: '退货商品' })}
                rowKey="orderRecordId"
                columns={productColumns}
                loading={returnGoodsLoading}
                dataSource={returnGoodsList.data}
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

          {/* 退货地址信息 */}
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
                onFormSubmit={() => {}}
                isEdit={isEditAddress && detailInfo?.innerStatus === RETURN_INNER_STATUS_UNCOMMITTED}
                id="returnGoodsAddress"
              />
            </Suspense>
          </Col>

          {/* 售后评价 */}
          {detailInfo && detailInfo.outerStatus === RETURN_OUTER_STATUS_FINISHED && (
            <Col span={24}>
              <Suspense fallback={null}>
                <Score score={detailInfo?.evaluate?.level} content={detailInfo?.evaluate?.content} id="evaluate" />
              </Suspense>
            </Col>
          )}

          {detailInfo && detailInfo.returnDeliveryGoodsList && detailInfo.returnDeliveryGoodsList.length > 0 && (
            <Col span={24}>
              <Suspense fallback={null}>
                {/* 退货发货信息 */}
                <ReturnAnalysis
                  summary={detailInfo && detailInfo.returnStatisticsList ? detailInfo.returnStatisticsList : []}
                  detailed={detailInfo && detailInfo.returnDeliveryGoodsList ? detailInfo.returnDeliveryGoodsList : []}
                  onConfirmReturnDeliver={handleReceivedConfirmReturnDeliver}
                  onConfirmReturnBack={handleConfirmReturnBack}
                  isPurchaser={true}
                  innerStatus={detailInfo?.innerStatus}
                  target={target}
                  isEdit={isEditRefundDeliver}
                  afterType={3}
                  deliveryType={detailInfo?.returnGoodsAddress?.deliveryType}
                  orderType={detailInfo?.orderType}
                  id="returnDeliveryGoodsList"
                />
              </Suspense>
            </Col>
          )}

          {/* 退款明细信息 */}
          {detailInfo &&
            !isMateriel &&
            (detailInfo.outerStatus === RETURN_OUTER_STATUS_TO_BE_REFUNDED ||
              detailInfo.outerStatus === RETURN_OUTER_STATUS_UNCONFIRMED_REFUNDED ||
              detailInfo.outerStatus === RETURN_OUTER_STATUS_NOT_RECEIVED ||
              detailInfo.outerStatus === RETURN_OUTER_STATUS_UNCONFIRMED_FINISHED ||
              detailInfo.outerStatus === RETURN_OUTER_STATUS_FINISHED) && (
              <Col span={24}>
                <Suspense fallback={null}>
                  <ReturnDetailInfo
                    dataSource={detailInfo && detailInfo.refundList ? detailInfo.refundList : []}
                    onConfirm={handleConfirm}
                    outerStatus={detailInfo?.outerStatus}
                    purchaserId={detailInfo?.memberId}
                    purchaserRoleId={detailInfo?.roleId}
                    supplierId={detailInfo?.parentMemberId}
                    supplierRoleId={detailInfo?.parentMemberRoleId}
                    isEdit={isEditRefund}
                    id="refundList"
                    isPurchaser
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
                outerStatusMap={RETURN_OUTER_STATUS_TAG_MAP}
                innerStatusColorMap={RETURN_INNER_STATUS_BADGE_MAP}
                id="workflowRecord"
              />
            </Suspense>
          </Col>
        </Row>

        <ReturnInfoDrawer
          visible={visibleOrderDetial}
          applyInfo={applyInfo}
          onClose={() => setVisibleReturnInfo(false)}
        />
      </Spin>
    </PageHeaderWrapper>
  )
}

export default DetailInfo
