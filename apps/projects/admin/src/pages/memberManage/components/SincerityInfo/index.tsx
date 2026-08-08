import React, { useState, useEffect } from 'react'
import { Row, Col, Tabs, Card, Tooltip, Radio, Button, Spin } from 'antd'
import { QuestionCircleOutlined, SmileFilled, MehFilled, FrownFilled } from '@ant-design/icons'
import { isJSONStr } from '@/utils'
import PolymericTable from '@/components/PolymericTable'
import { EditableColumns } from '@/components/PolymericTable/interface'
import { Pie } from '@/components/Charts'
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

interface ContentBoxProps {
  title?: string
  desc?: string
  content?: React.ReactNode
  extra?: React.ReactNode
}

const ContentBox: React.FC<ContentBoxProps> = ({ title = '我是标题', content, extra, desc }) => (
  <div className={styles.contentBox}>
    <div className={styles['contentBox-main']}>
      <div className={styles.title}>
        {title}
        <Tooltip title={desc}>
          <QuestionCircleOutlined />
        </Tooltip>
      </div>
      <div className={styles.txt}>{content}</div>
    </div>
    <div className={styles['contentBox-extra']}>{extra}</div>
  </div>
)

interface MoodProps {
  type: 'smile' | 'notBad' | 'sad'
}

const Mood: React.FC<MoodProps> = ({ type = 'smile' }) => {
  let node: any = null

  switch (type) {
    case 'smile':
      node = (
        <>
          <SmileFilled style={{ color: '#41CC9E', marginRight: 4 }} /> 好评
        </>
      )
      break

    case 'notBad':
      node = (
        <>
          <MehFilled style={{ color: '#FFC400', marginRight: 4 }} /> 中评
        </>
      )
      break

    case 'sad':
      node = (
        <>
          <FrownFilled style={{ color: '#EF6260', marginRight: 4 }} /> 差评
        </>
      )
      break

    default:
      break
  }

  return node
}

const PAGE_SIZE = 5

export interface BasicInfo {
  pieData: {
    x: string
    y: number
  }[]
  items: {
    id: number
    creditTypeName: string
    remark: string
    creditPoint: number
    currentPoint: number
  }[]
  loading?: boolean
}

export interface EstimateSumItems {
  id?: number
  title?: JSX.Element
  star?: number
  last7days?: number
  last30days?: number
  last180days?: number
  before180days?: number
  sum?: number
}

export interface EstimateSum {
  dataSource: EstimateSumItems[]
  loading?: boolean
}

export interface ComplaintSum {
  dataSource: EstimateSumItems
  loading?: boolean
}

export interface FetchParams {
  current: number
  pageSize: number
}

export interface SalesProps {
  id?: number
  createTime?: string
  star?: number
  comment?: string
  product?: string
  byMemberName?: string
  remark?: string
}

export interface ComplaintProps {
  id?: number
  createTime?: string
  content?: string
  reason?: string
  byMemberName?: string
  remark?: string
}

interface SincerityInfoProps {
  basicInfo?: BasicInfo
  salesEstimateSum?: EstimateSum
  fetchSalesList?: (params: FetchParams) => Promise<{ data: SalesProps[]; totalCount: number }>
  afterEstimateSum?: EstimateSum
  fetchAfterList?: (params: FetchParams) => Promise<{ data: SalesProps[]; totalCount: number }>
  complaintSum?: ComplaintSum
  fetchComplaintList?: (params: FetchParams) => Promise<{ data: ComplaintProps[]; totalCount: number }>
}

