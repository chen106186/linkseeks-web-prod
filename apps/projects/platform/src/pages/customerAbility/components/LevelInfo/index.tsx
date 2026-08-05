import React, { useState, useEffect } from 'react'
import { Row, Col, Progress, Radio } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import classNames from 'classnames'
import { MiniArea } from '@/components/Charts'
import PolymericTable from '@/components/PolymericTable'
import { EditableColumns } from '@/components/PolymericTable/interface'
import MellowCard from '@/components/MellowCard'
import styles from './index.less'

const PAGE_SIZE = 8

export interface DataProps {
  id?: number
  createTime?: string
  ruleName?: string
  score?: number
  remark?: string
}

export interface FetchParams {
  current: number
  pageSize: number
}

export interface LevelInfoProps {
  levelInfo?: {
    level?: string
    score?: number
    nextLevel?: string
    nextScore?: number
  }
  chartData?: {
    x: React.ReactText
    y: number
  }[]
  fetchList?: (params: FetchParams) => Promise<{ data: DataProps[]; totalCount: number }>
}

const LevelInfo: React.FC<LevelInfoProps> = ({ levelInfo = {}, chartData = [], fetchList }) => {
  const score = levelInfo.score || 0
  const nextScore = levelInfo.nextScore || 0
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(PAGE_SIZE)
  const [total, setTotal] = useState(0)
  const [list, setList] = useState([])
  const [listLoading, setListLoading] = useState(false)

  const intl = useIntl()

  const columns: EditableColumns[] = [
    {
      title: intl.formatMessage({ id: 'customerAbility.components.LevelInfo.columns.id' }),
      dataIndex: 'id',
    },
    {
      title: intl.formatMessage({ id: 'customerAbility.components.LevelInfo.columns.ruleName' }),
      dataIndex: 'ruleName',
    },
    {
      title: intl.formatMessage({ id: 'customerAbility.components.LevelInfo.columns.score' }),
      dataIndex: 'score',
    },
    {
      title: intl.formatMessage({ id: 'customerAbility.components.LevelInfo.columns.createTime' }),
      dataIndex: 'createTime',
    },
    {
      title: intl.formatMessage({ id: 'customerAbility.components.LevelInfo.columns.remark' }),
      dataIndex: 'remark',
      ellipsis: true,
    },
  ]

  const getHistoryList = (params?) => {
    if (fetchList) {
      setListLoading(true)
      fetchList({
        current: page,
        pageSize: size,
        ...params,
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
    getHistoryList()
  }, [])

  const handlePaginationChange = (current: number, pageSize: number) => {
    setPage(current)
    setSize(pageSize)
    getHistoryList({
      current,
      pageSize,
    })
  }

  return (
    <div className={styles.levelInfo}>
      <Row gutter={[0, 24]}>
        <Col span={24}>
          <MellowCard
            title={intl.formatMessage({ id: 'customerAbility.components.LevelInfo.levelInfo' })}
            headStyle={{
              borderBottom: 'none',
            }}
          >
            <div className={styles.infoWrap}>
              <div className={styles['infoWrap-left']}>
                <div className={classNames(styles.card, styles['card-level1'])}>
                  <div className={styles['card-name']}>{levelInfo?.level}</div>

                  <div className={styles['card-progress']}>
                    <Progress
                      strokeWidth={4}
                      strokeLinecap="square"
                      showInfo={false}
                      percent={nextScore ? (score / nextScore) * 100 : 100}
                    />
                  </div>

                  <div className={styles['card-txt']}>
                    <div className={styles['card-experience']}>
                      {score}/{nextScore}
                    </div>
                    <div className={styles['card-higher']}>{levelInfo.nextLevel}</div>
                  </div>

                  <div className={styles['card-higher']}>
                    {intl.formatMessage({
                      id: 'customerAbility.components.LevelInfo.score.description',
                      defaultMessage: '当前活跃分',
                    })}
                  </div>
                </div>
              </div>
              <div className={styles['infoWrap-right']}>
                <MiniArea
                  animate={false}
                  line
                  borderWidth={2}
                  height={180}
                  padding={[10, 20, 50, 60]}
                  scale={{
                    x: {
                      alias: `${new Date().getFullYear()}${intl.formatMessage({
                        id: 'customerAbility.components.LevelInfo.score.miniArea.x',
                        defaultMessage: '年',
                      })}`, // 别名
                    },
                    y: {
                      tickCount: 5,
                      alias: intl.formatMessage({
                        id: 'customerAbility.components.LevelInfo.score.miniArea.y',
                        defaultMessage: '活跃分',
                      }), // 别名
                    },
                  }}
                  xAxis={{
                    tickLine: undefined,
                    label: undefined,
                    title: {
                      style: {
                        fontSize: 12,
                        fill: '#C0C4CC',
                        fontWeight: 400,
                        rotate: 90,
                      },
                    },
                  }}
                  yAxis={{
                    tickLine: undefined,
                    label: {
                      offset: 10,
                    },
                    title: {
                      style: {
                        fontSize: 12,
                        fill: '#C0C4CC',
                        fontWeight: 400,
                        rotate: 90,
                      },
                    },
                    grid: {
                      line: {
                        type: 'line',
                        style: {
                          stroke: '#d9d9d9',
                          lineWidth: 1,
                          lineDash: [2, 2],
                        },
                      },
                    },
                  }}
                  color="l(90) 0:#AAC5FC 1:#FFFFFF"
                  data={chartData}
                />
              </div>
            </div>
          </MellowCard>
        </Col>

        <Col span={24}>
          <MellowCard
            title={intl.formatMessage({
              id: 'customerAbility.components.LevelInfo.record.title',
              defaultMessage: '活跃分获取记录',
            })}
            headStyle={{
              borderBottom: 'none',
            }}
          >
            <PolymericTable
              dataSource={list}
              columns={columns}
              loading={listLoading}
              pagination={{
                pageSize: size,
                total,
              }}
              onPaginationChange={handlePaginationChange}
            />
          </MellowCard>
        </Col>
      </Row>
    </div>
  )
}

export default LevelInfo
