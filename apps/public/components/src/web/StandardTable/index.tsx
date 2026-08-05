import React, { useMemo, useImperativeHandle, useRef, useContext, useEffect, useCallback } from 'react'
import classNames from 'classnames'
import { Table, Card } from '@linkseeks/ui'
import { stringify } from 'use-json-comparison'
import type { TableProps, TablePaginationConfig } from 'antd/lib/table'
import type { ColumnType, GetRowKey } from 'antd/lib/table/interface'
import { useIntl } from '@linkseeks/i18n'
import { ITableControllerRef } from './TableController'
import {
  ActionType,
  ComponentTypes,
  IStandardTableProps,
  PageInfo,
  RequestData,
  TableRowSelection,
  UseFetchDataAction,
} from './typing'
import {
  editableRowByKey,
  genColumnKey,
  isBordered,
  mergePagination,
  omitUndefined,
  parseDefaultColumnConfig,
  recordKeyToString,
  useActionType,
} from './utils'
import useFetchData from './useFetchData'
import { Container, TableContext } from './Provide'
import { useMountMergeState } from './hooks/useMountMergeState'
import { useEditableArray } from './hooks/useEditableArray'
import { useDeepCompareEffect, useDeepCompareEffectDebounce } from './hooks/useDeepCompareEffect'
import FormRender from './components/FormRender'
import './index.less'

