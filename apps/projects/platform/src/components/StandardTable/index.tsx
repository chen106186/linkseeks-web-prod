import type { RefObject, ReactNode } from 'react'
import React, { PureComponent } from 'react'
import cx from 'classnames'
import { Table, Pagination } from 'antd'
import type { FormilyCustomProps } from './TableController'
import TableController from './TableController'

import './index.less'
import type { TableProps, TablePaginationConfig } from 'antd/lib/table'
import type { TableRowSelection, ColumnType } from 'antd/lib/table/interface'
import type { ITableControllerRef } from './TableController'
import type { currentStateType } from './keepAlive'
import { getCurrentState, saveCurrentState, clearCurrentState } from './keepAlive'
import { createAsyncFormActions } from '@apps/formily'
import { getIntl } from '@linkseeks/i18n'

export type tableTypes = 'small' | 'normal'

export interface IQueryParams {
  keywords?: string
  [key: string]: any
}

export interface ITablePagination {
  current?: number
  pageSize?: number
}

const intl = getIntl()

export interface IStandardTableProps<RecordType> extends TableProps<RecordType>, FormilyCustomProps {
  onRowDoubleClick?: (record: TableRowSelection<RecordType>) => void

  /**
   * @description 引入的实例
   * @type {RefObject<T>}
   * @memberof ITableControllerProps
   */
  currentRef?: RefObject<ITableControllerRef> | { current: any }
  // formFilters?: Array<IFormFilter>;
  controlRender?: React.ReactNode
  fetchTableData?: (queryParams?: any) => Promise<any>
  // 可在上方的表单前后增加jsx元素, children为formily元素， pagination为自定义分页器
  formRender?: (children: ReactNode, pagination?: ReactNode) => ReactNode
  // 可配置的table属性， 用于覆盖默认table配置
  tableProps?: any
  /**引入可配置的国际化 */
  formatMessage?: (params?: any) => string
  // 引入可修改的form布局
  // formAlign?: 'left' | 'right';
  // 当值为small时，会将分页器隐藏
  tableType?: tableTypes
  // 是否开启记录页码状态和筛选状态
  keepAlive?: boolean
  /**
   * 是否需要响应式、可视区域内的竖向滚动
   * - 默认: true
   */
  autoScrollY?: boolean
}

export interface IStandardTableState {
  current: number
  pageSize: number
  totalPage: number
  queryParams: IQueryParams
  tableLoading: boolean
  dataSource: any[]
  dataColumns: ColumnType<any>[]
  tableHeight: number
}

const isResetParams = () => !!sessionStorage.getItem('tableRest')

/**
 * 无数据时 默认显示的数据条数
 */
const DEFAULT_TOTAL_PAGE = 0

/**
 * @description 对table组件的业务封装
 * @author xjm
 * @date 2020-05-12
 * @class StandardTable
 * @extends {PureComponent<IStandardTableProps, any>}
 */
class StandardTable<RecordType extends object = any> extends PureComponent<
  IStandardTableProps<RecordType>,
  IStandardTableState
