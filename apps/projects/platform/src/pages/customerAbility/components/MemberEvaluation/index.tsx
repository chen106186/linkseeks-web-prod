/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-20 18:22:54
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 15:13:33
 * @Description: 会员交易评价
 */
import React, { useState, useEffect } from 'react'
import { Row, Col, Spin } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import PolymericTable from '@/components/PolymericTable'
import { EditableColumns } from '@/components/PolymericTable/interface'
import { Pie } from '@/components/Charts'
import MellowCard from '@/components/MellowCard'
import Mood from '@/components/Mood'
import ButtonSwitch from '@/components/ButtonSwitch'
import styles from './index.less'

const PAGE_SIZE = 5

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

export interface FetchParams {
  current?: number
  pageSize?: number
}

export interface ListItem {
  id?: number
  createTime: string
  star: number
  comment: string
  product: string
  byMemberName: string
  remark?: string
  /**
   * 交易时间
   */
  dealTime: string
}

interface IProps {
  /**
   * 标题
   */
  title: string
  /**
   * 数据源
   */
  analysis: EstimateSumItems[]
  /**
   * 是否是加载中
   */
  loading?: boolean
  /**
    交易评论历史记录
  */
  fetchEvaluationList: (params: FetchParams) => Promise<{ data: ListItem[]; totalCount: number }>
}