function TableRender<T extends Record<string, any>, ValueType>(
  props: IStandardTableProps<T, ValueType> & {
    action: UseFetchDataAction<any>
    tableColumn: any[]
    // toolbarDom: JSX.Element | null
    searchNode: JSX.Element | null
    // alertDom: JSX.Element | null
    // onSortChange: (sort: any) => void
    // onFilterChange: (sort: any) => void
    editableUtils: any
    getRowKey: GetRowKey<any>
  },
) {
  const {
    rowKey,
    tableClassName,
    action,
    tableColumn: tableColumns,
    type,
    pagination,
    rowSelection,
    size,
    defaultSize,
    tableStyle,
    // toolbarDom,
    searchNode,
    style,
    // alertDom,
    name,
    // onSortChange,
    // onFilterChange,
    // options,
    className,
    editableUtils,
    getRowKey,
    ...rest
  } = props
  const counter = useContext(TableContext)

  /** 需要遍历一下，不然不支持嵌套表格 */
  const columns = useMemo(() => {
    const loopFilter = (column: any[]): any[] => {
      return column
        .map((item) => {
          // 删掉不应该显示的
          const columnKey = genColumnKey(item.key, item.index)
          const config = counter.columnsMap[columnKey]
          if (config && config.show === false) {
            return false
          }
          if (item.children) {
            return {
              ...item,
              children: loopFilter(item.children),
            }
          }
          return item
        })
        .filter(Boolean)
    }
    return loopFilter(tableColumns)
  }, [counter.columnsMap, tableColumns])

  /** 如果所有列中的 filters = true | undefined 说明是用的是本地筛选 任何一列配置 filters=false，就能绕过这个判断 */
  const useLocaleFilter = useMemo(() => {
    const _columns: any[] = []
    // 平铺所有columns, 用于判断是用的是本地筛选
    const loopColumns = (data: any[]) => {
      for (let i = 0; i < data.length; i++) {
        const _curItem = data[i]
        if (_curItem.children) {
          loopColumns(_curItem.children)
        } else {
          _columns.push(_curItem)
        }
      }
    }
    loopColumns(columns)
    return _columns?.every((column) => {
      return (!!column.filters && !!column.onFilter) || (column.filters === undefined && column.onFilter === undefined)
    })
  }, [columns])

  /**
   * 如果是分页的新增，总是加到最后一行
   *
   * @returns
   */
  const editableDataSource = (dataSource: any[]): T[] => {
    const { options: newLineOptions, defaultValue: row } = editableUtils.newLineRecord || {}
    const isNewLineRecordAtTop = newLineOptions?.position === 'top'
    if (newLineOptions?.parentKey) {
      const actionProps = {
        data: dataSource,
        getRowKey: getRowKey,
        row: {
          ...row,
          map_row_parentKey: recordKeyToString(newLineOptions.parentKey)?.toString(),
        },
        key: newLineOptions?.recordKey,
        childrenColumnName: props.expandable?.childrenColumnName || 'children',
      }

      return editableRowByKey(actionProps, isNewLineRecordAtTop ? 'top' : 'update')
    }

    if (isNewLineRecordAtTop) {
      return [row, ...action.dataSource]
    }
    // 如果有分页的功能，我们加到这一页的末尾
    if (pagination && pagination?.current && pagination?.pageSize) {
      const newDataSource = [...action.dataSource]
      if (pagination?.pageSize > newDataSource.length) {
        newDataSource.push(row)
        return newDataSource
      }
      newDataSource.splice(pagination?.current * pagination?.pageSize - 1, 0, row)
      return newDataSource
    }

    return [...action.dataSource, row]
  }

  const getTableProps = () => ({
    ...rest,
    size,
    rowSelection: rowSelection ? undefined : rowSelection,
    className: classNames('standard-table', tableClassName),
    style: tableStyle,
    columns: columns.map((item) => (item.isExtraColumns ? item.extraColumn : item)),
    loading: action.loading,
    dataSource: editableUtils.newLineRecord ? editableDataSource(action.dataSource) : action.dataSource,
    pagination,
    onChange: (
      changePagination: TablePaginationConfig,
      filters: Record<string, (React.Key | boolean)[] | null>,
      sorter: any,
      extra: any, //TableCurrentDataSource<T>,
    ) => {
      rest.onChange?.(changePagination, filters, sorter, extra)
      if (!useLocaleFilter) {
        // onFilterChange(omitUndefined<any>(filters))
      }

      // 制造筛选的数据
      // 制造一个排序的数据
      // if (Array.isArray(sorter)) {
      //   const data = sorter.reduce<Record<string, any>>(
      //     (pre, value) => ({
      //       ...pre,
      //       [`${value.field}`]: value.order,
      //     }),
      //     {},
      //   );
      //   onSortChange(omitUndefined<any>(data));
      // } else {
      //   const sorterOfColumn = sorter.column?.sorter;
      //   const isSortByField = sorterOfColumn?.toString() === sorterOfColumn;

      //   onSortChange(
      //     omitUndefined({
      //       [`${isSortByField ? sorterOfColumn : sorter.field}`]:
      //         sorter.order as SortOrder,
      //     }),
      //   );
      // }
    },
  })

  /**
   * 是否需要 card 来包裹
   */
  const notNeedCardDom = useMemo(() => {
    if (props.search === false) {
      return true
    }
    return false
  }, [])

  /** 默认的 table dom，如果是编辑模式，外面还要包个 form */
  const tableDom = <Table<T> {...getTableProps()} rowKey={rowKey} />

  /**
   * 这段代码使用了 useMemo 进行了性能优化，根据 props.editable 和 props.name 的不同情况，渲染不同的页面组件。
   * 当 props.editable 为 true 并且 props.name 不存在时，渲染一个带有表单和工具栏的页面组件，否则只渲染工具栏和表格组件。
   * renderContent 函数会在 alertDom、props.loading、props.editable、tableDom、toolbarDom 发生变化时重新执行。
   * */
  const tableContentDom = useMemo(() => {
    if (props.editable && !props.name) {
      return (
        <>
          {/* {toolbarDom}
          {alertDom} */}
          {/* <ProForm
            {...props.editable?.formProps}
            formRef={props.editable?.formProps?.formRef as any}
            component={false}
            form={props.editable?.form}
            onValuesChange={editableUtils.onValuesChange}
            key="table"
            submitter={false}
            omitNil={false}
            dateFormatter={props.dateFormatter}
          >
            {tableDom}
          </ProForm> */}
          {searchNode}
          {tableDom}
        </>
      )
    }

    return (
      <>
        {searchNode}
        {/* {toolbarDom}
        {alertDom} */}
        {tableDom}
      </>
    )
  }, [props.loading, !!props.editable, tableDom])

  const cardBodyStyle = useMemo(() => {
    if (notNeedCardDom === true || !!props.name) return {}

    if (pagination === false) {
      return {
        paddingBlockStart: 0,
      }
    }
    return {
      padding: 16,
    }
  }, [notNeedCardDom, pagination, props.name])

  /** Table 区域的 dom，为了方便 render */
  const tableAreaDom =
    // cardProps 或者 有了name 就不需要这个padding了，不然会导致不好对齐
    notNeedCardDom === true || !!props.name ? (
      tableContentDom
    ) : (
      <Card bodyStyle={cardBodyStyle} className="standard-table-card">
        {tableContentDom}
      </Card>
    )

  const proTableDom = (
    <div
      className={classNames(className, {
        [`standard-table-polling`]: action.pollingLoading,
      })}
      style={style}
      ref={counter.rootDomRef}
    >
      {type !== 'form' && tableAreaDom}
    </div>
  )

  return proTableDom
}

