import React, { Suspense, useEffect, useState } from 'react'
import { PageHeader, Descriptions, Spin, Row, Col, Badge } from 'antd'
import { PageHeaderWrapper } from '@apps/components'
import { history } from '@linkseeks/router-manager'
import {
  GetAftersalesRepairGoodsGetDetailBySupplierResponse,
  GetAftersalesRepairGoodsPageRepairGoodsResponse,
} from '@apps/apis'
import { normalizeFiledata, FileData, findLastIndexFlowState, isJSONStr } from '@/utils'
import { usePageStatus } from '@/hooks/usePageStatus'
import AvatarWrap from '@/components/AvatarWrap'
import StatusTag from '@/components/StatusTag'
import AuditProcess from '@/components/AuditProcess'
import { EditableColumns } from '@/components/PolymericTable/interface'
import { REPAIR_OUTER_STATUS_FINISHED } from '@/constants'
import { REPAIR_OUTER_STATUS_TAG_MAP, REPAIR_INNER_STATUS_BADGE_MAP } from '../constants'
import { getAftersalesRepairGoodsGetDetailByPlatform, getAftersalesRepairGoodsPageRepairGoods } from '@apps/apis'

const ProductList = React.lazy(() => import('../components/ProductList'))
const FileList = React.lazy(() => import('../components/FileList'))
const RepairAddressInfo = React.lazy(() => import('../components/RepairAddressInfo'))
const Score = React.lazy(() => import('../components/Score'))
const FlowRecords = React.lazy(() => import('../components/FlowRecords'))

interface DetailInfo extends GetAftersalesRepairGoodsGetDetailBySupplierResponse {
  fileList: FileData[]
}

const DetailInfo: React.FC = () => {
  const { id } = usePageStatus()
  const [detailInfo, setDetailInfo] = useState<DetailInfo>({})
  const [repairGoodsList, setRepairGoodsList] = useState<GetAftersalesRepairGoodsPageRepairGoodsResponse>({
    data: [],
    totalCount: 0,
  })
  const [infoLoading, setInfoLoading] = useState(false)
  const [repairGoodsLoading, setRepairGoodsLoading] = useState(false)

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
      title: '维修数量',
      dataIndex: 'repairCount',
      align: 'center',
    },
    {
      title: '维修原因',
      dataIndex: 'repairReason',
      align: 'center',
    },
  ]

  // 获取查询维修申请详情
  const getDetailInfo = () => {
    if (!id) {
      return
    }
    setInfoLoading(true)
    getAftersalesRepairGoodsGetDetailByPlatform({
      repairId: id,
    })
      .then((res) => {
        if (res.code === 1000) {
          const { repairAddress, faultFileList, supplierName, ...rest } = res.data

          setDetailInfo({
            faultFileList,
            supplierName,
            ...rest,
            fileList: faultFileList?.map((item) => normalizeFiledata(item.filePath, item.fileName)),
            repairAddress: isJSONStr(repairAddress) || null,
          })
        }
      })
      .catch((err) => {
        console.warn(err)
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
                  <Descriptions.Item label="申请单摘要：">{detailInfo?.applyAbstract}</Descriptions.Item>
                  <Descriptions.Item label="供应会员">{detailInfo?.supplierName}</Descriptions.Item>
                  <Descriptions.Item label="单据时间">{detailInfo?.applyTime}</Descriptions.Item>
                  <Descriptions.Item label="外部状态">
                    <StatusTag
                      type={REPAIR_OUTER_STATUS_TAG_MAP[detailInfo?.outerStatus]}
                      title={detailInfo?.outerStatusName}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="内部状态">
                    <Badge
                      color={REPAIR_INNER_STATUS_BADGE_MAP[detailInfo?.innerStatus]}
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
            <Suspense fallback={null}>
              <ProductList
                title="维修商品"
                rowKey="orderRecordId"
                columns={productColumns}
                dataSource={repairGoodsList.data}
                loading={repairGoodsLoading}
              />
            </Suspense>
          </Col>

          <Col span={24}>
            <Suspense fallback={null}>
              <Row gutter={24}>
                <Col span={6}>
                  <Suspense fallback={null}>
                    <FileList fileList={detailInfo?.fileList} />
                  </Suspense>
                </Col>

                <Col span={isFinished ? 12 : 18}>
                  <Suspense fallback={null}>
                    <RepairAddressInfo
                      info={detailInfo && detailInfo.repairAddress ? (detailInfo.repairAddress as any) : {}}
                    />
                  </Suspense>
                </Col>

                {isFinished && (
                  <Col span={6}>
                    <Suspense fallback={null}>
                      <Score score={detailInfo?.evaluate?.level} />
                    </Suspense>
                  </Col>
                )}
              </Row>
            </Suspense>
          </Col>

          <Col span={24}>
            <Suspense fallback={null}>
              <FlowRecords outerHistory={detailInfo?.outerRecordList} />
            </Suspense>
          </Col>
        </Row>
      </PageHeaderWrapper>
    </Spin>
  )
}

export default DetailInfo