> {
  static defaultProps = {
    tableProps: {},
    keepAlive: true, // 默认开启记录页码状态和筛选状态
    autoScrollY: true, // 默认开启自动计算高度
  }

  // 查询关键词的快照
  queryParams = {}

  // 在实例上绑定action, 避免多个表格时，共用同一个actions
  schemaAction = createAsyncFormActions()

  state: IStandardTableState = {
    current: 1,
    pageSize: 10,
    totalPage: DEFAULT_TOTAL_PAGE,
    tableLoading: false,
    queryParams: {},
    dataSource: [],
    // 默认引用一份columns
    dataColumns: this.props.columns as any,
    tableHeight: 0,
  }

  private observer: MutationObserver | null = null

  private calculateTableHeight = () => {
    const MIN_HEIGHT = 380
    const layoutContent = document.getElementById('layout-content')
    const pageHeaderMain = document.getElementById('page-header-main')
    // 可视取区域高度 page-header-main + (padding-top: 16 + padding-bottom: 16)
    const one = (pageHeaderMain?.clientHeight || layoutContent?.clientHeight || 0) - (16 + 16)
    // god-standard-table-form-controller
    const controllerElement = document.getElementsByClassName('god-standard-table-form-controller')[0]
    const two = controllerElement?.clientHeight || 0
    // footer Copy Right
    // const footer = (document.getElementsByTagName('footer')[0]?.clientHeight || 0);
    // 改了布局目前滚动区域不包含底部 Copy Right
    const footer = 0
    // (ant-card-body padding-top: 16 + padding-bottom: 16) + footer
    const three = 16 + 16 + footer
    // ant-table-thead
    const four = document.getElementsByClassName('ant-table-thead')[0]?.clientHeight || 0
    // ant-table-pagination + margin-top: 16
    const pagination = (document.getElementsByClassName('ant-table-pagination')[0]?.clientHeight || 0) + 16
    // 计算出可用高度 - 4 计算结果之间误差填补保障不出现双滚动条
    const height = one - two - three - four - pagination - 4

    this.setState({ tableHeight: height > MIN_HEIGHT ? height : MIN_HEIGHT })
  }

  componentDidMount() {
    // 添加表格高度计算逻辑
    if (this.props.autoScrollY) {
      // 初始计算
      this.calculateTableHeight()
      // 添加 resize 事件监听
      window.addEventListener('resize', this.calculateTableHeight)
      // 使用 MutationObserver 监听 DOM 变化
      this.observer = new MutationObserver((mutations) => {
        this.calculateTableHeight()
      })
      const config = {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class'],
      }
      // 监听所有相关元素
      const elements = [
        document.getElementById('page-header-main'),
        document.getElementsByClassName('god-standard-table-form-controller')[0],
        document.getElementsByClassName('ant-table-pagination')[0],
        document.getElementsByTagName('footer')[0],
      ].filter(Boolean)
      elements.forEach((element) => {
        if (element) {
          this.observer?.observe(element, config)
        }
      })
    }

    if (this.props.currentRef) {
      // this.props.currentRef.current.reload = this.fetchTableData.bind(this);
      this.props.currentRef.current.reloadCurrent = (params) => {
        const searchParam = {
          ...this.queryParams,
          ...params,
          current: this.state.current,
        }
        this.fetchTableData(searchParam)
      }
      this.props.currentRef.current.reload = (params) => {
        this.setState({
          current: 1,
        })
        const searchParam = {
          ...this.queryParams,
          ...params,
          current: 1,
        }
        this.fetchTableData(searchParam)
      }
      // 将上层actions暴露, 只有在使用内置formily时才可使用
      this.props.currentRef.current.formActions = this.schemaAction
      this.props.currentRef.current.resetField = this.schemaAction.reset
      this.props.currentRef.current.schemaAction = this.schemaAction
    }

    if (this.props.keepAlive) {
      const pathname = window.location.pathname
      const paginationInfo: currentStateType = getCurrentState()
      if (paginationInfo) {
        if (paginationInfo.pathname === pathname) {
          this.setState(
            {
              current: paginationInfo.current,
              pageSize: paginationInfo.pageSize,
              queryParams: paginationInfo.queryParams || {},
            },
            () => {
              this.schemaAction.setFormState((state) => (state.values = paginationInfo.queryParams))
              this.fetchTableData()
            },
          )
          return
        }
      }
    }

    // 页面默认渲染一次远程table数据
    this.fetchTableData()
  }

  componentDidUpdate(prevProps: IStandardTableProps<any>) {
    // 引用发生改变时才会触发columns的变更
    if (prevProps.columns !== this.props.columns) {
      this.setState({
        dataColumns:
          typeof this.props.formatMessage === 'function'
            ? this.props.columns.map((v) => {
                v.title = this.props.formatMessage({ id: v.title })
                return v
              })
            : this.props.columns,
      })
    }
  }

  componentWillUnmount() {
    if (this.props.autoScrollY) {
      window.removeEventListener('resize', this.calculateTableHeight)
      if (this.observer) {
        this.observer.disconnect()
        this.observer = null
      }
    }
  }

  // 分页查询触发 TODO
  handleTableChange(pagination: ITablePagination) {
    const { current, pageSize } = pagination
    const { current: prevCurrent, pageSize: prevPageSize } = this.state
    if (prevCurrent === current && prevPageSize === pageSize) {
      // 页码没有更新， 不做请求
      return
    }
    this.setState(
      {
        current: current,
        pageSize,
      },
      () => {
        this.fetchTableData({ ...this.queryParams, current, pageSize })
      },
    )
  }

  // 双击表格触发事件 TODO
  onRowDoubleClick() {}

  // 发起表格数据请求 TODO
  async fetchTableData(queryParams = {}, collectForm: boolean = true) {
    this.queryParams = queryParams
    // 自定义时的所有参数
    const { values = {} } =
      this.props.controlRender || !this.props.formilyProps ? {} : await this.schemaAction.getFormState()
    if (typeof this.props.fetchTableData === 'function') {
      this.setState({
        tableLoading: true,
      })
      const { pageSize, current } = this.state
      // 是否自动收集上方表单数据, 默认开启
      const collects = collectForm ? { ...values } : {}

      // 由于无法让外部组件重置 table的状态， 只能通过session通信解决
      // @todo 但不是一个好的解决方案
      if (isResetParams()) {
        this.resetTableData()
        return
      }
      const params = {
        ...this.state.queryParams,
        ...queryParams,
        ...collects,
        current: current,
        pageSize,
      }

      try {
        if (this.props.keepAlive) {
          saveCurrentState(current, pageSize, {
            ...this.state.queryParams,
            ...queryParams,
            ...collects,
            current,
            pageSize,
          })
        }

        const result = await this.props.fetchTableData(params)
        // 切换过页码， 但返回的数据为空数组, 一般出现在删除最后一项时出现, 需回溯到上一页的数据
        if (current > 1 && Array.isArray(result.data) && result.data.length === 0) {
          this.setState(
            {
              current: this.state.current - 1,
            },
            async () => {
              const subResult = await this.fetchTableData(queryParams)
              return subResult
            },
          )
        } else {
          this.setState({
            tableLoading: false,
            totalPage: result?.totalCount || DEFAULT_TOTAL_PAGE,
            dataSource: result?.data || [],
          })
          return result
        }
      } catch (err) {
        this.setState({
          tableLoading: false,
        })
        return Promise.reject(err)
      }
    } else {
      return {
        data: [],
        message: '',
        code: 200,
      }
    }
  }

  // 当存在tab切换时的表格  TODO
  handleChangeTableData() {}

  // 重置表格数据
  resetTableData() {
    this.setState(
      {
        current: 1,
        queryParams: {},
      },
      () => {
        sessionStorage.removeItem('tableRest')
        if (this.props.keepAlive) {
          clearCurrentState()
        }
        this.fetchTableData()
      },
    )
  }

  resetTablagePage() {
    return new Promise<void>((resolve) => {
      this.setState(
        {
          current: 1,
        },
        () => {
          resolve()
        },
      )
    })
  }

  render() {
    const {
      scroll,
      rowSelection,
      loading,
      // formFilters,
      // formAlign,
      controlRender,
      formilyChilds,
      formilyProps,
      formilyLayouts,
      formRender,
      className,
      tableType = 'normal',
      onRowDoubleClick = () => {},
      pagination,
      autoScrollY = true,
    } = this.props
    const { current, pageSize, totalPage, dataSource, dataColumns, tableLoading, tableHeight } = this.state

    const { onChange, ...resetProps } = this.props.tableProps

    const paginationProps: TablePaginationConfig = {
      simple: tableType === 'small',
      showSizeChanger: true,
      showQuickJumper: true,
      size: 'small',
      current: current,
      pageSize: pageSize,
      pageSizeOptions: ['10', '20', '50', '100'],
      total: totalPage,
      showTotal: () => intl.formatMessage({ id: 'componnets.standardTablePages', totalPage }),
      ...pagination,
    }

    const formCtlRender = controlRender ? (
      controlRender
    ) : (
      <div className="god-table-control">
        <TableController
          // parentRef={this.props.currentRef}
          schemaActions={this.schemaAction}
          // formFilters={formFilters}
          resetTableData={this.resetTableData.bind(this)}
          fetchTableData={(queryParams) => this.fetchTableData(queryParams)}
          resetTablagePage={this.resetTablagePage.bind(this)}
          // formAlign={formAlign}
          formilyChilds={formilyChilds}
          formilyProps={formilyProps}
          formilyLayouts={formilyLayouts}
        />
      </div>
    )
    return (
      <div className={cx('god-standard-table', className)}>
        {/* table控制层 */}
        {formRender
          ? formRender(
              formCtlRender,
              <Pagination
                {...paginationProps}
                onChange={(page, formPageSize) => {
                  this.handleTableChange({ current: page, pageSize: formPageSize })
                  if (onChange) {
                    onChange({ current: page, pageSize: formPageSize })
                  }
                }}
              />,
            )
          : formCtlRender}

        {/* table内容层 */}
        <div className="god-table-content">
          <Table
            size="small"
            columns={dataColumns}
            // scroll={scroll}
            loading={loading || tableLoading}
            rowSelection={rowSelection || null}
            // fix 使用index参数不一定能按照预想的效果, antd 会报出警告
            rowKey={this.props.rowKey || ((record) => record.id)}
            dataSource={dataSource}
            pagination={tableType === 'normal' ? paginationProps : false}
            onChange={(tablePagination, filter, sort, extra) => {
              this.handleTableChange(tablePagination)
              if (onChange) {
                onChange(tablePagination, filter, sort, extra)
              }
            }}
            onRow={(record) => {
              return {
                onDoubleClick: () => onRowDoubleClick(record),
              }
            }}
            {...resetProps}
            scroll={{ x: scroll?.x || resetProps?.scroll?.x || null, y: autoScrollY ? tableHeight : undefined }}
          />
        </div>
      </div>
    )
  }
}

export default StandardTable
