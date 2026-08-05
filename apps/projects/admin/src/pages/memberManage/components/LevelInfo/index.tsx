import React, { useState, useEffect } from 'react'
import { Row, Col, Progress } from 'antd'
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
  const [list, setList] = useState<DataProps[]>([])
  const [listLoading, setListLoading] = useState(false)

  const columns: EditableColumns[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: '获取项目',
      dataIndex: 'ruleName',
      align: 'center',
    },
    {
      title: '获取分值',
      dataIndex: 'score',
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
    setPage(page)
    setSize(size)
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
            title="会员等级"
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

                  <div className={styles['card-higher']}>当前活跃分</div>
                </div>
              </div>
              <div className={styles['infoWrap-right']}>
                <MiniArea
                  animate={false}
                  line
                  borderWidth={2}
                  height={180}
                  padding={[10, 20, 50, 80]}
                  scale={{
                    x: {
                      alias: `${new Date().getFullYear()}年`, // 别名
                    },
                    y: {
                      tickCount: 5,
                      alias: '活跃分', // 别名
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
            title="活跃分获取记录"
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
