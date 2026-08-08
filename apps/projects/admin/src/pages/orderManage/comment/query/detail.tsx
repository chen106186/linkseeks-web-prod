import React, { useState, useEffect } from 'react'
import { Tabs, Row, Col, Button } from 'antd'
import { history } from '@linkseeks/router-manager'
import { isJSONStr } from '@/utils'
import { usePageStatus } from '@/hooks/usePageStatus'
import MellowCard from '@/components/MellowCard'
import PolymericTable from '@/components/PolymericTable'
import { EditableColumns } from '@/components/PolymericTable/interface'
import { Pie } from '@/components/Charts'
import Mood from '@/components/Mood'
import Shelves from './components/Shelves'
import RecordList, { ListParams, RecordRes } from './components/RecordList'
import { getMemberPlatformCommentTradeHistoryPage, getMemberPlatformCommentTradeSummary } from '@apps/apis'

const { TabPane } = Tabs

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

const CommentDetailed: React.FC = () => {
  const { memberId, roleId } = usePageStatus()
  const [evaluateSum, setEvaluateSum] = useState<EstimateSumItems[]>([])
  const [evaluatePie, setEvaluatePie] = useState<{ x: string; y: number }[]>([])

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
      let target = {}

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
    const count = source.reduce((pre, now: any) => now.sum + pre, 0)
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

  // 获取评价汇总
  const getTradeSummary = () => {
    getMemberPlatformCommentTradeSummary({
      memberId,
      roleId,
    })
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
      getMemberPlatformCommentTradeHistoryPage({
        memberId,
        roleId,
        ...rest,
        starLevel: params.star as string,
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
                  created: item.createTime,
                  target: item.byMemberName,
                  orderId: item.orderId,
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

  useEffect(() => {
    getTradeSummary()
  }, [])

  return (
    <MellowCard
      bodyStyle={{
        padding: '0 24px 24px',
      }}
    >
      <Tabs>
        <TabPane tab="概览" key="1">
          <Shelves title="评价统计">
            <Row gutter={24}>
              <Col flex="399px">
                <Pie
                  hasLegend
                  subTitle="累计评价"
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
                <PolymericTable dataSource={evaluateSum} columns={evaluateColumns} loading={false} pagination={null} />
              </Col>
            </Row>
          </Shelves>

          <Shelves title="评价记录">
            <RecordList fetchList={getTradeHistory} paginationType="button" searchable={false} />
          </Shelves>
        </TabPane>
      </Tabs>
    </MellowCard>
  )
}

export default CommentDetailed
