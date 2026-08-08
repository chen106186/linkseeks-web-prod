import React, { Suspense, useEffect, useMemo, useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Spin, Row, Col, Badge } from 'antd'
import {
  getAftersalesRepairGoodsGetDetailByConsumer,
  GetAftersalesRepairGoodsGetDetailByConsumerResponse,
  getAftersalesRepairGoodsPageRepairGoods,
  GetAftersalesRepairGoodsPageRepairGoodsResponse,
} from '@apps/apis'
import { PageHeaderWrapper } from '@apps/components'
import { normalizeFiledata, FileData, findLastIndexFlowState, isJSONStr } from '@/utils'
import StatusTag from '@/components/StatusTag'
import { EditableColumns } from '@/components/PolymericTable/interface'
import { REPAIR_OUTER_STATUS_FINISHED } from '@/constants/afterService'
import { ORDER_TYPE_TENDER_CONTRACT, ORDER_TYPE } from '@/constants/order'
import { REPAIR_OUTER_STATUS_TAG_MAP, REPAIR_INNER_STATUS_BADGE_MAP } from '../../../constants'
import { isMaterialOrder } from '../../../utils'

const OuterCirculation = React.lazy(() => import('../../../components/OuterCirculation'))
const ProductList = React.lazy(() => import('../../../components/ProductList'))
const FileList = React.lazy(() => import('../../../components/FileList'))
const RepairAddressInfo = React.lazy(() => import('../../../components/RepairAddressInfo'))
const Score = React.lazy(() => import('../../../components/Score'))
const FlowRecords = React.lazy(() => import('../../../components/FlowRecords'))
const BasicInfo = React.lazy(() => import('../../../components/BasicInfo'))

interface DetailInfoProps {
  /**
   * 记录id
   */
  id: string
  /**
   * 是否是编辑的
   */
  isEdit?: boolean
  /**
   * 历史记录目标路径
   */
  target: string
  /**
   * 头部右侧拓展
   */
  headExtra?: React.ReactNode
}

interface DetailInfo extends GetAftersalesRepairGoodsGetDetailByConsumerResponse {
  fileList: FileData[]
}

