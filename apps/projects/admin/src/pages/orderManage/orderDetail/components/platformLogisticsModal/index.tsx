import React, { useEffect, useMemo, useState } from 'react'
import { Drawer, Empty, Select, Timeline, Typography, message } from 'antd'
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { formatTimeString } from '@/utils'
import { postOrderPlatformManageLogisticsDetail } from '../../services/platform'
import AmapTrack from './AmapTrack'
import style from './index.less'

const { Text } = Typography

const TRACK_STATUS_MAP: Record<string, string> = {
  '0': '运输中',
  '1': '已揽收',
  '2': '疑难件',
  '3': '已签收',
  '4': '已退签',
  '5': '派件中',
}

export interface PlatformLogisticsModalProps {
  visible: boolean
  orderNo: string
  batchNo?: number
  batchOptions?: number[]
  onClose: () => void
}

const PlatformLogisticsModal: React.FC<PlatformLogisticsModalProps> = ({
  visible,
  orderNo,
  batchNo,
  batchOptions = [],
  onClose,
}) => {
  const [currentBatchNo, setCurrentBatchNo] = useState<number | undefined>(batchNo)
  const [detail, setDetail] = useState<any>(null)
  const [routeExpanded, setRouteExpanded] = useState(false)

  const options = useMemo(
    () =>
      (batchOptions || []).map((item) => ({
        label: `第${item}批次`,
        value: item,
      })),
    [batchOptions],
  )

  useEffect(() => {
    if (visible) {
      setCurrentBatchNo(batchNo)
      setRouteExpanded(false)
    }
  }, [visible, batchNo])

  useEffect(() => {
    if (visible && orderNo) {
      loadData()
    }
  }, [visible, orderNo, currentBatchNo])

  const loadData = async () => {
    try {
      const { code, data } = await postOrderPlatformManageLogisticsDetail({
        orderNo,
        ...(currentBatchNo ? { batchNo: currentBatchNo } : {}),
      })
      if (code === 1000) {
        setDetail(data)
      }
    } catch (error) {
      message.error('获取物流信息失败')
    }
  }

  const events = detail?.trackingDetail?.events || []
  const latestEvent = events[0]

  return (
    <Drawer title="查看物流" width={760} open={visible} onClose={onClose} destroyOnClose>
      {options.length > 0 ? (
        <div style={{ marginBottom: 16 }}>
          <Text style={{ marginRight: 8 }}>发货批次</Text>
          <Select
            allowClear
            style={{ width: 200 }}
            value={currentBatchNo}
            options={options}
            onChange={setCurrentBatchNo}
          />
        </div>
      ) : null}

      {detail ? (
        <>
          <div className={style.summary}>
            <div className={style.summaryItem}>订单号：{detail.orderNo || '-'}</div>
            <div className={style.summaryItem}>发货批次：{detail.batchNo ? `第${detail.batchNo}批次` : '-'}</div>
            <div className={style.summaryItem}>发货单号：{detail.deliveryNo || '-'}</div>
            <div className={style.summaryItem}>
              物流单号：{detail.logisticsNo || detail.trackingDetail?.mailNo || '-'}
            </div>
            <div className={style.summaryItem}>
              物流公司：{detail.company || detail.trackingDetail?.expressCompanyName || '-'}
            </div>
            <div className={style.summaryItem}>
              最后更新时间：
              {detail.trackingDetail?.lastEventTime ? formatTimeString(detail.trackingDetail.lastEventTime) : '-'}
            </div>
          </div>

          <AmapTrack events={events} />

          {events.length > 0 ? (
            <div className={style.routeSection}>
              <div className={style.routeHeader} onClick={() => setRouteExpanded(!routeExpanded)}>
                <div className={style.routeLatest}>
                  {latestEvent && (
                    <>
                      <span className={style.routeStatus}>
                        {TRACK_STATUS_MAP[latestEvent.opCode || ''] || '运输中'}
                      </span>
                      <span className={style.routeDesc}>{latestEvent.acceptStation || latestEvent.remark || '-'}</span>
                    </>
                  )}
                </div>
                <span className={style.routeToggle}>
                  {routeExpanded ? '收起' : '展开'}
                  {routeExpanded ? (
                    <UpOutlined style={{ marginLeft: 4 }} />
                  ) : (
                    <DownOutlined style={{ marginLeft: 4 }} />
                  )}
                </span>
              </div>

              {routeExpanded && (
                <div className={style.timelineWrap}>
                  <Timeline
                    items={events.map((item: any, idx: number) => ({
                      color: idx === 0 ? '#1677ff' : '#d9d9d9',
                      children: (
                        <div>
                          <div className={idx === 0 ? style.timelineTextActive : undefined}>
                            {item.acceptStation || item.remark || TRACK_STATUS_MAP[item.opCode || ''] || '-'}
                          </div>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {[
                              item.acceptTime ? formatTimeString(item.acceptTime) : '',
                              TRACK_STATUS_MAP[item.opCode || ''],
                            ]
                              .filter(Boolean)
                              .join('  ')}
                          </Text>
                        </div>
                      ),
                    }))}
                  />
                </div>
              )}
            </div>
          ) : (
            <Empty description="暂未获取到物流轨迹" />
          )}
        </>
      ) : (
        <Empty description="暂无物流信息" />
      )}
    </Drawer>
  )
}

export default PlatformLogisticsModal
