import React, { Suspense, useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Spin, Button, Space, Col, Badge, Switch, Tooltip, message } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { useIntl } from '@linkseeks/i18n'
import { history } from '@linkseeks/router-manager'
import {
  getAftersalesReturnGoodsGetDetailBySupplier,
  GetAftersalesReturnGoodsGetDetailBySupplierResponse,
  getAftersalesReturnGoodsPageInnerWorkflowRecord,
  getAftersalesReturnGoodsPageOuterWorkflowRecord,
  getAftersalesReturnGoodsPageReturnedGoods,
  GetAftersalesReturnGoodsPageReturnedGoodsResponse,
  postAftersalesReturnGoodsConfirmReturnReceiveGoods,
  postAftersalesReturnGoodsRefund,
  postAftersalesReturnGoodsSetNeedReturnGoods,
} from '@apps/apis'
import {
  RETURN_OUTER_STATUS_FINISHED,
  RETURN_OUTER_STATUS_TO_BE_REFUNDED,
  RETURN_OUTER_STATUS_UNCONFIRMED_REFUNDED,
  RETURN_OUTER_STATUS_NOT_RECEIVED,
  RETURN_OUTER_STATUS_UNCONFIRMED_FINISHED,
  RETURN_INNER_STATUS_UNCOMMITTED,
} from '@/constants/afterService'
import { ORDER_TYPE_TENDER_CONTRACT, ORDER_TYPE } from '@/constants/order'
import { normalizeFiledata, FileData, findLastIndexFlowState } from '@/utils'
import { PageHeaderWrapper } from '@apps/components'
import StatusTag from '@/components/StatusTag'
import AuditProcess from '@/components/AuditProcess'
import { EditableColumns } from '@/components/PolymericTable/interface'
import DescProgress from '@/components/DescProgress'
import { Values as ReturnAddressValues } from '../../../components/ReturnAddressInfo'
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
  headExtra?: (info: DetailInfo, returnAddress: ReturnAddressValues) => React.ReactNode
}

interface DetailInfo extends GetAftersalesReturnGoodsGetDetailBySupplierResponse {
  fileList: FileData[]
}

