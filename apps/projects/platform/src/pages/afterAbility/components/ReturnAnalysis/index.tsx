/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-05 15:18:15
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-09-24 10:27:17
 * @Description: 退货收货统计、退货发货明细
 */
import React, { useState } from 'react'
import { Row, Col, Descriptions, Badge, Modal, Tabs } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useIntl } from '@linkseeks/i18n'
import { Link } from '@linkseeks/router-core'
import { SummaryData, Detailed } from './interface'
import MellowCard, { MellowCardProps } from '@/components/MellowCard'
import { EditableColumns } from '@/components/PolymericTable/interface'
import PolymericTable from '@/components/PolymericTable'
import ButtonSwitch from '@/components/ButtonSwitch'
import DescProgress from '@/components/DescProgress'
import {
  RETURN_INNER_STATUS_UNCONFIRMED_RETURN_DELIVERY,
  RETURN_INNER_STATUS_UNCONFIRMED_RETURN_RECEIVE,
  RETURN_INNER_STATUS_UNCONFIRMED_RETURN_RECEIPT,
} from '@/constants/afterService'
import { ORDER_TYPE_TENDER_CONTRACT } from '@/constants/order'
import { useWebIntl } from '@apps/locales'
import {
  MAIL_INNER_STATUS_UNCONFIRMED_DELIVER,
  MAIL_INNER_STATUS_CONFIRMED_DELIVER,
  MAIL_INNER_STATUS_CONFIRMED_RECEIVING,
} from '../../constants'
import { isMaterialOrder } from '../../utils'
import ReturnDeliverDrawer, { AfterType } from '../DeliverDrawer'
import styles from './index.less'

const { confirm } = Modal
const { TabPane } = Tabs

interface ReturnInfoProps extends MellowCardProps {
  /**
   * 退货收货统计
   */
  summary: SummaryData[]

  /**
   * 退货发货明细
   */
  detailed: Detailed[]

  /**
   * 是否是采购商
   */
  isPurchaser?: boolean

  /**
   * 确认退货回单
   */
  onConfirmReturnBack?: (id: number) => void

  /**
   * 确认退货发货
   */
  onConfirmReturnDeliver?: (id: number) => Promise<any>

  /**
   * 确认退货收货
   */
  onConfirmReturnReceive?: (id: number) => Promise<any>

  /**
   * 退货申请单内部状态
   */
  innerStatus: number

  /**
   * 是否可编辑
   */
  isEdit?: boolean

  /**
   * 售后类型，2 换货，3 退货
   */
  afterType: AfterType

  /**
   * 退货配送方式
   */
  deliveryType: number

  /**
   * 订单类型
   */
  orderType: number
}

