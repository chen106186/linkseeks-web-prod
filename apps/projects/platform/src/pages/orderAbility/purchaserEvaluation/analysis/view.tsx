import React, { useEffect, useState } from 'react'
import { Tabs, Row, Col, Button } from 'antd'
import { history } from '@linkseeks/router-manager'
import { useLocation } from '@linkseeks/router-core'
import { getIntl } from '@linkseeks/i18n'
import { observer, inject } from 'mobx-react'
import { PageHeaderWrapper } from '@apps/components'
import {
  getMemberCommentConsumerCountTradeHistoryPage,
  getMemberCommentConsumerCountTradeSummary,
  getMemberCommentConsumerReceiveTradeHistoryPage,
  getMemberCommentConsumerSendTradeHistoryPage,
} from '@apps/apis'
import { IEvaluationModule } from '@/module/evaluationModule'
import MellowCard from '@/components/MellowCard'
import PolymericTable from '@/components/PolymericTable'
import { EditableColumns } from '@/components/PolymericTable/interface'
import { Pie } from '@/components/Charts'
import Mood from '@/components/Mood'
import Shelves from '../components/Shelves'
import RecordList, { ListParams, RecordRes } from '../components/RecordList'
import styles from './index.less'

const { TabPane } = Tabs
const intl = getIntl()

interface ReceivedSearch {
  /**
   * 评价星级（1-5）
   */
  star: string
  /**
   * 交易时间开始
   */
  dealTimeStart: string
  /**
   * 交易时间结束
   */
  dealTimeEnd: string
  /**
   * 评价方名称
   */
  memberName: string
}

interface EstimateSumItems {
  id?: number
  title?: JSX.Element
  star?: number
  last7days?: number
  last30days?: number
  last180days?: number
  before180days?: number
  sum?: number
}

interface AnalysisProps {}