const DetailInfo: React.FC<DetailInfoProps> = ({
  id,
  isEditReturn = false,
  isEditRefund = false,
  isEditAddress = false,
  isEditRefundDeliver = false,
  target,
  headExtra = null,
}) => {
  const [detailInfo, setDetailInfo] = useState<DetailInfo>(null)
  const [returnGoodsList, setReturnGoodsList] = useState<GetAftersalesReturnGoodsPageReturnedGoodsResponse>({
    data: [],
    totalCount: 0,
  })
  const [returnGoodsLoading, setReturnGoodsLoading] = useState(false)
  const [infoLoading, setInfoloading] = useState(false)
  const [visibleOrderDetial, setVisibleReturnInfo] = useState<boolean>(false)
  const [returnAddress, setReturnAddress] = useState<ReturnAddressValues>(null)
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

  const handleReturn = (record) => {
    if (!isEditReturn || !id) {
      return
    }
    const msg = message.loading({
      content: intl.formatMessage({ id: 'afterService.common.upload.message', defaultMessage: '正在更改...' }),
      duration: 0,
    })
    postAftersalesReturnGoodsSetNeedReturnGoods({
      returnId: +id,
      returnGoodsId: record.returnGoodsId,
      isNeed: record.isNeedReturn === 1 ? 0 : 1,
    })
      .then((res) => {
        if (res.code === 1000) {
          getReturnGoods()
        }
      })
      .finally(() => {
        msg()
      })
  }

  const isMateriel = isMaterialOrder(detailInfo?.orderType)

  const productColumns: EditableColumns[] = [
    {
      title: intl.formatMessage({ id: 'afterService.order.query.column.orderNo', defaultMessage: '订单号' }),
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
      dataIndex: 'needReturnName',
      align: 'center',
      render: (text, record) => (
        <>{!isEditReturn ? text : <Switch checked={record.isNeedReturn} onChange={() => handleReturn(record)} />}</>
      ),
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
    getAftersalesReturnGoodsGetDetailBySupplier({
      returnId: id,
    })
      .then((res) => {
        if (res.code === 1000) {
          const { faultFileList, ...rest } = res.data

          setDetailInfo({
            faultFileList,
            fileList: faultFileList?.map((item) => normalizeFiledata(item.filePath)),
            ...rest,
          })
          if (isEditAddress) {
            setReturnAddress({
              receiveId: detailInfo?.returnGoodsAddress?.receiveId,
              receiveAddress: detailInfo?.returnGoodsAddress?.receiveAddress,
              receiveUserName: detailInfo?.returnGoodsAddress?.receiveUserName,
              receiveUserTel: detailInfo?.returnGoodsAddress?.receiveUserTel,
            })
          }
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

  const handleReturnAddressSubmit = (values) => {
    setReturnAddress(values)
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

  // 确认退货收货
  const handleReceivedConfirmReturnReceive = (id): Promise<any> => {
    return postAftersalesReturnGoodsConfirmReturnReceiveGoods({
      id,
    }).then((res) => {
      if (res.code === 1000) {
        history.goBack()
      }
    })
  }

  // 退款
  const handleRefund = (values): Promise<any> => {
    const { id, refundAmount, ...rest } = values
    return postAftersalesReturnGoodsRefund({
      dataId: id,
      ...rest,
    }).then((res) => {
      if (res.code === 1000) {
        getDetailInfo()
      }
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
      title: intl.formatMessage({ id: 'afterService.common.basicInfo.consumerName', defaultMessage: '采购会员' }),
      value: detailInfo && detailInfo.consumerName ? detailInfo.consumerName : '',
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
  const innerVerifyCurrent = useMemo(() => findLastIndexFlowState(detailInfo?.innerTaskList), [detailInfo])

  return (
    <PageHeaderWrapper
      title={`${detailInfo && detailInfo.applyAbstract ? detailInfo.applyAbstract : ''} ｜ ${
        detailInfo && detailInfo.applyNo ? detailInfo.applyNo : ''
      }`}
      items={anchorsArr as { key: string; label: string }[]}
      extra={headExtra && headExtra(detailInfo, returnAddress, returnGoodsList)}
    >
      <Spin spinning={infoLoading}>
        <Helmet>
          <title>{`${detailInfo && detailInfo.applyAbstract ? detailInfo.applyAbstract : ''} ｜ ${
            detailInfo && detailInfo.applyNo ? detailInfo.applyNo : ''
          }`}</title>
        </Helmet>
        <Space direction="vertical" size={16}>
          {/* 流转进度 */}
          <AuditProcess
            outerVerifySteps={
              detailInfo && detailInfo.outerTaskList
                ? detailInfo.outerTaskList.map((item, index) => ({
                    step: item.step,
                    stepName: item.taskName,
                    roleName: item.roleName,
                    status: item.isExecute ? (index === outerVerifyCurrent ? 'process' : 'finish') : 'wait',
                  }))
                : []
            }
            outerVerifyCurrent={outerVerifyCurrent}
            innerVerifySteps={
              detailInfo && detailInfo.innerTaskList
                ? detailInfo.innerTaskList.map((item, index) => ({
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

          {/* 基本信息 */}
          <BasicInfo data={BasicInfoData} id="basicInfo" />

          {/* 退货商品 */}
          <ProductList
            title={intl.formatMessage({ id: 'afterService.common.return.products', defaultMessage: '退货商品' })}
            rowKey="orderRecordId"
            columns={productColumns}
            loading={returnGoodsLoading}
            dataSource={returnGoodsList.data}
            id="goodsDetailList"
          />

          {/* 附件 */}
          <FileList fileList={detailInfo?.fileList} id="faultFileList" />

          {/* 退货地址信息 */}
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
            onFormSubmit={handleReturnAddressSubmit}
            isEdit={isEditAddress && detailInfo?.innerStatus === RETURN_INNER_STATUS_UNCOMMITTED}
            id="returnGoodsAddress"
          />

          {/* 售后评价 */}
          {detailInfo && detailInfo.outerStatus === RETURN_OUTER_STATUS_FINISHED && (
            <Score score={detailInfo?.evaluate?.level} content={detailInfo?.evaluate?.content} id="evaluate" />
          )}

          {/* 退货发货信息 */}
          {detailInfo && detailInfo.returnDeliveryGoodsList && detailInfo.returnDeliveryGoodsList.length > 0 && (
            <ReturnAnalysis
              summary={detailInfo && detailInfo.returnStatisticsList ? detailInfo.returnStatisticsList : []}
              detailed={detailInfo && detailInfo.returnDeliveryGoodsList ? detailInfo.returnDeliveryGoodsList : []}
              onConfirmReturnReceive={handleReceivedConfirmReturnReceive}
              innerStatus={detailInfo?.innerStatus}
              isEdit={isEditRefundDeliver}
              afterType={3}
              deliveryType={detailInfo?.returnGoodsAddress?.deliveryType}
              orderType={detailInfo?.orderType}
              id="returnDeliveryGoodsList"
            />
          )}

          {/* 退款明细信息 */}
          {detailInfo &&
            !isMateriel &&
            (detailInfo.outerStatus === RETURN_OUTER_STATUS_TO_BE_REFUNDED ||
              detailInfo.outerStatus === RETURN_OUTER_STATUS_UNCONFIRMED_REFUNDED ||
              detailInfo.outerStatus === RETURN_OUTER_STATUS_NOT_RECEIVED ||
              detailInfo.outerStatus === RETURN_OUTER_STATUS_UNCONFIRMED_FINISHED ||
              detailInfo.outerStatus === RETURN_OUTER_STATUS_FINISHED) && (
              <ReturnDetailInfo
                dataSource={detailInfo && detailInfo.refundList ? detailInfo.refundList : []}
                onRefund={handleRefund}
                outerStatus={detailInfo?.outerStatus}
                purchaserId={detailInfo?.memberId}
                purchaserRoleId={detailInfo?.roleId}
                supplierId={detailInfo?.parentMemberId}
                supplierRoleId={detailInfo?.parentMemberRoleId}
                isEdit={isEditRefund}
                id="refundList"
              />
            )}

          {/* 内、外部流转记录 */}
          <FlowRecords
            fetchOuterHistory={fetchOuterHistory}
            fetchInnerHistory={fetchInnerHistory}
            outerStatusMap={RETURN_OUTER_STATUS_TAG_MAP}
            innerStatusColorMap={RETURN_INNER_STATUS_BADGE_MAP}
            id="workflowRecord"
          />
        </Space>

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
