import React from 'react'
import { Button, Rate, Spin, Pagination, Switch, Tooltip } from 'antd'
import { createFormActions, FormEffectHooks } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'
import { formatTimeString } from '@/utils'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { postMemberCommentSupplyReceiveShowEvaluationUpdate } from '@apps/apis'
import { checkMore } from '@/utils'
import NiceForm from '@/components/NiceForm'
import PolymericTable from '@/components/PolymericTable'
import { EditableColumns } from '@/components/PolymericTable/interface'
import { searchSchema } from './schema'

const intl = getIntl()

const formActions = createFormActions()
const { onFormInit$ } = FormEffectHooks

const PAGE_SIZE = 10

export interface Search {
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
   * 评价方/被评价方
   */
  target: string
  /**
   * 订单id
   */
  orderId: number
  /**
   * 是否已解释，被评价方回复 0-否 1-是
   */
  replyStatus?: number
  /**
   * 交易时间
   */
  dealTime: string
  /**
   * 状态 1显示 2隐藏
   */
  status?: number
  /**
   * 订单号
   */
  orderNo?: string
}

export interface RecordRes {
  data: RecordItem[]
  totalCount: number
}

interface RecordListProps {
  /**
   * 分页器类型
   */
  paginationType?: 'pagination' | 'button'

  /**
   * 是否需要检索
   */
  searchable?: boolean

  /**
   * 是否是查看收到的评论，默认 true
   */
  opposite?: boolean

  /**
   * 是否可编辑的
   */
  editable?: boolean

  /**
   * 是否可切换状态
   */
  statusable?: boolean

  fetchList: (params: ListParams) => Promise<RecordRes>

  onCheck: (record: RecordItem) => void

  onEdit?: (record: RecordItem) => void

  /**
   * 搜索框提示语
   */
  searchTip?: string

  /**
   * 是否显示解释按钮，默认 false
   */
  explicable?: boolean

  /**
   * 点击解释触发事件
   */
  onExplain?: (record: RecordItem) => void

  /**
   * 是否显示备注，默认 false
   */
  remark?: boolean
}

interface RecordListState {
  hasMore: boolean
  page: number
  size: number
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

  // 重新加载列表
  refresh = () => {
    this.setState(
      {
        receivedList: {
          data: [],
          totalCount: 0,
        },
        loading: true,
      },
      () => {
        const { page, size } = this.state
        this.getRecordList()
          .then((res) => {
            this.setState({
              receivedList: res,
              hasMore: checkMore(page, size, res.data.length, res.totalCount),
            })
          })
          .finally(() => {
            this.setState({ loading: false })
          })
      },
    )
  }

  handleSwitchVisible = (value: boolean, record: RecordItem) => {
    postMemberCommentSupplyReceiveShowEvaluationUpdate({
      id: record.id,
      status: value ? 1 : 2,
    }).then((res) => {
      if (res.code === 1000) {
        this.refresh()
      }
    })
  }

  componentDidMount() {
    this.getRecordList().then((res) => {
      const { page, size } = this.state
      this.setState({
        hasMore: checkMore(page, size, res.data.length, res.totalCount),
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
            hasMore: checkMore(page, size, res.data.length, res.totalCount),
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
      (prevState) => ({
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
            hasMore: checkMore(page, size, res.data.length, res.totalCount),
          })
        })
      },
    )
  }

