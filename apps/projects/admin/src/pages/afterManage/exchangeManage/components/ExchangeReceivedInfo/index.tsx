/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-05 15:18:15
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-01-22 11:40:06
 * @Description: 退货收货统计、退货发货明细
 */
import React from 'react'
import { Tabs, Row, Col, Descriptions, Badge, Radio, Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { SummaryData, Detailed } from './interface'
import MellowCard from '@/components/MellowCard'
import { EditableColumns } from '@/components/PolymericTable/interface'
import PolymericTable from '@/components/PolymericTable'
import {
  MAIL_INNER_STATUS_UNCONFIRMED_DELIVER,
  MAIL_INNER_STATUS_CONFIRMED_DELIVER,
  MAIL_INNER_STATUS_CONFIRMED_RECEIVING,
} from '../../constants'
import styles from './index.less'

const { TabPane } = Tabs
const { confirm } = Modal

interface ExchangeReceivedInfoProps {
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
}

const ExchangeReceivedInfo: React.FC<ExchangeReceivedInfoProps> = ({
  summary = [],
  detailed = [],
  isPurchaser = false,
  onConfirmReturnBack,
  onConfirmReturnDeliver,
  onConfirmReturnReceive,
}) => {
  const summaryColumns: EditableColumns[] = [
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
      title: '换货数量',
      dataIndex: 'replaceCount',
      align: 'center',
    },
    {
      title: '已退货发货',
      dataIndex: 'deliveryCount',
      align: 'center',
    },
    {
      title: '未退货发货',
      dataIndex: 'unDeliveryCount',
      align: 'center',
    },
    {
      title: '已退货收货',
      dataIndex: 'receiveCount',
      align: 'center',
    },
    {
      title: '差异数量',
      dataIndex: 'differenceCount',
      align: 'center',
    },
  ]

  const detailedColumns: EditableColumns[] = [
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
      title: '换货数量',
      dataIndex: 'count',
      align: 'center',
    },
    {
      title: '退货发货数量',
      dataIndex: 'deliveryCount',
      align: 'center',
    },
    {
      title: '退货入库数量',
      dataIndex: 'storageCount',
      align: 'center',
    },
    {
      title: '差异数量',
      dataIndex: 'differenceCount',
      align: 'center',
    },
  ]

  const handleBatchChange = (value) => {}

  const handleConfirmReturnDeliver = (id) => {
    if (onConfirmReturnDeliver) {
      confirm({
        title: '提示',
        icon: <ExclamationCircleOutlined />,
        content: `是否确认退货发货？`,
        onOk() {
          return onConfirmReturnDeliver(id)
        },
      })
    }
  }

  const handleConfirmReturnReceive = (id) => {
    if (onConfirmReturnReceive) {
      confirm({
        title: '提示',
        icon: <ExclamationCircleOutlined />,
        content: `是否确认退货收货？`,
        onOk() {
          return onConfirmReturnReceive(id)
        },
      })
    }
  }

  const handleConfirmReturnBack = (id) => {
    if (onConfirmReturnBack) {
      confirm({
        title: '提示',
        icon: <ExclamationCircleOutlined />,
        content: `是否确认退货回单？`,
        onOk() {
          return onConfirmReturnBack(id)
        },
      })
    }
  }

  return (
    <MellowCard>
      <Tabs defaultActiveKey="2">
        <TabPane tab={`退货${!isPurchaser ? '收货' : '发货'}统计`} key="1">
          <PolymericTable
            rowKey={(record) => `${record.orderNo}+${record.productId}`}
            dataSource={summary}
            columns={summaryColumns}
            loading={false}
            pagination={null}
          />
        </TabPane>
        <TabPane tab={`退货${!isPurchaser ? '收货' : '发货'}明细`} key="2">
          <Radio.Group
            options={detailed.map((item) => ({
              label: `第 ${item.batch} 批次`,
              value: item.batch,
            }))}
            defaultValue={1}
            onChange={handleBatchChange}
            optionType="button"
          />

          {detailed.map((item) => (
            <div key={item.batch}>
              <div className={styles.detailedWrap}>
                <Row align="middle">
                  <Col span={16}>
                    <Descriptions>
                      <Descriptions.Item label="退货发货单号">{item.deliveryNo}</Descriptions.Item>
                      <Descriptions.Item label="物流单号">{item.logisticsOrderNo}</Descriptions.Item>
                      <Descriptions.Item label="退货入库单号">{item.storageNo}</Descriptions.Item>
                      <Descriptions.Item label="发货时间">{item.deliveryTime}</Descriptions.Item>
                      <Descriptions.Item label="物流公司">{item.logisticsName}</Descriptions.Item>
                      <Descriptions.Item label="入库时间">{item.storageTime}</Descriptions.Item>
                    </Descriptions>
                  </Col>
                  <Col span={8}>
                    <Descriptions column={2}>
                      <Descriptions.Item label="内部状态">
                        <Badge color={'#6C9CEB'} text={item.innerStatusName} />
                      </Descriptions.Item>
                      <Descriptions.Item></Descriptions.Item>
                    </Descriptions>
                  </Col>
                </Row>
              </div>

              <PolymericTable
                rowKey={(record) => `${record.orderNo}+${record.productId}`}
                dataSource={item.detailList}
                columns={detailedColumns}
                loading={false}
                pagination={null}
              />
            </div>
          ))}
        </TabPane>
      </Tabs>
    </MellowCard>
  )
}

export default ExchangeReceivedInfo
