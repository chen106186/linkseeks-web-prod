import React, { useState, useEffect } from 'react'
import { Button, Rate, Spin, Pagination } from 'antd'
import { createFormActions } from '@apps/formily'
import { formatTimeString } from '@/utils'
import NiceForm from '@/components/NiceForm'
import { checkMore } from '@/utils'
import { searchSchema } from './schema'
import styles from './index.less'

const formActions = createFormActions()

const PAGE_SIZE = 8

export interface Search {
  /**
   * 评价星级（1-5）
   */
  star: string | null
  /**
   * 交易时间开始
   */
  dealTimeStart: string | null
  /**
   * 交易时间结束
   */
  dealTimeEnd: string | null
  /**
   * 评价方名称
   */
  memberName: string | null
}

export interface ListParams extends Search {
  /**
   * 当前页
   */
  current: string
  /**
   * 每页行数
   */
  pageSize: string
}

export interface RecordItem {
  /**
   * 记录id
   */
  id?: number
  /**
   * 评价星级（1-5）
   */
  star: number
  /**
   * 评价内容
   */
  comment: string
  /**
   * 商品名称
   */
  productName: string
  /**
   * 商品价格
   */
  price: number
  /**
   * 商品数量
   */
  quantity: number
  /**
   * 交易时间
   */
  created: string
  /**
   * 评价方/被评价方
   */
  target: string
  /**
   * 订单id
   */
  orderId: number
}

export interface RecordRes {
  data: RecordItem[]
  totalCount: number
}

interface RecordListProps {
  // 分页器类型
  paginationType?: 'pagination' | 'button'

  // 是否需要检索
  searchable?: boolean

  // 是否是查看收到的品论
  opposite?: boolean

  // 是否可编辑的
  editable?: boolean

  // 是否可查看的
  viewable?: boolean

  fetchList: (params: ListParams) => Promise<RecordRes>

  onCheck?: (record: RecordItem) => void

  onEdit?: (record: RecordItem) => void
}

interface RecordListState {
  hasMore: boolean
  page: number
  size: number | undefined
  searchVal: Search
  receivedList: RecordRes
  loading: boolean
}

export default class RecordList extends React.Component<RecordListProps, RecordListState> {
  constructor(props) {
    super(props)
    this.state = {
      hasMore: false,
      page: 1,
      size: PAGE_SIZE,
      searchVal: {
        star: null,
        dealTimeStart: null,
        dealTimeEnd: null,
        memberName: null,
      },
      receivedList: { data: [], totalCount: 0 },
      loading: false,
    }
  }

  componentDidMount() {
    this.getRecordList().then((res) => {
      const { page, size } = this.state
      this.setState({
        hasMore: checkMore(page, size as number, res.data.length, res.totalCount),
        receivedList: res,
      })
    })
  }

  // 获取列表数据
  getRecordList = (): Promise<RecordRes> => {
    const { fetchList } = this.props
    if (!fetchList) {
      return Promise.reject()
    }
    this.setState({ loading: true })
    return new Promise((resolve, reject) => {
      const { searchVal, page, size } = this.state
      const { dealTimeStart, dealTimeEnd } = searchVal

      fetchList({
        ...searchVal,
        dealTimeStart: dealTimeStart ? formatTimeString(+dealTimeStart) : null,
        dealTimeEnd: dealTimeEnd ? formatTimeString(+dealTimeEnd) : null,
        current: `${page}`,
        pageSize: `${size}`,
      })
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
        .finally(() => {
          this.setState({ loading: false })
        })
    })
  }

  // 查询列表
  handleSearch = (values) => {
    this.setState(
      {
        page: 1,
        receivedList: {
          data: [],
          totalCount: 0,
        },
        searchVal: values,
      },
      () => {
        const { page, size } = this.state
        this.getRecordList().then((res) => {
          this.setState({
            receivedList: res,
            hasMore: checkMore(page, size as number, res.data.length, res.totalCount),
          })
        })
      },
    )
  }

