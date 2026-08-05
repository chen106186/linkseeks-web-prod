/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-05 15:18:15
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-11 17:43:06
 * @Description: 退货收货统计、退货发货明细
 */
import React, { useState } from 'react'
import { Tabs, Row, Col, Descriptions, Badge, Radio, Modal, RadioChangeEvent } from 'antd'
import { ReturnStatisticsListItem, ReturnDeliveryGoodsListItem } from './interface'
import MellowCard from '@/components/MellowCard'
import { EditableColumns } from '@/components/PolymericTable/interface'
import PolymericTable from '@/components/PolymericTable'
import styles from './index.less'

const { TabPane } = Tabs
const { confirm } = Modal
interface ReturnInfoProps {
  /**
   * 退货收货统计
   */
  summary: ReturnStatisticsListItem[]

  /**
   * 退货发货明细
   */
  detailed: ReturnDeliveryGoodsListItem[]

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

const ReturnInfo: React.FC<ReturnInfoProps> = ({ summary = [], detailed = [], isPurchaser = false }) => {
  const [currentBatch, setCurrentBatch] = useState(1)

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
      title: '退货数量',
      dataIndex: 'returnCount',
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
      title: '退货数量',
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

  const handleBatchChange = (e: RadioChangeEvent) => {
    setCurrentBatch(e.target.value)
  }

  return (
    <MellowCard>
      <Tabs defaultActiveKey="2">
        <TabPane tab={`退货${!isPurchaser ? '收货' : '发货'}统计`} key="1">
          <PolymericTable rowKey="id" dataSource={summary} columns={summaryColumns} loading={false} pagination={null} />
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
            <div
              key={item.batch}
              style={{
                display: item.batch === currentBatch ? 'block' : 'none',
              }}
            >
              <div className={styles.detailedWrap}>
                <Row align="middle">
                  <Col span={16}>
                    <Descriptions>
                      <Descriptions.Item label="退货发货单号">
                        <a>{item.deliveryNo}</a>
                      </Descriptions.Item>
                      <Descriptions.Item label="物流单号">
                        <a>{item.logisticsOrderNo}</a>
                      </Descriptions.Item>
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

export default ReturnInfo