const ReturnInfo: React.FC<ReturnInfoProps> = ({
  summary = [],
  detailed = [],
  isPurchaser = false,
  onConfirmReturnBack,
  onConfirmReturnDeliver,
  onConfirmReturnReceive,
  innerStatus,
  isEdit = false,
  afterType,
  deliveryType,
  orderType,
  ...rest
}) => {
  const [radioValue, setRadioValue] = useState<'1' | '2'>('2')
  const [visible, setVisible] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [currentDetailed, setCurrentDetailed] = useState<Detailed | null>(null)

  const isMateriel = isMaterialOrder(orderType)
  const translate = useWebIntl()
  const intl = useIntl()

  const commonColumns: EditableColumns[] = [
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
              orderType !== ORDER_TYPE_TENDER_CONTRACT
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
  ]

  const summaryColumns: EditableColumns[] = [
    {
      title: intl.formatMessage({
        id: 'afterService.components.ExchangeDeliverInfo.summaryColumns.orderNo',
        defaultMessage: '订单号',
      }),
      dataIndex: 'orderNo',
    },
    ...commonColumns,
    {
      title: intl.formatMessage({
        id: 'afterService.components.ReturnAnalysis.summaryColumns.returnCount',
        defaultMessage: '退货数量',
      }),
      dataIndex: 'returnCount',
    },
    {
      title: `${intl.formatMessage({
        id: 'afterService.components.ExchangeReceivedInfo.summaryColumns.deliveryCount',
        defaultMessage: '已退货发货',
      })}/${intl.formatMessage({
        id: 'afterService.components.ExchangeReceivedInfo.summaryColumns.unDeliveryCount',
        defaultMessage: '未退货发货',
      })}`,
      dataIndex: 'deliveryCount',
      render: (text, record) => (
        <DescProgress
          descriptions={[
            {
              title: `${intl.formatMessage({
                id: 'afterService.components.ExchangeReceivedInfo.summaryColumns.deliveryCount',
                defaultMessage: '已退货发货',
              })}:`,
              value: `${text}`,
            },
            {
              title: `${intl.formatMessage({
                id: 'afterService.components.ExchangeReceivedInfo.summaryColumns.unDeliveryCount',
                defaultMessage: '未退货发货',
              })}:`,
              value: `${record.unDeliveryCount}`,
            },
          ]}
          percent={(text / record.returnCount) * 100}
        />
      ),
    },
    {
      title: intl.formatMessage({
        id: 'afterService.components.ExchangeReceivedInfo.summaryColumns.receiveCount',
        defaultMessage: '已退货收货',
      }),
      dataIndex: 'receiveCount',
    },
    {
      title: intl.formatMessage({
        id: 'afterService.components.ExchangeDeliverInfo.summaryColumns.differenceCount',
        defaultMessage: '差异数量',
      }),
      dataIndex: 'differenceCount',
    },
  ]

  const detailedColumns: EditableColumns[] = [
    {
      title: intl.formatMessage({
        id: 'afterService.components.ExchangeDeliverInfo.detailedColumns.orderNo',
        defaultMessage: '订单号',
      }),
      dataIndex: 'orderNo',
    },
    ...commonColumns,
    {
      title: intl.formatMessage({
        id: 'afterService.components.ReturnAnalysis.detailedColumns.count',
        defaultMessage: '退货数量',
      }),
      dataIndex: 'count',
    },
    {
      title: intl.formatMessage({
        id: 'afterService.components.ExchangeReceivedInfo.detailedColumns.deliveryCount',
        defaultMessage: '退货发货数量',
      }),
      dataIndex: 'deliveryCount',
    },
    {
      title: intl.formatMessage({
        id: 'afterService.components.ExchangeReceivedInfo.detailedColumns.storageCount',
        defaultMessage: '退货入库数量',
      }),
      dataIndex: 'storageCount',
    },
    {
      title: intl.formatMessage({
        id: 'afterService.components.ExchangeDeliverInfo.detailedColumns.differenceCount',
        defaultMessage: '差异数量',
      }),
      dataIndex: 'differenceCount',
    },
  ]

  const handleVisibleDrawer = (flag) => {
    setVisible(!!flag)
  }

  const handleConfirmReturnDeliver = (record: Detailed) => {
    setCurrentDetailed(record)
    handleVisibleDrawer(true)
  }

  const handleConfirmReturnReceive = (id) => {
    if (onConfirmReturnReceive) {
      confirm({
        title: intl.formatMessage({ id: 'afterService.components.ExchangeReceivedInfo.tip', defaultMessage: '提示' }),
        icon: <ExclamationCircleOutlined />,
        content: translate('web.resource.afterAbility.shifouquerentuihuoshouhuo'),
        onOk() {
          return onConfirmReturnReceive(id)
        },
      })
    }
  }

  const handleConfirmReturnBack = (id) => {
    if (onConfirmReturnBack) {
      confirm({
        title: intl.formatMessage({ id: 'afterService.components.ExchangeReceivedInfo.tip', defaultMessage: '提示' }),
        icon: <ExclamationCircleOutlined />,
        content: intl.formatMessage({
          id: 'afterService.components.ExchangeReceivedInfo.back.content',
          defaultMessage: '是否确认退货回单？',
        }),
        onOk() {
          return onConfirmReturnBack(id)
        },
      })
    }
  }

  const handleRadioChange = (value: '1' | '2') => {
    setRadioValue(value)
  }

  const handleReturnDeliverSubmit = () => {
    if (onConfirmReturnDeliver) {
      setSubmitLoading(true)
      onConfirmReturnDeliver(currentDetailed.deliveryId).finally(() => {
        setSubmitLoading(false)
      })
    }
  }

  const options = [
    {
      label: !isPurchaser
        ? intl.formatMessage({
            id: 'afterService.components.ExchangeReceivedInfo.summary.label1',
            defaultMessage: '退货收货统计',
          })
        : intl.formatMessage({
            id: 'afterService.components.ExchangeReceivedInfo.summary.label2',
            defaultMessage: '退货发货统计',
          }),
      value: '1',
    },
    {
      label: !isPurchaser
        ? intl.formatMessage({
            id: 'afterService.components.ExchangeReceivedInfo.detailed.label1',
            defaultMessage: '退货收货明细',
          })
        : intl.formatMessage({
            id: 'afterService.components.ExchangeReceivedInfo.detailed.label2',
            defaultMessage: '退货发货明细',
          }),
      value: '2',
    },
  ]

  return (
    <MellowCard
      title={intl.formatMessage({ id: 'afterService.components.ReturnAnalysis.title', defaultMessage: '退货发货信息' })}
      extra={<ButtonSwitch options={options} onChange={handleRadioChange} value={radioValue} />}
      bodyStyle={{
        paddingTop: radioValue === '1' ? 16 : 0,
      }}
      {...rest}
    >
      {radioValue === '1' ? (
        <PolymericTable
          rowKey={() => Math.random().toFixed(16).slice(2, 10)}
          dataSource={summary}
          columns={summaryColumns}
          loading={false}
          pagination={null}
        />
      ) : null}
      {radioValue === '2' ? (
        <>
          <Tabs defaultActiveKey={detailed ? `${detailed[detailed.length - 1].batch}` : ''}>
            {detailed.map((item) => (
              <TabPane
                tab={intl.formatMessage({ id: 'afterService.components.ExchangeDeliverInfo.batch', batch: item.batch })}
                key={`${item.batch}`}
              >
                <div className={styles.detailedWrap}>
                  <Row align="middle">
                    <Col span={16}>
                      <Descriptions>
                        <Descriptions.Item
                          label={intl.formatMessage({
                            id: 'afterService.components.ExchangeReceivedInfo.deliveryNo',
                            defaultMessage: '退货发货单号',
                          })}
                        >
                          {isPurchaser ? (
                            <Link
                              to={`/afterAbility/returnApplication/returnPrAddDeliver/deliverDetail?id=${item.deliveryNoId}`}
                            >
                              {item.deliveryNo}
                            </Link>
                          ) : (
                            item.deliveryNo
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={intl.formatMessage({
                            id: 'afterService.components.ExchangeDeliverInfo.logisticsOrderNo',
                            defaultMessage: '物流单号',
                          })}
                        >
                          {isPurchaser ? (
                            <>
                              {item.logisticsId ? (
                                <Link
                                  to={`/logisticsAbility/logisticsBillSubmit/logisticsBillQuery/preview?id=${item.logisticsId}`}
                                >
                                  {item.logisticsOrderNo}
                                </Link>
                              ) : (
                                <a
                                  href={`https://www.kuaidi100.com/chaxun?nu=${item.logisticsOrderNo}`}
                                  target="_blank"
                                >
                                  {item.logisticsOrderNo}
                                </a>
                              )}
                            </>
                          ) : (
                            item.logisticsOrderNo
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={intl.formatMessage({
                            id: 'afterService.components.ExchangeReceivedInfo.storageNo',
                            defaultMessage: '退货入库单号',
                          })}
                        >
                          {!isPurchaser ? (
                            <Link
                              to={`/afterAbility/returnManage/returnPrAddWarehousing/warehousingDetail?id=${item.deliveryNoId}`}
                            >
                              {item.storageNo}
                            </Link>
                          ) : (
                            item.storageNo
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={intl.formatMessage({
                            id: 'afterService.components.ExchangeDeliverInfo.deliveryTime',
                            defaultMessage: '发货时间',
                          })}
                        >
                          {item.deliveryTime}
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={intl.formatMessage({
                            id: 'afterService.components.ExchangeDeliverInfo.logisticsName',
                            defaultMessage: '物流公司',
                          })}
                        >
                          {item.logisticsName}
                        </Descriptions.Item>
                        <Descriptions.Item
                          label={intl.formatMessage({
                            id: 'afterService.components.ExchangeDeliverInfo.storageTime',
                            defaultMessage: '入库时间',
                          })}
                        >
                          {item.storageTime}
                        </Descriptions.Item>
                      </Descriptions>
                    </Col>
                    <Col span={8}>
                      <Descriptions column={2}>
                        <Descriptions.Item
                          label={intl.formatMessage({
                            id: 'afterService.components.ExchangeDeliverInfo.innerStatusName',
                            defaultMessage: '内部状态',
                          })}
                        >
                          <Badge color={'#6C9CEB'} text={item.innerStatusName} />
                        </Descriptions.Item>
                        <Descriptions.Item contentStyle={{ display: 'block', textAlign: 'right' }}>
                          {isEdit &&
                            isPurchaser &&
                            item.innerStatus === MAIL_INNER_STATUS_UNCONFIRMED_DELIVER &&
                            innerStatus === RETURN_INNER_STATUS_UNCONFIRMED_RETURN_DELIVERY && (
                              <a
                                style={{
                                  textAlign: 'right',
                                  display: 'block',
                                }}
                                onClick={() => handleConfirmReturnDeliver(item)}
                              >
                                {intl.formatMessage({
                                  id: 'afterService.components.ExchangeReceivedInfo.deliver',
                                  defaultMessage: '确认退货发货',
                                })}
                              </a>
                            )}
                          {isEdit &&
                            !isPurchaser &&
                            item.innerStatus === MAIL_INNER_STATUS_CONFIRMED_DELIVER &&
                            innerStatus === RETURN_INNER_STATUS_UNCONFIRMED_RETURN_RECEIVE && (
                              <a
                                style={{
                                  textAlign: 'right',
                                  display: 'block',
                                }}
                                onClick={() => handleConfirmReturnReceive(item.deliveryId)}
                              >
                                {intl.formatMessage({
                                  id: 'afterService.components.ExchangeReceivedInfo.receive',
                                  defaultMessage: '确认退货收货',
                                })}
                              </a>
                            )}
                          {isEdit &&
                            isPurchaser &&
                            item.innerStatus === MAIL_INNER_STATUS_CONFIRMED_RECEIVING &&
                            innerStatus === RETURN_INNER_STATUS_UNCONFIRMED_RETURN_RECEIPT && (
                              <a
                                style={{
                                  textAlign: 'right',
                                  display: 'block',
                                }}
                                onClick={() => handleConfirmReturnBack(item.deliveryId)}
                              >
                                {intl.formatMessage({
                                  id: 'afterService.components.ExchangeReceivedInfo.back',
                                  defaultMessage: '确认退货回单',
                                })}
                              </a>
                            )}
                        </Descriptions.Item>
                      </Descriptions>
                    </Col>
                  </Row>
                </div>

                <PolymericTable
                  rowKey={() => Math.random().toFixed(16).slice(2, 10)}
                  dataSource={item.detailList}
                  columns={detailedColumns}
                  loading={false}
                  pagination={null}
                />
              </TabPane>
            ))}
          </Tabs>
        </>
      ) : null}

      <ReturnDeliverDrawer
        afterType={afterType}
        flowType="returnDeliver"
        value={{
          productList: currentDetailed?.detailList?.map((item) => ({
            orderNo: item.orderNo,
            productId: item.productId,
            productName: item.productName,
            category: item.category,
            brand: item.brand,
            unit: item.unit,
            applyCount: item.count,
            deliveryCount: item.deliveryCount,
            noDeliveryCount: item.count - item.deliveryCount,
            receiveCount: item.storageCount,
            subCount: item.differenceCount,
            count: item.deliveryCount,
          })),
          returnDeliverAddress: currentDetailed?.logisticsReceiveAddress,
          deliveryTime: currentDetailed?.deliveryTime,
          logisticsOrderNo: currentDetailed?.logisticsOrderNo,
          logisticsName: currentDetailed?.logisticsName,
        }}
        deliveryType={deliveryType}
        visible={visible}
        onClose={() => handleVisibleDrawer(false)}
        onSubmit={handleReturnDeliverSubmit}
        submitLoading={submitLoading}
        ediableProduct={false}
        ediableLogistics={!currentDetailed?.logisticsId}
      />
    </MellowCard>
  )
}

export default ReturnInfo