const emptyObj = {}

const ProTable = <T extends Record<string, any>, ValueType>(props: IStandardTableProps<T, ValueType>) => {
  const {
    currentRef: propsActionRef,
    fetchTableData,
    className,
    tableType,
    params = emptyObj,
    defaultData,
    // headerTitle,
    postData,
    // ghost,
    pagination: propsPagination,
    columns: propsColumns = [],
    // toolBarRender,
    onLoad,
    onRequestError,
    // style,
    // cardProps,
    // tableStyle,
    // tableClassName,
    // options,
    toolbar,
    search,
    name: isEditorTable,
    onLoadingChange,
    rowSelection: propsRowSelection = false,
    beforeSearchSubmit,
    // tableAlertRender,
    formRef: propRef,
    type = 'table',
    columnEmptyText = '-',
    // toolbar,
    rowKey,
    manualRequest,
    polling,
    // tooltip,
    revalidateOnFocus = false,
  } = props

  const intl = useIntl()
  const counter = useContext(TableContext)

  /** 通用的来操作子节点的工具类 */
  const actionRef = useRef<ActionType>()
  const defaultFormRef = useRef()
  const formRef = propRef || defaultFormRef

  /** 单选多选的相关逻辑 */
  const [selectedRowKeys, setSelectedRowKeys] = useMountMergeState<(string | number)[] | undefined>(
    propsRowSelection ? propsRowSelection?.defaultSelectedRowKeys || [] : undefined,
    {
      value: propsRowSelection ? propsRowSelection.selectedRowKeys : undefined,
    },
  )

  const [formSearch, setFormSearch] = useMountMergeState<Record<string, any> | undefined>(() => {
    // 如果手动模式，或者 search 不存在的时候设置为 undefined
    // undefined 就不会触发首次加载
    if (manualRequest || search !== false) {
      return undefined
    }
    return {}
  })

  const [proFilter, setProFilter] = useMountMergeState<Record<string, (string | number)[] | null>>({})

  /** 设置默认排序和筛选值 */
  useEffect(() => {
    const { sort, filter } = parseDefaultColumnConfig(propsColumns)
    setProFilter(filter)
  }, [])

  useImperativeHandle(propsActionRef, () => actionRef.current)

  // ============================ useFetchData ============================
  const fetchData = useMemo(() => {
    if (!fetchTableData) return undefined
    return async (pageParams?: Record<string, any>) => {
      const actionParams = {
        ...(pageParams || {}),
        ...formSearch,
        ...params,
      }

      // eslint-disable-next-line no-underscore-dangle
      delete (actionParams as any)._timestamp
      const response = await fetchTableData(actionParams as unknown as Record<string, any>)
      return response as RequestData<T>
    }
  }, [fetchTableData])

  /** 需要初始化 不然默认可能报错 这里取了 defaultCurrent 和 current 为了保证不会重复刷新 */
  const fetchPagination =
    typeof propsPagination === 'object'
      ? (propsPagination as TablePaginationConfig)
      : { defaultCurrent: 1, defaultPageSize: 10, pageSize: 10, current: 1 }

  const action = useFetchData(fetchData, defaultData, {
    pageInfo: propsPagination === false ? false : fetchPagination,
    loading: props.loading,
    dataSource: props.dataSource,
    onDataSourceChange: props.onDataSourceChange,
    onLoad,
    onLoadingChange,
    onRequestError,
    postData,
    revalidateOnFocus,
    manual: false, // formSearch === undefined,
    polling,
    effects: [
      stringify(params),
      stringify(formSearch),
      // stringify(proFilter),
      // stringify(proSort),
    ],
    debounceTime: props.debounceTime,
    onPageInfoChange: (pageInfo) => {
      if (!propsPagination || !fetchData) return
      //   // 总是触发一下 onChange 和  onShowSizeChange
      //   // 目前只有 List 和 Table 支持分页, List 有分页的时候打断 Table 的分页
      propsPagination?.onChange?.(pageInfo.current, pageInfo.pageSize)
      propsPagination?.onShowSizeChange?.(pageInfo.current, pageInfo.pageSize)
    },
  })

  /** 默认聚焦的时候重新请求数据，这样可以保证数据都是最新的。 */
  useEffect(() => {
    // 手动模式和 fetchTableData 为空都不生效
    if (
      props.manualRequest ||
      !props.fetchTableData ||
      !revalidateOnFocus
      // props.form?.ignoreRules
    ) {
      return
    }

    // 聚焦时重新请求事件
    const visibilitychange = () => {
      if (document.visibilityState === 'visible') {
        action.reload()
      }
    }

    document.addEventListener('visibilitychange', visibilitychange)
    return () => document.removeEventListener('visibilitychange', visibilitychange)
  }, [])

  /** SelectedRowKeys受控处理selectRows */
  const preserveRecordsRef = React.useRef(new Map<any, T>())

  // ============================ RowKey ============================
  const getRowKey = React.useMemo<GetRowKey<any>>(() => {
    if (typeof rowKey === 'function') {
      return rowKey
    }
    return (record: T, index?: number) => {
      if (index === -1) {
        return (record as any)?.[rowKey as string]
      }
      // 如果 props 中有name 的话，用index 来做行号，这样方便转化为 index
      if (props.name) {
        return index?.toString()
      }
      return (record as any)?.[rowKey as string] ?? index?.toString()
    }
  }, [props.name, rowKey])

  useMemo(() => {
    if (action.dataSource?.length) {
      const keys = action.dataSource.map((data) => {
        const dataRowKey = getRowKey(data, -1)
        preserveRecordsRef.current.set(dataRowKey, data)
        return dataRowKey
      })
      return keys
    }
    return []
  }, [action.dataSource, getRowKey])

  /** 可编辑行的相关配置 */
  const editableUtils = useEditableArray<any>({
    ...props.editable,
    tableName: props.name,
    getRowKey,
    childrenColumnName: props.expandable?.childrenColumnName || 'children',
    dataSource: action.dataSource || [],
    setDataSource: (data) => {
      props.editable?.onValuesChange?.(undefined as any, data)
      action.setDataSource(data)
    },
  })

  /** 绑定 action */
  useActionType(actionRef, action, {
    onCleanSelected: () => {
      // 清空选中行
      onCleanSelected()
    },
    resetAll: () => {
      // 清空选中行
      onCleanSelected()
      // 清空筛选
      setProFilter({})
      // 清空排序
      // setProSort({});
      // 清空 toolbar 搜索
      // counter.setKeyWords(undefined);
      // 重置页码
      action.setPageInfo({
        current: 1,
      })

      // 重置表单
      formRef?.current?.resetFields()
      setFormSearch({})
    },
  })

  /** 行选择相关的问题 */
  const rowSelection: TableRowSelection = {
    selectedRowKeys,
    ...propsRowSelection,
    onChange: (keys, rows, info) => {
      if (propsRowSelection && propsRowSelection.onChange) {
        propsRowSelection.onChange(keys, rows, info)
      }
      setSelectedRowKeys(keys)
    },
  }

  // ---------- 列计算相关 start  -----------------
  const tableColumn = useMemo(() => {
    return propsColumns
    // return genProColumnToColumn<T>({
    //   columns: propsColumns,
    //   counter,
    //   columnEmptyText,
    //   type,
    //   marginSM: token.marginSM,
    //   editableUtils,
    //   rowKey,
    //   childrenColumnName: props.expandable?.childrenColumnName,
    // }).sort(columnSort(counter.columnsMap));
  }, [
    propsColumns,
    counter?.sortKeyColumns,
    counter?.columnsMap,
    columnEmptyText,
    type,
    editableUtils.editableKeys && editableUtils.editableKeys.join(','),
  ])

  /** Table Column 变化的时候更新一下，这个参数将会用于渲染 */
  useDeepCompareEffectDebounce(
    () => {
      if (tableColumn && tableColumn.length > 0) {
        // 重新生成key的字符串用于排序
        const columnKeys = tableColumn.map((item) => genColumnKey(item.key, item.index))
        counter.setSortKeyColumns(columnKeys)
      }
    },
    [tableColumn],
    ['render', 'renderFormItem'],
    100,
  )

  /** 同步 Pagination，支持受控的 页码 和 pageSize */
  useDeepCompareEffect(() => {
    const { pageInfo } = action
    const { current = pageInfo?.current, pageSize = pageInfo?.pageSize } = propsPagination || {}
    if (
      propsPagination &&
      (current || pageSize) &&
      (pageSize !== pageInfo?.pageSize || current !== pageInfo?.current)
    ) {
      action.setPageInfo({
        pageSize: pageSize || pageInfo.pageSize,
        current: current || pageInfo.current,
      })
    }
  }, [propsPagination && propsPagination.pageSize, propsPagination && propsPagination.current])

  /** 页面编辑的计算 */
  const pagination = useMemo(() => {
    const newPropsPagination = propsPagination === false ? false : { ...propsPagination }
    const pageConfig: UseFetchDataAction<T>['pageInfo'] & {
      setPageInfo: any
    } = {
      ...action.pageInfo,
      simple: tableType === 'small',
      showSizeChanger: true,
      showQuickJumper: true,
      size: 'default',
      pageSizeOptions: ['10', '20', '50', '100'],
      setPageInfo: ({ pageSize, current }: PageInfo) => {
        const { pageInfo } = action
        // pageSize 发生改变，并且你不是在第一页，切回到第一页
        // 这样可以防止出现 跳转到一个空的数据页的问题
        if (pageSize === pageInfo.pageSize || pageInfo.current === 1) {
          action.setPageInfo({ pageSize, current })
          return
        }

        // 通过fetchTableData的时候清空数据，然后刷新不然可能会导致 pageSize 没有数据多
        if (fetchTableData) action.setDataSource([])
        action.setPageInfo({
          pageSize,
          // 目前只有 List 和 Table 支持分页, List 有分页的时候 还是使用之前的当前页码
          current: type === 'list' ? current : 1,
        })
      },
    }
    if (fetchTableData && newPropsPagination) {
      delete newPropsPagination.onChange
      delete newPropsPagination.onShowSizeChange
    }
    return mergePagination<T>(newPropsPagination, pageConfig, intl)
  }, [propsPagination, action, intl])

  useDeepCompareEffect(() => {
    // fetchTableData 存在且params不为空，且已经请求过数据才需要设置。
    if (props.fetchTableData && params && action.dataSource && action?.pageInfo?.current !== 1) {
      action.setPageInfo({
        current: 1,
      })
    }
  }, [params])

  // 设置 name 到 store 中，里面用了 ref ，所以不用担心直接 set
  counter.setPrefixName(props.name)

  /** 清空所有的选中项 */
  const onCleanSelected = useCallback(() => {
    if (propsRowSelection && propsRowSelection.onChange) {
      propsRowSelection.onChange([], [], {
        type: 'none',
      })
    }
    setSelectedRowKeys([])
  }, [propsRowSelection, setSelectedRowKeys])

  counter.setAction(actionRef.current)
  counter.propsRef.current = props as any

  const loading = useMemo(() => {
    if (typeof action.loading === 'object') {
      return action.loading?.spinning || false
    }
    return action.loading
  }, [action.loading])

  const searchNode =
    search === false && type !== 'form' ? null : (
      <FormRender
        action={actionRef}
        columns={propsColumns}
        toolbar={toolbar}
        onReset={props.onReset}
        onSubmit={props.onSubmit}
        loading={!!loading}
        type={props.type || 'table'}
      />
    )
  // search === false && type !== 'form' ? null : (
  // 	<FormRender<T, U>
  // 		pagination={pagination}
  // 		beforeSearchSubmit={beforeSearchSubmit}
  // 		action={actionRef}
  // 		columns={propsColumns}
  // 		onFormSearchSubmit={(values) => {
  // 			onFormSearchSubmit(values);
  // 		}}
  // 		ghost={ghost}
  // 		onReset={props.onReset}
  // 		onSubmit={props.onSubmit}
  // 		loading={!!loading}
  // 		manualRequest={manualRequest}
  // 		search={search}
  // 		form={props.form}
  // 		formRef={formRef}
  // 		type={props.type || 'table'}
  // 		cardBordered={props.cardBordered}
  // 		dateFormatter={props.dateFormatter}
  // 	/>
  // );

  return (
    <TableRender
      {...props}
      name={isEditorTable}
      size={counter.tableSize}
      onSizeChange={counter.setTableSize}
      pagination={pagination}
      searchNode={searchNode}
      rowSelection={propsRowSelection !== false ? rowSelection : undefined}
      className={className}
      tableColumn={tableColumn}
      action={action}
      // alertDom={alertDom}
      // toolbarDom={toolbarDom}
      // onSortChange={(sortConfig) => {
      //   // if (proSort === sortConfig) return;
      //   // setProSort(sortConfig);
      // }}
      // onFilterChange={(filterConfig) => {
      //   // if (filterConfig === proFilter) return;
      //   // setProFilter(filterConfig);
      // }}
      editableUtils={editableUtils}
      getRowKey={getRowKey}
    />
  )
}

const StandardTable = <RecordType extends Record<string, any>, ValueType = 'text'>(
  props: IStandardTableProps<RecordType, ValueType>,
) => {
  return (
    <Container initValue={props as any}>
      <ProTable<RecordType, ValueType> {...props} />
    </Container>
  )
}

export default StandardTable
