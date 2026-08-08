/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-05 15:18:15
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-12 10:25:14
 * @Description: 换货发货统计、换货发货明细
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
  EXCHANGE_INNER_STATUS_UNCONFIRMED_REPLACE_DELIVERY,
  EXCHANGE_INNER_STATUS_UNCONFIRMED_REPLACE_RECEIVE,
  EXCHANGE_INNER_STATUS_UNCONFIRMED_REPLACE_RECEIPT,
} from '@/constants/afterService'
import { ORDER_TYPE_TENDER_CONTRACT } from '@/constants/order'
import {
  MAIL_INNER_STATUS_UNCONFIRMED_DELIVER,
  MAIL_INNER_STATUS_CONFIRMED_RECEIVING,
  MAIL_INNER_STATUS_CONFIRMED_DELIVER,
} from '../../constants'
import { isMaterialOrder } from '../../utils'
import ReturnDeliverDrawer, { AfterType } from '../DeliverDrawer'
import styles from './index.less'

const { confirm } = Modal
const { TabPane } = Tabs

interface ExchangeDeliverInfoProps extends MellowCardProps {
  /**
   * 换货发货统计
   */
  summary: SummaryData[]

  /**
   * 换货发货明细
   */
  detailed: Detailed[]

  /**
   * 是否是采购商
   */
  isPurchaser?: boolean

  /**
   * 确认退货回单
   */
  onConfirmExchangeBack?: (id: number) => void

  /**
   * 确认退货发货
   */
  onConfirmExchangeDeliver?: (id: number) => Promise<any>

  /**
   * 确认退货收货
   */
  onConfirmExchangeReceive?: (id: number) => Promise<any>

  /**
   * 换货申请单内部状态
   */
  innerStatus: number

  /**
   * 订单记录地址
   */
  target: string