  // 加载更多
  handleLoadMore = () => {
    const { hasMore, loading } = this.state
    if (!hasMore || loading) {
      return
    }
    this.setState(
      (prevState: any) => ({
        page: prevState.page + 1,
      }),
      () => {
        this.getRecordList().then((res) => {
          const { receivedList, page, size } = this.state
          this.setState({
            receivedList: {
              ...receivedList,
              data: receivedList.data.concat(res.data),
            },
            hasMore: checkMore(page, size as number, res.data.length, res.totalCount),
          })
        })
      },
    )
  }

  handlePaginationChange = (current: number, pageSize: number | undefined) => {
    this.setState(
      {
        page: current,
        size: pageSize,
      },
      () => {
        this.getRecordList().then((res) => {
          const { page, size } = this.state
          this.setState({
            receivedList: res,
            hasMore: checkMore(page, size as number, res.data.length, res.totalCount),
          })
        })
      },
    )
  }

  handleCheck = (record) => {
    const { onCheck } = this.props
    if (onCheck) {
      onCheck(record)
    }
  }

  handleEdit = (record) => {
    const { onEdit } = this.props
    if (onEdit) {
      onEdit(record)
    }
  }

  render() {
    const {
      paginationType = 'pagination',
      searchable = true,
      opposite = true,
      editable = false,
      viewable = false,
    } = this.props
    const { page, size, loading, receivedList, hasMore } = this.state

    return (
      <>
        {searchable && (
          <NiceForm
            actions={formActions}
            onSubmit={this.handleSearch}
            effects={($, actions) => {}}
            schema={searchSchema}
          />
        )}

        <Spin spinning={paginationType === 'pagination' && loading}>
          <ul
            className={styles.record}
            style={{
              minHeight: loading ? 69 : 'auto',
            }}
          >
            {receivedList.data.map((item, index) => (
              <li className={styles['record-item']} key={index}>
                <div className={styles['record-item-good']}>
                  <div className={styles['record-item-good-name']}>{item.productName}</div>
                  <div style={{ marginTop: 'auto' }}>
                    <span className={styles['record-item-good-price']}>¥{item.price}</span>
                    <span className={styles['record-item-good-desc']}>X{item.quantity}</span>
                  </div>
                </div>

                <div className={styles['record-item-extra']}>
                  <div className={styles['record-item-extra-item']}>
                    <div className={styles['record-item-extra-item-label']}>交易时间：</div>
                    <div className={styles['record-item-extra-item-control']}>
                      {item.created ? formatTimeString(item.created) : ''}
                    </div>
                  </div>
                  <div className={styles['record-item-extra-item']}>
                    <div className={styles['record-item-extra-item-label']}>{opposite ? '评价方' : '被评价方'}：</div>
                    <div className={styles['record-item-extra-item-control']}>{item.target}</div>
                  </div>
                </div>

                <div className={styles['record-item-comment']}>
                  <Rate value={item.star} disabled />
                  <div className={styles['record-item-comment-main']} title={item.comment}>
                    {item.comment}
                  </div>
                </div>

                <div className={styles['record-item-actions']}>
                  {editable && (
                    <Button type="link" onClick={() => this.handleEdit(item)}>
                      编辑
                    </Button>
                  )}
                  {viewable && (
                    <Button type="link" onClick={() => this.handleCheck(item)}>
                      查看
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Spin>

        {paginationType === 'button' ? (
          <>
            {hasMore && !loading && (
              <div
                style={{
                  padding: '24px 0',
                  textAlign: 'center',
                }}
              >
                <Button onClick={this.handleLoadMore}>查看更多评论</Button>
              </div>
            )}
            {loading && (
              <div
                style={{
                  padding: '24px 0',
                  textAlign: 'center',
                }}
              >
                <Spin />
              </div>
            )}
          </>
        ) : (
          <>
            {receivedList.data.length > 0 && (
              <div
                style={{
                  padding: '24px 0',
                  textAlign: 'right',
                }}
              >
                <Pagination
                  current={page}
                  pageSize={size}
                  total={receivedList.totalCount}
                  onChange={this.handlePaginationChange}
                />
              </div>
            )}
          </>
        )}
        {!receivedList.data.length && !loading && <div style={{ textAlign: 'center' }}>暂无数据~</div>}
      </>
    )
  }
}