const Analysis: React.FC<AnalysisProps> = ({}) => {
  const { pathname } = useLocation()
  const url = pathname.split('/').slice(0, -1).join('/')
  const [evaluateSum, setEvaluateSum] = useState([])
  const [evaluatePie, setEvaluatePie] = useState([])

  const [purchaserActiveKey, setPurchaserActiveKey] = useState('1')

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
      let target = null

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
    const count = source.reduce((pre, now) => now.sum + pre, 0)
    const good = source[0] && source[0].sum ? source[0].sum : 0
    const notBad = source[1] && source[1].sum ? source[1].sum : 0
    const bad = source[2] && source[2].sum ? source[2].sum : 0

    const ret = [
      {
        x: `${intl.formatMessage({ id: 'purchaserEvaluation.haoping' })}  ${
          count > 0 ? ((good / count) * 100).toFixed(2) : '0'
        }%`,
        y: good,
      },
      {
        x: `${intl.formatMessage({ id: 'purchaserEvaluation.zhongping' })}  ${
          count > 0 ? ((notBad / count) * 100).toFixed(2) : 0
        }%`,
        y: notBad,
      },
      {
        x: `${intl.formatMessage({ id: 'purchaserEvaluation.chaping' })}  ${
          count > 0 ? ((bad / count) * 100).toFixed(2) : 0
        }%`,
        y: bad,
      },
    ]

    return ret
  }

  // 获取评价汇总
  const getTradeSummary = () => {
    getMemberCommentConsumerCountTradeSummary()
      .then((res) => {
        if (res.code === 1000) {
          const evaluate = summaryEvaluate(res.data.rows)
          const evaluatePieData = getSummaryEvaluatePie(evaluate)
          setEvaluateSum(evaluate)
          setEvaluatePie(evaluatePieData)
        }
      })
      .catch((err) => {
        console.warn(err)
      })
  }

  // 获取评价记录
  const getTradeHistory = (params: ListParams): Promise<RecordRes> => {
    const { star, ...rest } = params
    return new Promise((resolve, reject) => {
      getMemberCommentConsumerCountTradeHistoryPage({
        ...rest,
        starLevel: params.star,
      })
        .then((res) => {
          if (res.code === 1000) {
            const { data, totalCount } = res.data
            resolve({
              data: data.map((item) => {
                return {
                  id: item.id,
                  star: item.star,
                  comment: item.comment,
                  productName: item.product || '',
                  price: item.price,
                  quantity: item.purchaseCount,
                  target: item.byMemberName,
                  orderId: item.orderId,
                  dealTime: item.dealTime,
                  orderNo: item.orderNo,
                }
              }),
              totalCount,
            })
          }
          reject(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  // 获取收到的评价列表
  const getReceivedList = (params: ListParams): Promise<RecordRes> => {
    return new Promise((resolve, reject) => {
      getMemberCommentConsumerReceiveTradeHistoryPage({
        ...params,
      })
        .then((res) => {
          if (res.code === 1000) {
            const { data, totalCount } = res.data
            resolve({
              data: data.map((item) => {
                return {
                  id: item.id,
                  star: item.star,
                  comment: item.comment,
                  productName: item.product || '',
                  price: item.price,
                  quantity: item.purchaseCount,
                  target: item.memberName,
                  orderId: item.orderId,
                  dealTime: item.dealTime as string,
                }
              }),
              totalCount,
            })
          }
          reject(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  // 获取发出的评价列表
  const getSentList = (params: ListParams): Promise<RecordRes> => {
    const { memberName, ...rest } = params
    return new Promise((resolve, reject) => {
      getMemberCommentConsumerSendTradeHistoryPage({
        ...rest,
        subMemberName: memberName,
      })
        .then((res) => {
          if (res.code === 1000) {
            const { data, totalCount } = res.data
            resolve({
              data: data.map((item) => {
                return {
                  id: item.id,
                  star: item.star,
                  comment: item.comment,
                  productName: item.product || '',
                  price: item.price,
                  quantity: item.purchaseCount,
                  target: item.subMemberName,
                  orderId: item.orderId,
                  dealTime: item.dealTime as string,
                }
              }),
              totalCount,
            })
          }
          reject(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  const evaluateColumns: EditableColumns[] = [
    {
      title: ' ',
      dataIndex: 'title',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'purchaserEvaluation.zuijin7tian' }),
      dataIndex: 'last7days',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'purchaserEvaluation.zuijin30tian' }),
      dataIndex: 'last30days',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'purchaserEvaluation.zuijin180tian' }),
      dataIndex: 'last180days',
      align: 'center',
    },
    {
      title: intl.formatMessage({ id: 'purchaserEvaluation.180tianqian' }),
      dataIndex: 'before180days',
      align: 'center',
    },
  ]

  useEffect(() => {
    getTradeSummary()
  }, [])

  const handleJumpReceived = (record) => {
    history.push(`${url}/received/detail?id=${record.id}`)
  }

  const handleEditSent = (record) => {
    history.push(`${url}/sent/edit?id=${record.id}`)
  }

  const handleJumpSent = (record) => {
    history.push(`${url}/sent/detail?id=${record.id}`)
  }

  return (
    <PageHeaderWrapper>
      <MellowCard
        bodyStyle={{
          padding: '0 24px 24px',
        }}
      >
        <Tabs className={styles.tabs} activeKey={purchaserActiveKey} onChange={setPurchaserActiveKey}>
          <TabPane tab={intl.formatMessage({ id: 'purchaserEvaluation.gailan' })} key="1">
            <Shelves title={intl.formatMessage({ id: 'purchaserEvaluation.pingjiatongji' })}>
              <Row gutter={24}>
                <Col flex="399px">
                  <Pie
                    hasLegend
                    subTitle={intl.formatMessage({ id: 'purchaserEvaluation.leijipingjia' })}
                    total={() => evaluatePie.reduce((pre, now) => now.y + pre, 0)}
                    data={evaluatePie}
                    height={200}
                    colProps={{
                      span: 8,
                    }}
                    colors={['#41CC9E', '#FFC400', '#EF6260']}
                  />
                </Col>

                <Col flex="auto">
                  <PolymericTable
                    dataSource={evaluateSum}
                    columns={evaluateColumns}
                    loading={false}
                    pagination={null}
                    rowClassName={() => styles['record-row']}
                  />
                </Col>
              </Row>
            </Shelves>

            <Shelves title={intl.formatMessage({ id: 'purchaserEvaluation.pingjiajilu' })}>
              <RecordList
                fetchList={getTradeHistory}
                paginationType="button"
                searchable={false}
                onCheck={handleJumpReceived}
                remark
              />
            </Shelves>
          </TabPane>

          <TabPane tab={intl.formatMessage({ id: 'purchaserEvaluation.shoudaodepingjia' })} key="2">
            <RecordList fetchList={getReceivedList} onCheck={handleJumpReceived} />
          </TabPane>

          <TabPane tab={intl.formatMessage({ id: 'purchaserEvaluation.fachudepingjia' })} key="3">
            <RecordList
              fetchList={getSentList}
              onCheck={handleJumpSent}
              onEdit={handleEditSent}
              opposite={false}
              editable={true}
              searchTip={intl.formatMessage({ id: 'purchaserEvaluation.beipingjiafang' })}
            />
          </TabPane>
        </Tabs>
      </MellowCard>
    </PageHeaderWrapper>
  )
}

export default Analysis