  /**
   * 是否可操作
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

const ExchangeDeliverInfo: React.FC<ExchangeDeliverInfoProps> = ({
  summary = [],
  detailed = [],
  isPurchaser = false,
  onConfirmExchangeBack,
  onConfirmExchangeDeliver,
  onConfirmExchangeReceive,
  innerStatus,
  target,
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

  const intl = useIntl()

  const isMateriel = isMaterialOrder(orderType)

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
        id: 'afterService.components.ExchangeDeliverInfo.summaryColumns.replaceCount',
        defaultMessage: '换货数量',
      }),
      dataIndex: 'replaceCount',
    },
    {
      title: `${intl.formatMessage({
        id: 'afterService.components.ExchangeDeliverInfo.summaryColumns.deliveryCount',
        defaultMessage: '已换货发货',
      })}/${intl.formatMessage({
        id: 'afterService.components.ExchangeDeliverInfo.summaryColumns.unDeliveryCount',
        defaultMessage: '未换货发货',
      })}`,
      dataIndex: 'deliveryCount',
      render: (text, record) => (
        <DescProgress
          descriptions={[
            {
              title: `${intl.formatMessage({
                id: 'afterService.components.ExchangeDeliverInfo.summaryColumns.deliveryCount',
                defaultMessage: '已换货发货',
              })}:`,
              value: `${text}`,
            },
            {
              title: `${intl.formatMessage({
                id: 'afterService.components.ExchangeDeliverInfo.summaryColumns.unDeliveryCount',
                defaultMessage: '未换货发货',
              })}:`,
              value: `${record.unDeliveryCount}`,
            },
          ]}
          percent={(text / record.replaceCount) * 100}
        />
      ),
    },
    {
      title: intl.formatMessage({
        id: 'afterService.components.ExchangeDeliverInfo.summaryColumns.receiveCount',
        defaultMessage: '已换货收货',
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
        id: 'afterService.components.ExchangeDeliverInfo.detailedColumns.count',
        defaultMessage: '换货数量',
      }),
      dataIndex: 'count',
    },
    {
      title: intl.formatMessage({
        id: 'afterService.components.ExchangeDeliverInfo.detailedColumns.deliveryCount',
        defaultMessage: '换货发货数量',
      }),
      dataIndex: 'deliveryCount',
    },
    {
      title: intl.formatMessage({
        id: 'afterService.components.ExchangeDeliverInfo.detailedColumns.storageCount',
        defaultMessage: '换货入库数量',
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

  const handleConfirmExchangeDeliver = (record: Detailed) => {
    setCurrentDetailed(record)
    handleVisibleDrawer(true)
  }

  const handleConfirmExchangeReceive = (id) => {
    if (onConfirmExchangeReceive) {
      confirm({
        title: intl.formatMessage({
          id: 'afterService.components.ExchangeDeliverInfo.receive.tip',
          defaultMessage: '提示',
        }),
        icon: <ExclamationCircleOutlined />,
        content: intl.formatMessage({
          id: 'afterService.components.ExchangeDeliverInfo.receive.content',
          defaultMessage: '是否确认换货收货？',
        }),
        onOk() {
          return onConfirmExchangeReceive(id)
        },
      })
    }
  }

  const handleConfirmExchangeBack = (id) => {
    if (onConfirmExchangeBack) {
      onConfirmExchangeBack(id)
    }
  }

  const handleRadioChange = (value: '1' | '2') => {
    setRadioValue(value)
  }

  const handleReturnDeliverSubmit = () => {
    if (onConfirmExchangeDeliver) {
      setSubmitLoading(true)
      onConfirmExchangeDeliver(currentDetailed.deliveryId).finally(() => {
        setSubmitLoading(false)
      })
    }
  }

  const options = [
    {
      label: !isPurchaser
        ? intl.formatMessage({
            id: 'afterService.components.ExchangeDeliverInfo.summary.label1',
            defaultMessage: '换货发货统计',
          })
        : intl.formatMessage({
            id: 'afterService.components.ExchangeDeliverInfo.summary.label2',
            defaultMessage: '换货收货统计',
          }),
      value: '1',
    },
    {
      label: !isPurchaser
        ? intl.formatMessage({
            id: 'afterService.components.ExchangeDeliverInfo.detailed.label1',
            defaultMessage: '换货发货明细',
          })
        : intl.formatMessage({
            id: 'afterService.components.ExchangeDeliverInfo.detailed.label2',
            defaultMessage: '换货收货明细',
          }),
      value: '2',
    },
  ]

  return (
    <MellowCard
      title={intl.formatMessage({
        id: 'afterService.components.ExchangeDeliverInfo.title',
        defaultMessage: '换货收货信息',
      })}
      extra={<ButtonSwitch options={options} onChange={handleRadioChange} value={radioValue} />}
      bodyStyle={{
        paddingTop: 0,
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
                            id: 'afterService.components.ExchangeDeliverInfo.deliveryNo',
                            defaultMessage: '换货发货单号',
                          })}
                        >
                          {!isPurchaser ? (
                            <Link
                              to={`/afterAbility/exchangeManage/exchangePrAddDeliver/deliverDetail?id=${item.deliveryNoId}`}
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
                          {!isPurchaser ? (
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
                            id: 'afterService.components.ExchangeDeliverInfo.storageNo',
                            defaultMessage: '换货入库单号',
                          })}
                        >
                          {isPurchaser ? (
                            <Link
                              to={`/afterAbility/exchangeApplication/exchangePrAddWarehousing/warehousingDetail?id=${item.storageId}`}
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
                            !isPurchaser &&
                            item.innerStatus === MAIL_INNER_STATUS_UNCONFIRMED_DELIVER &&
                            innerStatus === EXCHANGE_INNER_STATUS_UNCONFIRMED_REPLACE_DELIVERY && (
                              <a
                                style={{
                                  textAlign: 'right',
                                  display: 'block',
                                }}
                                onClick={() => handleConfirmExchangeDeliver(item)}
                              >
                                {intl.formatMessage({
                                  id: 'afterService.components.ExchangeDeliverInfo.deliver',
                                  defaultMessage: '确认换货发货',
                                })}
                              </a>
                            )}
                          {isEdit &&
                            isPurchaser &&
                            item.innerStatus === MAIL_INNER_STATUS_CONFIRMED_DELIVER &&
                            innerStatus === EXCHANGE_INNER_STATUS_UNCONFIRMED_REPLACE_RECEIVE && (
                              <a
                                style={{
                                  textAlign: 'right',
                                  display: 'block',
                                }}
                                onClick={() => handleConfirmExchangeReceive(item.deliveryId)}
                              >
                                {intl.formatMessage({
                                  id: 'afterService.components.ExchangeDeliverInfo.receive',
                                  defaultMessage: '确认换货收货',
                                })}
                              </a>
                            )}
                          {isEdit &&
                            !isPurchaser &&
                            item.innerStatus === MAIL_INNER_STATUS_CONFIRMED_RECEIVING &&
                            innerStatus === EXCHANGE_INNER_STATUS_UNCONFIRMED_REPLACE_RECEIPT && (
                              <a
                                style={{
                                  textAlign: 'right',
                                  display: 'block',
                                }}
                                onClick={() => handleConfirmExchangeBack(item.deliveryId)}
                              >
                                {intl.formatMessage({
                                  id: 'afterService.components.ExchangeDeliverInfo.back',
                                  defaultMessage: '确认换货回单',
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
        flowType="exchangeDeliver"
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
          returnDeliverAddress: currentDetailed?.logisticsReceiveAddress || '',
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

export default ExchangeDeliverInfo
