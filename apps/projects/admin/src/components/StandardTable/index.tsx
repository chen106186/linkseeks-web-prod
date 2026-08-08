import React, { PureComponent, RefObject, useRef, ReactNode } from 'react'
import { Table, Pagination } from 'antd'
import TableController, { FormilyCustomProps } from './TableController'

import styles from './index.less'
import { TableProps, TablePaginationConfig } from 'antd/lib/table'
import { TableRowSelection, ColumnType } from 'antd/lib/table/interface'
import { ITableControllerRef } from './TableController'
import { getCurrentState, saveCurrentState, currentStateType, clearCurrentState } from './helper'
import { createAsyncFormActions } from '@apps/formily'

export type tableTypes = 'small' | 'normal'

export interface IQueryParams {
  keywords?: string
  [key: string]: any
}

export interface ITablePagination {
  current?: number
  pageSize?: number
}

export interface IStandardTableProps<RecordType> extends TableProps<RecordType>, FormilyCustomProps {
  onRowDoubleClick?: (record: TableRowSelection<RecordType>) => {}

  /**
   * @description 引入的实例
   * @type {RefObject<T>}
   * @memberof ITableControllerProps
   */
  currentRef?: RefObject<ITableControllerRef> | { current: any }
  // formFilters?: Array<IFormFilter>;
  controlRender?: React.ReactNode
  fetchTableData?(queryParams?: any): Promise<any>
  // 可在上方的表单前后增加jsx元素, children为formily元素， pagination为自定义分页器
  formRender?: (children: ReactNode, pagination?: ReactNode) => ReactNode
  // 可配置的table属性， 用于覆盖默认table配置
  tableProps?: any
  /**引入可配置的国际化 */
  formatMessage?(params?: any): string
  // 引入可修改的form布局
  // formAlign?: 'left' | 'right';
  // 当值为small时，会将分页器隐藏
  tableType?: tableTypes
  // 是否开启记录页码状态和筛选状态
  keepAlive?: boolean
}

export interface IStandardTableState {
  current: number
  pageSize: number
  totalPage: number
  queryParams: IQueryParams
  tableLoading: boolean
  dataSource: Array<any>
  dataColumns: ColumnType<any>[]
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
  }

  // 查询关键词的快照
  queryParams = {}

  // 在实例上绑定action, 避免多个表格时，共用同一个actions
  schemaAction = createAsyncFormActions()

  state = {
    current: 1,
    pageSize: 10,
    totalPage: DEFAULT_TOTAL_PAGE,
    tableLoading: false,
    queryParams: {},
    dataSource: [],
    // 默认引用一份columns
    dataColumns: this.props.columns,
  }

  componentDidMount() {
    if (this.props.currentRef) {
      this.props.currentRef.current.reload = this.fetchTableData.bind(this)
      // 将上层actions暴露, 只有在使用内置formily时才可使用
      this.props.currentRef.current.formActions = this.schemaAction
      this.props.currentRef.current.resetField = this.schemaAction.reset
      this.props.currentRef.current.schemaAction = this.schemaAction
    }

    if (this.props.keepAlive) {
      let pathname = window.location.pathname
      let paginationInfo: currentStateType = getCurrentState()
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
        this.fetchTableData(this.queryParams)
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
        current: current,
        pageSize,
        ...this.state.queryParams,
        ...queryParams,
        ...collects,
      }

      try {
        if (this.props.keepAlive) {
          saveCurrentState(current, pageSize, {
            ...this.state.queryParams,
            ...queryParams,
            ...collects,
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
            totalPage: result.totalCount || DEFAULT_TOTAL_PAGE,
            dataSource: result.data || [],
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
    return new Promise((resolve) => {
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
      tableType = 'normal',
      onRowDoubleClick = () => {},
      pagination,
    } = this.props
    const { current, pageSize, totalPage, dataSource, dataColumns, tableLoading } = this.state

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
      showTotal: () => `共 ${totalPage} 条`,
      ...pagination,
    }

    const formCtlRender = controlRender ? (
      controlRender
    ) : (
      <div className={styles['god-table-control']}>
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
      <div className={styles['god-standard-table']}>
        {/* table控制层 */}
        {formRender
          ? formRender(
              formCtlRender,
              <Pagination
                {...paginationProps}
                onChange={(page, pageSize) => {
                  this.handleTableChange({ current: page, pageSize })
                  onChange && onChange({ current: page, pageSize })
                }}
              />,
            )
          : formCtlRender}

        {/* table内容层 */}
        <div className="god-table-content">
          <Table
            columns={dataColumns}
            scroll={scroll}
            loading={loading || tableLoading}
            rowSelection={rowSelection || null}
            // fix 使用index参数不一定能按照预想的效果, antd 会报出警告
            rowKey={this.props.rowKey || ((record) => record.id)}
            dataSource={dataSource}
            pagination={tableType === 'normal' ? paginationProps : false}
            onChange={(pagination, filter, sort, extra) => {
              this.handleTableChange(pagination)
              onChange && onChange(pagination, filter, sort, extra)
            }}
            onRow={(record) => {
              return {
                onDoubleClick: () => onRowDoubleClick(record),
              }
            }}
            {...resetProps}
          />
        </div>
      </div>
    )
  }
}

export default StandardTable