  handlePaginationChange = (current: number, pageSize: number) => {
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
            hasMore: checkMore(page, size, res.data.length, res.totalCount),
          })
        })
      },
    )
  }

  handleCheck = (record: RecordItem) => {
    const { onCheck } = this.props
    if (onCheck) {
      onCheck(record)
    }
  }

  handleEdit = (record: RecordItem) => {
    const { onEdit } = this.props
    if (onEdit) {
      onEdit(record)
    }
  }

  handleExplain = (record: RecordItem) => {
    const { onExplain } = this.props
    if (onExplain) {
      onExplain(record)
    }
  }

  render() {
    const {
      paginationType = 'pagination',
      searchable = true,
      opposite = true,
      editable = false,
      searchTip = intl.formatMessage({ id: 'purchaserEvaluation.pingjiafang', defaultMessage: '评价方' }),
      explicable = false,
      statusable = false,
      remark = false,
    } = this.props
    const { page, size, loading, receivedList, hasMore } = this.state

    const columns: EditableColumns<RecordItem>[] = [
      {
        title: intl.formatMessage({ id: 'purchaserEvaluation.pingjiaxingji', defaultMessage: '评价星级' }),
        dataIndex: 'star',
        render: (text) => <Rate value={text} disabled />,
      },
      {
        title: intl.formatMessage({ id: 'purchaserEvaluation.pingjianeirong', defaultMessage: '评价内容' }),
        dataIndex: 'comment',
        ellipsis: true,
      },
      {
        title: intl.formatMessage({ id: 'purchaserEvaluation.caigoushangpin', defaultMessage: '采购商品' }),
        dataIndex: 'productName',
      },
      {
        title: intl.formatMessage({ id: 'purchaserEvaluation.chengjiaoshuliang', defaultMessage: '成交数量' }),
        dataIndex: 'quantity',
      },
      {
        title: opposite
          ? intl.formatMessage({ id: 'purchaserEvaluation.pingjiafang', defaultMessage: '评价方' })
          : intl.formatMessage({ id: 'purchaserEvaluation.beipingjiafang', defaultMessage: '被评价方' }),
        dataIndex: 'target',
      },
      {
        title: intl.formatMessage({ id: 'purchaserEvaluation.jiaoyishijian', defaultMessage: '交易时间' }),
        dataIndex: 'dealTime',
        render: (text) => (text ? formatTimeString(text) : ''),
      },
      remark
        ? {
            title: intl.formatMessage({ id: 'purchaserEvaluation.beizhu', defaultMessage: '备注' }),
            dataIndex: 'orderNo',
            render: (text) =>
              `${intl.formatMessage({ id: 'purchaserEvaluation.dingdanhao', defaultMessage: '订单号' })}：${text}`,
          }
        : null,
      statusable
        ? {
            title: (
              <Tooltip
                title={intl.formatMessage({
                  id: 'purchaserEvaluation.xianshizebiaoshishangpinping',
                  defaultMessage:
                    '显示则表示商品评价在商品详情页对买家进行展示；隐藏则表示商品评价在商品详情页对买家进行隐藏，买家依然可对订单进行评价。',
                })}
              >
                {intl.formatMessage({
                  id: 'purchaserEvaluation.shifouxianshishangpinpingjia',
                  defaultMessage: '是否显示商品评价',
                })}
                <QuestionCircleOutlined style={{ marginLeft: 8 }} />
              </Tooltip>
            ),
            dataIndex: 'status',
            render: (text, record) => (
              <Switch checked={text === 1} onChange={(value) => this.handleSwitchVisible(value, record)} />
            ),
          }
        : null,
      {
        title: intl.formatMessage({ id: 'purchaserEvaluation.caozuo', defaultMessage: '操作' }),
        dataIndex: 'option',
        align: 'center',
        render: (_, record) => (
          <>
            {editable && (
              <Button type="link" onClick={() => this.handleEdit(record)}>
                {intl.formatMessage({ id: 'purchaserEvaluation.bianji', defaultMessage: '编辑' })}
              </Button>
            )}
            {explicable && record.replyStatus === 0 && (
              <Button type="link" onClick={() => this.handleExplain(record)}>
                {intl.formatMessage({ id: 'purchaserEvaluation.jieshi', defaultMessage: '解释' })}
              </Button>
            )}
            <Button type="link" onClick={() => this.handleCheck(record)}>
              {intl.formatMessage({ id: 'purchaserEvaluation.zhakan', defaultMessage: '查看' })}
            </Button>
          </>
        ),
      },
    ].filter(Boolean) as EditableColumns<RecordItem>[]

    return (
      <>
        {searchable && (
          <NiceForm
            actions={formActions}
            onSubmit={this.handleSearch}
            effects={($, actions) => {
              const { setFieldState } = actions
              onFormInit$().subscribe((fieldState) => {
                setFieldState('memberName', (state) => {
                  state.props['x-component-props'].tip = searchTip
                })
              })
            }}
            schema={searchSchema}
          />
        )}

        <PolymericTable dataSource={receivedList.data} columns={columns} loading={loading} pagination={null} />

        {paginationType === 'button' ? (
          <>
            {hasMore && !loading && (
              <div
                style={{
                  textAlign: 'center',
                }}
              >
                <Button onClick={this.handleLoadMore}>
                  {intl.formatMessage({
                    id: 'purchaserEvaluation.zhakangengduopinglun',
                    defaultMessage: '查看更多评论',
                  })}
                </Button>
              </div>
            )}
            {loading && (
              <div
                style={{
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
      </>
    )
  }
}