const DetailInfo: React.FC<DetailInfoProps> = ({ id, target, headExtra = null }) => {
  const [detailInfo, setDetailInfo] = useState<DetailInfo>(null)
  const [repairGoodsList, setRepairGoodsList] = useState<GetAftersalesRepairGoodsPageRepairGoodsResponse>({
    data: [],
    totalCount: 0,
  })
  const [infoLoading, setInfoLoading] = useState(false)
  const [repairGoodsLoading, setRepairGoodsLoading] = useState(false)

  const isMateriel = isMaterialOrder(detailInfo?.orderType)

  const intl = useIntl()

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
      title: intl.formatMessage({ id: 'afterService.common.productColumns.repairCount', defaultMessage: '维修数量' }),
      dataIndex: 'repairCount',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.productColumns.repairReason', defaultMessage: '维修原因' }),
      dataIndex: 'repairReason',
      align: 'center',
    },
  ] as EditableColumns[]

  // 获取维修申请详情
  const getDetailInfo = () => {
    if (!id) {
      return
    }
    setInfoLoading(true)
    getAftersalesRepairGoodsGetDetailByConsumer({
      repairId: id,
    })
      .then((res) => {
        if (res.code === 1000) {
          const { repairAddress, faultFileList, supplierName, supplierMemberId, supplierRoleId, ...rest } =
            res.data as any

          setDetailInfo({
            faultFileList,
            supplierName,
            ...rest,
            fileList: faultFileList
              ? faultFileList.map((item) => ({ ...normalizeFiledata(item.filePath), name: item.fileName }))
              : [],
            repairAddress: isJSONStr(repairAddress) || null,
          })
        }
      })
      .finally(() => {
        setInfoLoading(false)
      })
  }

  // 获取维修明细列表
  const getRepairGoods = () => {
    if (!id) {
      return
    }
    setRepairGoodsLoading(true)
    getAftersalesRepairGoodsPageRepairGoods({
      repairId: id,
      current: `${1}`,
      pageSize: `${99999}`,
    })
      .then((res) => {
        if (res.code === 1000) {
          setRepairGoodsList(res.data)
        }
      })
      .catch((err) => {
        console.warn(err)
      })
      .finally(() => {
        setRepairGoodsLoading(false)
      })
  }

  useEffect(() => {
    getDetailInfo()
    getRepairGoods()
  }, [])

  const isFinished = (detailInfo && detailInfo.outerStatus) === REPAIR_OUTER_STATUS_FINISHED

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
      key: 'repairGoodsList',
      label: intl.formatMessage({
        id: 'afterService.common.return.anchors.repairProducts',
        defaultMessage: '维修商品',
      }),
    },
    {
      key: 'faultFileList',
      label: intl.formatMessage({ id: 'afterService.common.return.anchors.faultFileList', defaultMessage: '附件' }),
    },
    {
      key: 'repairAddress',
      label: intl.formatMessage({ id: 'afterService.common.return.anchors.repairAddress', defaultMessage: '维修地址' }),
    },
    isFinished
      ? {
          key: 'evaluate',
          label: intl.formatMessage({ id: 'afterService.common.return.anchors.evaluate', defaultMessage: '售后评价' }),
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
        <StatusTag type={REPAIR_OUTER_STATUS_TAG_MAP[detailInfo?.outerStatus]} title={detailInfo?.outerStatusName} />
      ),
      columnProps: {
        span: 3,
      },
    },
    {
      title: intl.formatMessage({ id: 'afterService.common.basicInfo.innerStatus', defaultMessage: '内部状态' }),
      value: (
        <Badge
          color={REPAIR_INNER_STATUS_BADGE_MAP[detailInfo?.innerStatus] || '#606266'}
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
      extra={headExtra}
    >
      <Spin spinning={infoLoading}>
        <Row gutter={[16, 16]}>
          {/* 流转记录 */}
          <Col span={24}>
            <Suspense fallback={null}>
              <OuterCirculation
                steps={
                  detailInfo && detailInfo.outerTaskList
                    ? detailInfo.outerTaskList.map((item, index) => ({
                        title: item.taskName,
                        description: item.roleName,
                        status: item.isExecute ? (index === outerVerifyCurrent ? 'process' : 'finish') : 'wait',
                      }))
                    : []
                }
                current={outerVerifyCurrent}
                id="taskList"
              />
            </Suspense>
          </Col>

          {/* 基本信息 */}
          <Col span={24}>
            <Suspense fallback={null}>
              <BasicInfo data={BasicInfoData} id="basicInfo" />
            </Suspense>
          </Col>

          {/* 维修商品 */}
          <Col span={24}>
            <Suspense fallback={null}>
              <ProductList
                title={intl.formatMessage({ id: 'afterService.common.repair.products', defaultMessage: '维修商品' })}
                rowKey="orderRecordId"
                columns={productColumns}
                dataSource={repairGoodsList.data}
                loading={repairGoodsLoading}
                id="repairGoodsList"
              />
            </Suspense>
          </Col>

          {/* 附件 */}
          <Col span={24}>
            <Suspense fallback={null}>
              <FileList fileList={detailInfo?.fileList} id="faultFileList" />
            </Suspense>
          </Col>

          {/* 维修地址信息 */}
          <Col span={24}>
            <Suspense fallback={null}>
              <RepairAddressInfo
                info={detailInfo && detailInfo.repairAddress ? (detailInfo.repairAddress as any) : {}}
                id="repairAddress"
              />
            </Suspense>
          </Col>

          {/* 售后评价 */}
          {isFinished && (
            <Col span={24}>
              <Suspense fallback={null}>
                <Score score={detailInfo?.evaluate?.level} content={detailInfo?.evaluate?.content} id="evaluate" />
              </Suspense>
            </Col>
          )}

          {/* 内、外部流转记录 */}
          <Col span={24}>
            <Suspense fallback={null}>
              <FlowRecords
                outerHistory={detailInfo?.outerRecordList}
                outerStatusMap={REPAIR_OUTER_STATUS_TAG_MAP}
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