const SincerityInfo: React.FC<SincerityInfoProps> = ({
  basicInfo = {},
  salesEstimateSum = {},
  fetchSalesList,
  afterEstimateSum = {},
  fetchAfterList,
  complaintSum = {},
  fetchComplaintList,
}) => {
  const creditData = basicInfo.pieData || []
  const integralItems = basicInfo.items || []
  const { dataSource: complaintSumData } = complaintSum

  const [salesEvaluate, setSalesEvaluate] = useState<EstimateSumItems[]>([])
  const [salesEvaluatePie, setSalesEvaluatePie] = useState<{ x: string; y: number }[]>([])
  const [afterEvaluate, setAfterEvaluate] = useState<EstimateSumItems[]>([])
  const [afterEvaluatePie, setAfterEvaluatePie] = useState<{ x: string; y: number }[]>([])
  const [salesTabKey, setSalesTabKey] = useState('evaluateSum')
  const [afterTabKey, setAfterTabKey] = useState('evaluateSum')

  const [salesPage, setSalesPage] = useState(1)
  const [salesSize, setSalesSize] = useState(PAGE_SIZE)
  const [salesTotal, setSalesTotal] = useState(0)
  const [salesList, setSalesList] = useState<any[]>([])
  const [salesListLoading, setSalesListLoading] = useState(false)

  const [afterPage, setAfterPage] = useState(1)
  const [afterSize, setAfterSize] = useState(PAGE_SIZE)
  const [afterTotal, setAfterTotal] = useState(0)
  const [afterList, setAfterList] = useState<any>([])
  const [afterListLoading, setAfterListLoading] = useState(false)

  const [complainPage, setComplainPage] = useState(1)
  const [complainSize, setComplainSize] = useState(PAGE_SIZE)
  const [complainTotal, setComplainTotal] = useState(0)
  const [complainList, setComplainList] = useState<any[]>([])
  const [complainListLoading, setComplainListLoading] = useState(false)

  const exchangeMood = (star: number): React.ReactNode => {
    let node: any = null
    switch (star) {
      case 1:
      case 2: {
        node = (
          <>
            <Mood type="sad" />
            <span>差评</span>
          </>
        )
        break
      }

      case 3: {
        node = (
          <>
            <Mood type="notBad" />
            <span>中评</span>
          </>
        )
        break
      }

      case 4:
      case 5: {
        node = (
          <>
            <Mood type="smile" />
            <span>好评</span>
          </>
        )
        break
      }

      default:
        break
    }
    return node
  }

  const recordColumns: EditableColumns[] = [
    {
      title: '投诉单号',
      dataIndex: 'remark',
    },
    {
      title: '摘要',
      dataIndex: 'content',
      ellipsis: true,
    },
    {
      title: '投诉方',
      dataIndex: 'byMemberName',
    },
    {
      title: '投诉原因',
      dataIndex: 'reason',
      ellipsis: true,
    },
    {
      title: '交易单据时间',
      dataIndex: 'createTime',
      align: 'center',
      ellipsis: true,
    },
  ]

  const evaluateColumns: EditableColumns[] = [
    {
      title: ' ',
      dataIndex: 'title',
      align: 'center',
    },
    {
      title: '最近7天',
      dataIndex: 'last7days',
      align: 'center',
    },
    {
      title: '最近30天',
      dataIndex: 'last30days',
      align: 'center',
    },
    {
      title: '最近180天',
      dataIndex: 'last180days',
      align: 'center',
    },
    {
      title: '180天前',
      dataIndex: 'before180days',
      align: 'center',
    },
  ]

  const afeterEvaluateRecordColumns: EditableColumns[] = [
    {
      title: '评论',
      dataIndex: 'star',
      align: 'center',
      render: (text) => exchangeMood(text),
    },
    {
      title: '评价内容',
      dataIndex: 'comment',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '交易商品',
      dataIndex: 'product',
      align: 'center',
      ellipsis: true,
      render: (text) => {
        const product = isJSONStr(text) || {}
        return product.productName || ''
      },
    },
    {
      title: '评价方',
      dataIndex: 'byMemberName',
      align: 'center',
    },
    {
      title: '交易时间',
      dataIndex: 'createTime',
      align: 'center',
    },
    {
      title: '订单号',
      dataIndex: 'remark',
      align: 'center',
    },
  ]

  const evaluateRecordColumns: EditableColumns[] = [
    {
      title: '评论',
      dataIndex: 'star',
      align: 'center',
      render: (text) => exchangeMood(text),
    },
    {
      title: '评价内容',
      dataIndex: 'comment',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '交易商品',
      dataIndex: 'product',
      align: 'center',
      ellipsis: true,
    },
    {
      title: '评价方',
      dataIndex: 'byMemberName',
      align: 'center',
    },
    {
      title: '交易时间',
      dataIndex: 'createTime',
      align: 'center',
    },
    {
      title: '订单号',
      dataIndex: 'orderNo',
      align: 'center',
    },
  ]

  const summaryEvaluate = (items: EstimateSumItems[]): EstimateSumItems[] => {
    // 顺序写死的 1：表示好评，2：表示中评，3：表示差评
    // 根据 1、2星级为差评，3星级为中评，4、5星级为好评往里边塞数据
    const source = items || []
    const ret = [
      {
        id: 1,
        title: <Mood type="smile" />,
      },
      {
        id: 2,
        title: <Mood type="notBad" />,
      },
      {
        id: 3,
        title: <Mood type="sad" />,
      },
    ]

    for (let i = 0; i < source.length; i++) {
      const item = source[i]
      const { star, ...rest } = item
      let target: any = null

      switch (item.star) {
        case 1:
        case 2: {
          target = ret[2]
          break
        }

        case 3: {
          target = ret[1]
          break
        }

        case 4:
        case 5: {
          target = ret[0]
          break
        }

        default:
          break
      }

      if (!target) {
        continue
      }

      // 大于 2 表示已经添加过一次数据，之后就累加上去，否则直接赋值
      if (Object.keys(target).length <= 2) {
        target = Object.assign(target, rest)
      } else {
        for (const key in target) {
          if (!Object.prototype.hasOwnProperty.call(target, key)) {
            continue
          }
          // 排除 id、title 固定的 key
          if (key !== 'id' && key !== 'title') {
            target[key] += item[key]
          }
        }
      }
    }

    return ret
  }

  // 取得评价统计 Pie 饼图数据
  const getSummaryEvaluatePie = (data: EstimateSumItems[]) => {
    const source = data || []
    const count = source.reduce((pre, now) => (now.sum || 0) + pre, 0)
    const good = source[0] && source[0].sum ? source[0].sum : 0
    const notBad = source[1] && source[1].sum ? source[1].sum : 0
    const bad = source[2] && source[2].sum ? source[2].sum : 0

    const ret = [
      {
        x: `好评  ${count > 0 ? ((good / count) * 100).toFixed(2) : '0'}%`,
        y: good,
      },
      {
        x: `中评  ${count > 0 ? ((notBad / count) * 100).toFixed(2) : 0}%`,
        y: notBad,
      },
      {
        x: `差评  ${count > 0 ? ((bad / count) * 100).toFixed(2) : 0}%`,
        y: bad,
      },
    ]

    return ret
  }

  // 获取交易评价记录列表
  const getSalesRecordList = (extraParams: { [key: string]: any } = {}) => {
    if (fetchSalesList) {
      setSalesListLoading(true)
      fetchSalesList({
        current: salesPage,
        pageSize: salesSize,
        ...extraParams,
      })
        .then((res) => {
          const { data = [], totalCount = 0 } = res || {}
          setSalesList(data)
          setSalesTotal(totalCount)
        })
        .finally(() => {
          setSalesListLoading(false)
        })
    }
  }

  // 获取售后评价记录列表
  const getAfterRecordList = (extraParams: { [key: string]: any } = {}) => {
    if (fetchAfterList) {
      setAfterListLoading(true)
      fetchAfterList({
        current: afterPage,
        pageSize: afterSize,
        ...extraParams,
      })
        .then((res) => {
          const { data = [], totalCount = 0 } = res || {}
          setAfterList(data)
          setAfterTotal(totalCount)
        })
        .finally(() => {
          setAfterListLoading(false)
        })
    }
  }

  // 获取投诉评价记录列表
  const getComplaintList = () => {
    if (fetchComplaintList) {
      setComplainListLoading(true)
      fetchComplaintList({
        current: complainPage,
        pageSize: complainSize,
      })
        .then((res) => {
          const { data = [], totalCount = 0 } = res || {}
          setComplainList(data)
          setComplainTotal(totalCount)
        })
        .finally(() => {
          setComplainListLoading(false)
        })
    }
  }

  useEffect(() => {
    getComplaintList()
  }, [])

  // 监听交易评价数据改变，组合所需数据
  useEffect(() => {
    const evaluate = salesEstimateSum && salesEstimateSum.dataSource ? summaryEvaluate(salesEstimateSum.dataSource) : []
    const evaluatePie = getSummaryEvaluatePie(evaluate)

    setSalesEvaluate(evaluate)
    setSalesEvaluatePie(evaluatePie)
  }, [salesEstimateSum.dataSource])

  // 监听售后评价数据改变，组合所需数据
  useEffect(() => {
    const evaluate = afterEstimateSum && afterEstimateSum.dataSource ? summaryEvaluate(afterEstimateSum.dataSource) : []
    const evaluatePie = getSummaryEvaluatePie(evaluate)

    setAfterEvaluate(evaluate)
    setAfterEvaluatePie(evaluatePie)
  }, [afterEstimateSum.dataSource])

  const handleSalesTabChange = (key) => {
    if (key === 'evaluateRecord') {
      getSalesRecordList()
    }
    setSalesTabKey(key)
  }

  const handleAfterTabChange = (key) => {
    if (key === 'evaluateRecord') {
      getAfterRecordList()
    }
    setAfterTabKey(key)
  }

  const handleSalesPaginationChange = (page: number, size: number) => {
    setSalesPage(page)
    setSalesSize(size)
    getSalesRecordList()
  }

  const handleAfterPaginationChange = (page: number, size: number) => {
    setAfterPage(page)
    setAfterSize(size)
    getAfterRecordList()
  }

  const handleComplainPaginationChange = (page: number, size: number) => {
    setComplainPage(page)
    setComplainSize(size)
    getComplaintList()
  }

  const handleSalesRadioChange = (value) => {
    setSalesPage(1)
    getSalesRecordList({
      starLevel: value,
    })
  }

  const handleAfterRadioChange = (value) => {
    setAfterPage(1)
    getAfterRecordList({
      starLevel: value,
    })
  }

  return (
    <div className={styles.sincerityInfo}>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <Spin spinning={Boolean(basicInfo.loading)}>
            <Row gutter={24}>
              <Col flex="386px">
                <MellowCard title="信用积分" fullHeight>
                  <Pie
                    hasLegend
                    subTitle="信用积分"
                    total={() => creditData.reduce((pre, now) => now.y + pre, 0)}
                    data={creditData}
                    height={178}
                    colors={['#6C9CEB', '#8777D9', '#FFC400', '#41CC9E']}
                  />
                </MellowCard>
              </Col>

              {basicInfo.loading === false && (
                <Col flex="1">
                  <div className={styles.tofo}>
                    <MellowCard fullHeight>
                      {integralItems.map((item, index) => (
                        <Card.Grid key={item.id} className={styles['tofo-item']}>
                          <ContentBox
                            title={item.creditTypeName}
                            desc={`${item.remark}（${item.creditPoint}）`}
                            content={item.currentPoint}
                            extra={<img className={styles['tofo-item-logo']} src={imgMap[index + 1]} />}
                          />
                        </Card.Grid>
                      ))}
                    </MellowCard>
                  </div>
                </Col>
              )}
            </Row>
          </Spin>
        </Col>

        <Col span={24}>
          <MellowCard>
            <Tabs
              className={styles['record-tabs']}
              activeKey={salesTabKey}
              onChange={handleSalesTabChange}
              tabBarExtraContent={
                salesTabKey === 'evaluateRecord' ? (
                  <>
                    <Button type="text" onClick={() => handleSalesRadioChange(3)}>
                      好评
                    </Button>
                    <Button type="text" onClick={() => handleSalesRadioChange(2)}>
                      中评
                    </Button>
                    <Button type="text" onClick={() => handleSalesRadioChange(1)}>
                      差评
                    </Button>
                    <Button type="text" onClick={() => handleSalesRadioChange(0)}>
                      全部
                    </Button>
                  </>
                ) : null
              }
            >
              <TabPane tab="交易评价统计" key="evaluateSum">
                <Spin spinning={Boolean(salesEstimateSum.loading)}>
                  <Row gutter={24}>
                    <Col span={8}>
                      <Pie
                        hasLegend
                        subTitle="累计评价"
                        total={() => salesEvaluatePie.reduce((pre, now) => now.y + pre, 0)}
                        data={salesEvaluatePie}
                        height={178}
                        colProps={{
                          span: 8,
                        }}
                        colors={['#41CC9E', '#FFC400', '#EF6260']}
                      />
                    </Col>

                    <Col span={16}>
                      <PolymericTable
                        dataSource={salesEvaluate}
                        columns={evaluateColumns}
                        loading={false}
                        pagination={null}
                        rowClassName={() => styles['record-row']}
                      />
                    </Col>
                  </Row>
                </Spin>
              </TabPane>

              <TabPane tab="交易评价记录" key="evaluateRecord">
                <PolymericTable
                  rowKey="remark"
                  dataSource={salesList}
                  columns={evaluateRecordColumns}
                  loading={salesListLoading}
                  pagination={{
                    pageSize: salesSize,
                    total: salesTotal,
                  }}
                  onPaginationChange={handleSalesPaginationChange}
                />
              </TabPane>
            </Tabs>
          </MellowCard>
        </Col>

        <Col span={24}>
          <MellowCard>
            <Tabs
              className={styles['record-tabs']}
              activeKey={afterTabKey}
              onChange={handleAfterTabChange}
              tabBarExtraContent={
                afterTabKey === 'evaluateRecord' ? (
                  <>
                    <Button type="text" onClick={() => handleAfterRadioChange(3)}>
                      好评
                    </Button>
                    <Button type="text" onClick={() => handleAfterRadioChange(2)}>
                      中评
                    </Button>
                    <Button type="text" onClick={() => handleAfterRadioChange(1)}>
                      差评
                    </Button>
                    <Button type="text" onClick={() => handleAfterRadioChange(0)}>
                      全部
                    </Button>
                  </>
                ) : null
              }
            >
              <TabPane tab="售后评价统计" key="evaluateSum">
                <Spin spinning={Boolean(afterEstimateSum.loading)}>
                  <Row gutter={24}>
                    <Col span={8}>
                      <Pie
                        hasLegend
                        subTitle="累计评价"
                        total={() => afterEvaluatePie.reduce((pre, now) => now.y + pre, 0)}
                        data={afterEvaluatePie}
                        height={178}
                        colProps={{
                          span: 8,
                        }}
                        colors={['#41CC9E', '#FFC400', '#EF6260']}
                      />
                    </Col>

                    <Col span={16}>
                      <PolymericTable
                        dataSource={afterEvaluate}
                        columns={evaluateColumns}
                        loading={false}
                        pagination={null}
                        rowClassName={() => styles['record-row']}
                      />
                    </Col>
                  </Row>
                </Spin>
              </TabPane>

              <TabPane tab="售后评价记录" key="evaluateRecord">
                <PolymericTable
                  rowKey="remark"
                  dataSource={afterList}
                  columns={afeterEvaluateRecordColumns}
                  loading={afterListLoading}
                  pagination={{
                    pageSize: afterSize,
                    total: afterTotal,
                  }}
                  onPaginationChange={handleAfterPaginationChange}
                />
              </TabPane>
            </Tabs>
          </MellowCard>
        </Col>

        <Col span={24}>
          <MellowCard title="投诉记录">
            <div className={styles['record-btns']}>
              <Radio.Group buttonStyle="solid" onChange={() => {}}>
                <Button type="text">全部({complaintSumData?.sum})</Button>
                <Button type="text">最近7天({complaintSumData?.last7days})</Button>
                <Button type="text">最近30天({complaintSumData?.last30days})</Button>
                <Button type="text">最近180天({complaintSumData?.last180days})</Button>
                <Button type="text">180天前({complaintSumData?.before180days})</Button>
              </Radio.Group>
            </div>

            <PolymericTable
              rowKey="remark"
              dataSource={complainList}
              columns={recordColumns}
              loading={complainListLoading}
              pagination={{
                pageSize: complainSize,
                total: complainTotal,
              }}
              onPaginationChange={handleComplainPaginationChange}
            />
          </MellowCard>
        </Col>
      </Row>
    </div>
  )
}

export default SincerityInfo
