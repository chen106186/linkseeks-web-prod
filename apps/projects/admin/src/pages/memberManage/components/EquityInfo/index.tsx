import React, { useState, useEffect } from 'react'
import { Row, Col, Tabs, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import PolymericTable from '@/components/PolymericTable'
import { EditableColumns } from '@/components/PolymericTable/interface'
import MellowCard from '@/components/MellowCard'
import styles from './index.less'
import equity_1 from '@/assets/equity-1.png'
import equity_2 from '@/assets/equity-2.png'
import equity_3 from '@/assets/equity-3.png'
import equity_4 from '@/assets/equity-4.png'
import equity_5 from '@/assets/equity-5.png'

const imgMap = {
  1: equity_1,
  2: equity_2,
  3: equity_3,
  4: equity_4,
  5: equity_5,
}

const { TabPane } = Tabs

const PAGE_SIZE = 8

export interface ReceivedData {
  id?: number
  createTime?: string
  ruleName?: string
  score?: number
  remark?: string
}

export interface UsageData {
  id?: number
  createTime?: string
  rightTypeName?: string
  spendTypeName?: string
  point?: number
  remark?: string
}

export interface FetchParams {
  current: number
  pageSize: number
}

export interface EquityInfoProps {
  equityInfo?: {
    sumReturnMoney?: number // 累计返现金额
    sumUsedPoint?: number // 已用积分
    sumPoint?: number // 累计积分
    rights?: {
      acquireWay: string
      id: number
      name: string
      paramWay: string
      parameter: string
      remark: string
      rightTypeEnum: number
      status: number
    }[]
  }

  fetchReceivedList?: (params: FetchParams) => Promise<{ data: ReceivedData[]; totalCount: number }>
  fetchUsageList?: (params: FetchParams) => Promise<{ data: UsageData[]; totalCount: number }>
}

const equityTxtMap = {
  1: '折扣',
  2: '返现',
  3: '积分',
}

const clsMap = {
  1: 'tofo-item-tag-price',
  2: 'tofo-item-tag-recurrence',
  3: 'tofo-item-tag-integral',
}

const EquityInfo: React.FC<EquityInfoProps> = ({ equityInfo = {}, fetchReceivedList, fetchUsageList }) => {
  const [receivedPage, setReceivedPage] = useState(1)
  const [receivedSize, setReceivedSize] = useState(PAGE_SIZE)
  const [receivedTotal, setReceivedTotal] = useState(0)
  const [receivedList, setReceivedList] = useState<ReceivedData[]>([])
  const [receivedListLoading, setReceivedListLoading] = useState(false)

  const [usagePage, setUsagePage] = useState(1)
  const [usageSize, setUsageSize] = useState(PAGE_SIZE)
  const [usageTotal, setUsageTotal] = useState(0)
  const [usageList, setUsageList] = useState<UsageData[]>([])
  const [usageListLoading, setUsageListLoading] = useState(false)

  const receivedColumns: EditableColumns[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: '会员权益名称',
      dataIndex: 'rightTypeName',
      align: 'center',
    },
    {
      title: '获取数量',
      dataIndex: 'point',
      align: 'center',
    },
    {
      title: '获取时间',
      dataIndex: 'createTime',
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
      ellipsis: true,
    },
  ]

  const usageColumns: EditableColumns[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: '会员权益名称',
      dataIndex: 'rightTypeName',
      align: 'center',
    },
    {
      title: '会员权益使用名称',
      dataIndex: 'spendTypeName',
      align: 'center',
    },
    {
      title: '使用数量',
      dataIndex: 'point',
      align: 'center',
    },
    {
      title: '使用时间',
      dataIndex: 'createTime',
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      align: 'center',
      ellipsis: true,
    },
  ]

  const getReceivedList = (params?) => {
    if (fetchReceivedList) {
      if (receivedListLoading) {
        return
      }
      setReceivedListLoading(true)
      fetchReceivedList({
        current: receivedPage,
        pageSize: receivedSize,
        ...params,
      })
        .then((res) => {
          const { data = [], totalCount = 0 } = res || {}
          setReceivedList(data)
          setReceivedTotal(totalCount)
        })
        .finally(() => {
          setReceivedListLoading(false)
        })
    }
  }

  const getUsageList = (params?) => {
    if (fetchUsageList) {
      if (usageListLoading) {
        return
      }
      setUsageListLoading(true)
      fetchUsageList({
        current: usagePage,
        pageSize: usageSize,
        ...params,
      })
        .then((res) => {
          const { data = [], totalCount = 0 } = res || {}
          setUsageList(data)
          setUsageTotal(totalCount)
        })
        .finally(() => {
          setUsageListLoading(false)
        })
    }
  }

  useEffect(() => {
    getReceivedList()
  }, [])

  const handleTabChange = (key) => {
    switch (key) {
      case '1':
        getReceivedList()
        break

      case '2':
        getUsageList()
        break

      default:
        break
    }
  }

  const handleReceivedPaginationChange = (page: number, size: number) => {
    setReceivedPage(page)
    setReceivedSize(size)
    getReceivedList({
      current: page,
      pageSize: size,
    })
  }

  const handleUsagePaginationChange = (page: number, size: number) => {
    setUsagePage(page)
    setUsageSize(size)
    getUsageList({
      current: page,
      pageSize: size,
    })
  }

  return (
    <div className={styles.equityInfo}>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Row gutter={24}>
            <Col span={8}>
              <div className={styles.container}>
                <div className={styles['container-title']}>当前权益</div>

                <div className={styles['container-content']}>
                  <ul className={styles.tofo}>
                    {equityInfo.rights
                      ? equityInfo.rights.map((item) => (
                          <li key={item.id} className={styles['tofo-item']}>
                            <div className={styles['tofo-item-logo']}>
                              <img src={imgMap[item.rightTypeEnum]} />
                            </div>
                            <div className={styles['tofo-item-title']}>
                              {item.name}
                              <Tooltip title={item.remark}>
                                <QuestionCircleOutlined />
                              </Tooltip>
                            </div>
                            <div className={styles['tofo-item-extra']}>
                              <span className={classNames(styles['tofo-item-tag'], styles[clsMap[item.rightTypeEnum]])}>
                                {item.parameter}% {equityTxtMap[item.rightTypeEnum] || ''}
                              </span>
                            </div>
                          </li>
                        ))
                      : null}
                  </ul>
                </div>
              </div>
            </Col>

            <Col span={8}>
              <div className={styles.container}>
                <div className={styles['container-content']}>
                  <div className={styles.exhibition}>
                    <div className={styles['exhibition-left']}>
                      <div className={styles['exhibition-title']}>累计返现金额</div>
                      <div className={styles['exhibition-amount']}>
                        {equityInfo?.sumReturnMoney}
                        <span>CNY</span>
                      </div>
                    </div>

                    <div className={styles['exhibition-right']}>
                      <div className={styles['exhibition-logo']}>
                        <img src={imgMap['4']} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>

            <Col span={8}>
              <div className={styles.container}>
                <div className={styles['container-content']}>
                  <div className={styles.exhibition}>
                    <div className={styles['exhibition-left']}>
                      <div className={styles['exhibition-title']}>已用积分/总积分</div>
                      <div className={styles['exhibition-amount']}>
                        {equityInfo?.sumUsedPoint}/{equityInfo?.sumPoint}
                      </div>
                    </div>

                    <div className={styles['exhibition-right']}>
                      <div className={styles['exhibition-logo']}>
                        <img src={imgMap['5']} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Col>

        <Col span={24}>
          <MellowCard title="活跃分获取记录">
            <Tabs onChange={handleTabChange}>
              <TabPane tab="权益获取记录" key="1">
                <PolymericTable
                  dataSource={receivedList}
                  columns={receivedColumns}
                  loading={receivedListLoading}
                  pagination={{
                    pageSize: receivedSize,
                    total: receivedTotal,
                  }}
                  onPaginationChange={handleReceivedPaginationChange}
                />
              </TabPane>
              <TabPane tab="权益使用记录" key="2">
                <PolymericTable
                  dataSource={usageList}
                  columns={usageColumns}
                  loading={usageListLoading}
                  pagination={{
                    pageSize: usageSize,
                    total: usageTotal,
                  }}
                  onPaginationChange={handleUsagePaginationChange}
                />
              </TabPane>
            </Tabs>
          </MellowCard>
        </Col>
      </Row>
    </div>
  )
}

export default EquityInfo