const MemberOrderEvaluation: React.FC<IProps> = (props: IProps) => {
  const { title, analysis, loading, fetchEvaluationList, ...rest } = props
  const [salesEvaluation, setSalesEvaluation] = useState([])
  const [salesEvaluationPie, setSalesEvaluationPie] = useState([])
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(PAGE_SIZE)
  const [total, setTotal] = useState(0)
  const [List, setList] = useState<ListItem[]>([])
  const [listLoading, setListLoading] = useState(false)

  const [radioValue, setRadioValue] = useState<'analysis' | 'records'>('analysis')

  const intl = useIntl()

  const evaluateColumns: EditableColumns[] = [
    {
      title: ' ',
      dataIndex: 'title',
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.components.MemberEvaluation.evaluateColumns.last7days',
        defaultMessage: '最近7天',
      }),
      dataIndex: 'last7days',
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.components.MemberEvaluation.evaluateColumns.last30days',
        defaultMessage: '最近30天',
      }),
      dataIndex: 'last30days',
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.components.MemberEvaluation.evaluateColumns.last180days',
        defaultMessage: '最近180天',
      }),
      dataIndex: 'last180days',
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.components.MemberEvaluation.evaluateColumns.before180days',
        defaultMessage: '180天前',
      }),
      dataIndex: 'before180days',
    },
  ]

  const exchangeMood = (star: number): React.ReactNode => {
    let node = null
    switch (star) {
      case 1:
      case 2: {
        node = (
          <>
            <Mood type="sad" customStyle={{ marginRight: 8 }} />
            <span>
              {intl.formatMessage({ id: 'customerAbility.components.MemberEvaluation.sad', defaultMessage: '差评' })}
            </span>
          </>
        )
        break
      }
      case 3: {
        node = (
          <>
            <Mood type="notBad" customStyle={{ marginRight: 8 }} />
            <span>
              {intl.formatMessage({ id: 'customerAbility.components.MemberEvaluation.notBad', defaultMessage: '中评' })}
            </span>
          </>
        )
        break
      }
      case 4:
      case 5: {
        node = (
          <>
            <Mood type="smile" customStyle={{ marginRight: 8 }} />
            <span>
              {intl.formatMessage({ id: 'customerAbility.components.MemberEvaluation.smile', defaultMessage: '好评' })}
            </span>
          </>
        )
        break
      }
      default:
        break
    }
    return node
  }

  const handleFilter = (value: 1 | 2 | 3, recordStar: number): boolean => {
    // 对应星级
    const starMap = {
      1: [1, 2],
      2: [3],
      3: [4, 5],
    }
    return starMap[value].includes(recordStar)
  }

  const evaluateRecordColumns: EditableColumns[] = [
    {
      title: intl.formatMessage({
        id: 'customerAbility.components.MemberEvaluation.evaluateRecordColumns.star',
        defaultMessage: '评论',
      }),
      dataIndex: 'star',
      filters: [
        {
          text: intl.formatMessage({ id: 'customerAbility.components.MemberEvaluation.sad', defaultMessage: '差评' }),
          value: 1,
        },
        {
          text: intl.formatMessage({
            id: 'customerAbility.components.MemberEvaluation.notBad',
            defaultMessage: '中评',
          }),
          value: 2,
        },
        {
          text: intl.formatMessage({ id: 'customerAbility.components.MemberEvaluation.smile', defaultMessage: '好评' }),
          value: 3,
        },
      ],
      onFilter: (value: 1 | 2 | 3, record: ListItem) => handleFilter(value, record.star),
      render: (text) => exchangeMood(text),
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.components.MemberEvaluation.evaluateRecordColumns.comment',
        defaultMessage: '评价内容',
      }),
      dataIndex: 'comment',
      ellipsis: true,
    },
    {
      title: `${intl.formatMessage({
        id: 'customerAbility.components.MemberEvaluation.evaluateRecordColumns.product',
        defaultMessage: '商品名称',
      })}/${intl.formatMessage({
        id: 'customerAbility.components.MemberEvaluation.evaluateRecordColumns.purchaseCount',
      })}`,
      dataIndex: 'product',
      ellipsis: true,
      render: (text, record) => `${text}/${record.purchaseCount}`,
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.components.MemberEvaluation.evaluateRecordColumns.byMemberName',
        defaultMessage: '评价方',
      }),
      dataIndex: 'byMemberName',
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.components.MemberEvaluation.evaluateRecordColumns.dealTime',
        defaultMessage: '交易时间',
      }),
      dataIndex: 'dealTime',
    },
    {
      title: intl.formatMessage({
        id: 'customerAbility.components.MemberEvaluation.evaluateRecordColumns.orderNo',
        defaultMessage: '订单号',
      }),
      dataIndex: 'orderNo',
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
        x: `${intl.formatMessage({
          id: 'customerAbility.components.MemberEvaluation.smile',
          defaultMessage: '好评',
        })}  ${count > 0 ? ((good / count) * 100).toFixed(2) : '0'}%`,
        y: good,
      },
      {
        x: `${intl.formatMessage({
          id: 'customerAbility.components.MemberEvaluation.notBad',
          defaultMessage: '中评',
        })}  ${count > 0 ? ((notBad / count) * 100).toFixed(2) : 0}%`,
        y: notBad,
      },
      {
        x: `${intl.formatMessage({ id: 'customerAbility.components.MemberEvaluation.sad', defaultMessage: '差评' })}  ${
          count > 0 ? ((bad / count) * 100).toFixed(2) : 0
        }%`,
        y: bad,
      },
    ]
    return ret
  }

  // 获取交易评价记录列表
  const getEvaluationList = (params?: FetchParams) => {
    if (fetchEvaluationList) {
      setListLoading(true)
      const nextPage = params?.current || page
      const nextSize = params?.pageSize || size
      fetchEvaluationList({
        current: nextPage,
        pageSize: nextSize,
      })
        .then((res) => {
          const { data = [], totalCount = 0 } = res || {}
          setList(data)
          setTotal(totalCount)
        })
        .finally(() => {
          setListLoading(false)
        })
    }
  }

  useEffect(() => {
    getEvaluationList()
  }, [])

  // 监听交易评价数据改变，组合所需数据
  useEffect(() => {
    const evaluate = summaryEvaluate(analysis)
    const evaluatePie = getSummaryEvaluatePie(evaluate)

    setSalesEvaluation(evaluate)
    setSalesEvaluationPie(evaluatePie)
  }, [analysis])

  const handlePaginationChange = (page: number, size: number) => {
    setPage(page)
    setSize(size)
    getEvaluationList({
      current: page,
      pageSize: size,
    })
  }

  const handleRadioChange = (value: 'analysis' | 'records') => {
    setRadioValue(value)
  }

  const options = [
    {
      label: intl.formatMessage({
        id: 'customerAbility.components.MemberEvaluation.options.analysis',
        defaultMessage: '评价统计',
      }),
      value: 'analysis',
    },
    {
      label: intl.formatMessage({
        id: 'customerAbility.components.MemberEvaluation.options.records',
        defaultMessage: '评价记录',
      }),
      value: 'records',
    },
  ]

  return (
    <MellowCard
      title={title}
      extra={<ButtonSwitch options={options} onChange={handleRadioChange} value={radioValue} />}
      bodyStyle={{
        paddingBottom: radioValue === 'analysis' ? 16 : 0,
      }}
      {...rest}
    >
      {radioValue === 'analysis' ? (
        <Spin spinning={!!loading}>
          <Row gutter={24}>
            <Col flex="386px">
              <Pie
                hasLegend
                subTitle={intl.formatMessage({
                  id: 'customerAbility.components.MemberEvaluation.pie.subTitle',
                  defaultMessage: '累计评价',
                })}
                total={() => salesEvaluationPie.reduce((pre, now) => now.y + pre, 0)}
                data={salesEvaluationPie}
                height={178}
                colProps={{
                  span: 8,
                }}
                colors={['#41CC9E', '#FFC400', '#EF6260']}
              />
            </Col>

            <Col flex="1">
              <PolymericTable
                dataSource={salesEvaluation}
                columns={evaluateColumns}
                loading={false}
                pagination={null}
                rowClassName={() => styles['record-row']}
              />
            </Col>
          </Row>
        </Spin>
      ) : null}

      {radioValue === 'records' ? (
        <PolymericTable
          rowKey="id"
          dataSource={List}
          columns={evaluateRecordColumns}
          loading={listLoading}
          pagination={{
            pageSize: size,
            total: total,
          }}
          onPaginationChange={handlePaginationChange}
        />
      ) : null}
    </MellowCard>
  )
}

export default MemberOrderEvaluation
