import React, { useEffect, useMemo, useState } from 'react'
import { Drawer, Empty, Select, Spin, Typography, message } from 'antd'
import { UpOutlined } from '@ant-design/icons'
import { formatTimeString } from '@/utils'
import { postOrderVendorLogisticsDetail } from '../../services/platform'
import style from './index.less'

const { Text } = Typography

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
  const [loading, setLoading] = useState(false)

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
    }
  }, [visible, batchNo])

  useEffect(() => {
    if (visible && orderNo) {
      loadData()
    }
  }, [visible, orderNo, currentBatchNo])

  const loadData = async () => {
    setLoading(true)
    try {
      const { code, data } = await postOrderVendorLogisticsDetail({
        orderNo,
        ...(currentBatchNo ? { batchNo: currentBatchNo } : {}),
      })
      if (code === 1000) {
        setDetail(data)
      }
    } catch (error) {
      message.error('获取物流信息失败')
    } finally {
      setLoading(false)
    }
  }

  const events = detail?.trackingDetail?.events || []
  const subscribeStatus = Number(detail?.trackingDetail?.subscribeStatus)
  const latestDotClass =
    subscribeStatus === 2
      ? style.timelineEndpointSuccess
      : subscribeStatus === 3
      ? style.timelineEndpointError
      : style.timelineEndpointProcessing
  const latestStatusText = subscribeStatus === 2 ? '已签收' : subscribeStatus === 3 ? '订阅失败' : '运输中'

  return (
    <Drawer
      title="查看物流"
      width={760}
      open={visible}
      onClose={onClose}
      destroyOnClose
      bodyStyle={{ display: 'flex', flexDirection: 'column' }}
    >
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

      <Spin className={style.loadingWrap} spinning={loading}>
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

            {events.length > 0 ? (
              <div className={style.routeSection}>
                <div className={style.routeHeader}>
                  <span className={style.routeTitle}>物流轨迹</span>
                </div>

                <div className={style.timelineWrap}>
                  <div className={style.timelineList}>
                    {events.map((item: any, idx: number) => {
                      const isLatest = idx === 0
                      const isStart = idx === events.length - 1
                      return (
                        <div className={style.timelineItem} key={`${item.acceptTime || ''}-${idx}`}>
                          <div className={style.timelineTime}>
                            <div>{item.acceptTime ? formatTimeString(item.acceptTime, 'YYYY-MM-DD') : '-'}</div>
                            <div>{item.acceptTime ? formatTimeString(item.acceptTime, 'HH:mm:ss') : ''}</div>
                          </div>
                          <div className={style.timelineMarker}>
                            {!isStart ? <span className={style.timelineLine} /> : null}
                            {isLatest || isStart ? (
                              <span
                                aria-label={isLatest ? latestStatusText : '起始节点'}
                                className={`${style.timelineEndpoint} ${
                                  isLatest ? latestDotClass : style.timelineEndpointStart
                                }`}
                                title={isLatest ? latestStatusText : '起始节点'}
                              />
                            ) : (
                              <span className={style.timelineDot}>
                                <UpOutlined />
                              </span>
                            )}
                          </div>
                          <div className={`${style.timelineText} ${isLatest ? style.timelineTextActive : ''}`}>
                            {item.acceptStation || item.remark || '-'}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <Empty description="暂未获取到物流轨迹" />
            )}
          </>
        ) : loading ? null : (
          <Empty description="暂无物流信息" />
        )}
      </Spin>
    </Drawer>
  )
}

export default PlatformLogisticsModal
