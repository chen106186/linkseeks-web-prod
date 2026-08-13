import React, { useEffect, useState } from 'react'
import { Drawer, Empty, Select, Spin, Timeline, Typography, message } from 'antd'
import { formatTimeString } from '@/utils'
import { postOrderPlatformManageLogisticsDetail } from '../../services/platform'
import style from './index.less'

const { Text } = Typography

export interface PlatformLogisticsModalProps {
  visible: boolean
  orderNo: string
  batchNo?: number
  batches?: number[]
  onClose: () => void
}

const PlatformLogisticsModal: React.FC<PlatformLogisticsModalProps> = ({
  visible,
  orderNo,
  batchNo,
  batches = [],
  onClose,
}) => {
  const [loading, setLoading] = useState(false)
  const [currentBatchNo, setCurrentBatchNo] = useState<number | undefined>(batchNo)
  const [detail, setDetail] = useState<any>(null)

  useEffect(() => {
    setCurrentBatchNo(batchNo)
  }, [batchNo, visible])

  useEffect(() => {
    if (visible && orderNo) {
      fetchDetail(currentBatchNo)
    }
  }, [visible, orderNo, currentBatchNo])

  const fetchDetail = async (targetBatchNo?: number) => {
    try {
      setLoading(true)
      const { code, data, message: msg } = await postOrderPlatformManageLogisticsDetail({
        orderNo,
        ...(targetBatchNo ? { batchNo: targetBatchNo } : {}),
      })
      if (code === 1000) {
        setDetail(data)
      } else {
        setDetail(null)
        message.error(msg || '获取物流信息失败')
      }
    } catch (error) {
      setDetail(null)
      message.error('获取物流信息失败')
    } finally {
      setLoading(false)
    }
  }

  const trackingDetail = detail?.trackingDetail
  const events = trackingDetail?.events || []

  return (
    <Drawer title={`查看物流${orderNo ? `：${orderNo}` : ''}`} width={720} open={visible} onClose={onClose} destroyOnClose>
      {batches.length > 0 ? (
        <div style={{ marginBottom: 16 }}>
          <Text style={{ marginRight: 8 }}>发货批次</Text>
          <Select
            allowClear
            placeholder="默认查看最新批次"
            value={currentBatchNo}
            style={{ width: 220 }}
            onChange={(value) => setCurrentBatchNo(value)}
            options={batches.map((item) => ({
              label: `第${item}批次`,
              value: item,
            }))}
          />
        </div>
      ) : null}

      <Spin spinning={loading}>
        {detail ? (
          <>
            <div className={style.baseInfo}>
              <div className={style.infoItem}>订单号：{detail.orderNo || '-'}</div>
              <div className={style.infoItem}>发货批次：{detail.batchNo ? `第${detail.batchNo}批次` : '-'}</div>
              <div className={style.infoItem}>发货单号：{detail.deliveryNo || '-'}</div>
              <div className={style.infoItem}>物流单号：{detail.logisticsNo || trackingDetail?.mailNo || '-'}</div>
              <div className={style.infoItem}>物流公司：{detail.company || trackingDetail?.expressCompanyName || '-'}</div>
              <div className={style.infoItem}>
                最后更新时间：{trackingDetail?.lastEventTime ? formatTimeString(trackingDetail.lastEventTime) : '-'}
              </div>
            </div>

            {events.length > 0 ? (
              <div className={style.timelineWrap}>
                <Timeline
                  items={events.map((item) => ({
                    color: 'green',
                    children: (
                      <div>
                        <div>{item.context || item.status || '-'}</div>
                        <Text type="secondary">
                          {[formatTimeString(item.eventTime), item.location].filter(Boolean).join('  ')}
                        </Text>
                      </div>
                    ),
                  }))}
                />
              </div>
            ) : (
              <div className={style.emptyBlock}>
                <Empty description="暂未获取到物流轨迹，可能还在订阅中" />
              </div>
            )}
          </>
        ) : (
          <div className={style.emptyBlock}>
            <Empty description="暂无物流信息" />
          </div>
        )}
      </Spin>
    </Drawer>
  )
}

export default PlatformLogisticsModal
