/*
 * @Author: XieZhiXiong
 * @Date: 2020-08-20 16:15:59
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-02 15:44:03
 * @Description: 可以带查询的表格，内置 formily，如果需要其他Form可以传入 customRenderSearchForm 配合 reload() 实现查询
 */
import React, { useState, useEffect, useRef, useImperativeHandle } from 'react'
import { Table, Pagination } from 'antd'
import { PaginationProps } from 'antd/lib/pagination'
import classNames from 'classnames'
import {
  NormalTableRefHandleType,
  NormalTableProps,
  SearchValuesType,
  FetchResponse,
  FetchParamsType,
} from './interface'
import SearchForm from './SearchForm'
import styles from './index.less'

const PAGE_SIZE = 10

const NormalTable: React.ForwardRefRenderFunction<NormalTableRefHandleType, NormalTableProps<{}>> = <T extends {}>(
  props: NormalTableProps<T>,
  ref,
) => {
  const {
    fetchDataSource,
    searchFormProps,
    onSearchSubmit,
    customRenderSearchForm,
    pagination = {},
    paginationPosition = 'bottomRight',
    defaultCurrent,
    defaultPageSize,
    onPaginationChange,
    full,
    renderFootContent,
    ...restProps
  } = props

  const initialCurrent = defaultCurrent || 1
  const initialPageSize = defaultPageSize || PAGE_SIZE

  const [current, setCurrent] = useState(initialCurrent)
  const [pageSize, setPageSize] = useState(initialPageSize)
  // 表单值
  const [searchValues, setSearchValues] = useState<SearchValuesType>({})
  const [loading, setLoading] = useState(false)
  const [tableData, setTableData] = useState<FetchResponse<T>>({
    data: [],
    totalCount: 0,
  })

  const mountedRef = useRef(true)
  // 表单值，请求用
  const extraParamsRef = useRef<SearchValuesType>({})

  const getDataSource = async (params?: FetchParamsType) => {
    if (fetchDataSource && !('dataSource' in props)) {
      setLoading(true)
      const res = await fetchDataSource({
        current,
        pageSize,
        ...extraParamsRef.current,
        ...params,
      })
      if (!mountedRef.current) {
        return
      }
      if (res) {
        setTableData(res)
      }
      setLoading(false)
    }
  }

  useEffect(() => {
    getDataSource()

    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if ('dataSource' in props) {
      setTableData((prevState) => {
        return {
          ...prevState,
          data: props.dataSource as T[],
          totalCount: props.dataSource?.length || 0,
        }
      })
    }
  }, [props.dataSource])

  const handlePaginationChange = (page: number, size?: number) => {
    // 内部自己维护 page、size
    if (!('current' in (pagination as {}))) {
      setCurrent(page)
    }
    if (!('pageSize' in (pagination as {}))) {
      setPageSize(size as number)
    }
    if (onPaginationChange) {
      onPaginationChange(page, size as number)
    }
    getDataSource({ current: page, pageSize: size })
  }

  const reload = (params?: FetchParamsType) => {
    params = params || {}
    const { current, pageSize, ...restParams } = params
    const nextCurrent = 'current' in params ? current : 1
    const nextPageSize = 'pageSize' in params ? pageSize : initialPageSize

    // 这里将剩余的参数保存起来，防止外部传入了 fetchDataSource 后，
    // 当下次改变分页器的时候请求时参数丢失的问题
    extraParamsRef.current = restParams
    setSearchValues(restParams)
    setCurrent(nextCurrent as number)
    if (nextPageSize !== pageSize) {
      setPageSize(nextPageSize as number)
    }
    getDataSource({ current: nextCurrent, pageSize: nextPageSize, ...restParams })
  }

  const handleSearchFormSubmit = (values: SearchValuesType) => {
    extraParamsRef.current = values
    setSearchValues(values)
    setCurrent(1)

    if (onSearchSubmit) {
      onSearchSubmit(values)
    }
    getDataSource({ current: 1, ...values })
  }

  useImperativeHandle(ref, () => ({
    reload,
  }))

  const totalCount = pagination?.total || tableData.totalCount || 0

  const paginationProps: PaginationProps | null = pagination
    ? {
        current: current,
        pageSize: pageSize,
        showSizeChanger: true,
        showQuickJumper: true,
        onChange: handlePaginationChange,
        size: 'small',
        showTotal: () => `共 ${totalCount || 0} 条`,
        ...pagination,
        total: totalCount,
      }
    : null

  const rowKey = restProps.rowKey || 'id'

  const tableCls = classNames(styles['normal-table'], {
    [styles['normal-table-full']]: full,
  })

  const headCls = classNames(styles['normal-table-head'], {
    [styles['normal-table-reverse']]: paginationPosition === 'topLeft',
  })

  const footCls = classNames(styles['normal-table-foot'], {
    [styles['normal-table-reverse']]: paginationPosition === 'bottomLeft',
  })

  const bunkTop = paginationPosition === 'topLeft' || paginationPosition === 'topRight'

  const scroll = Object.assign({}, props.scroll, full ? { y: '100%' } : null)

  return (
    <div className={tableCls}>
      <div className={headCls}>
        <div className={styles['normal-table-head-left']}>
          {searchFormProps && !customRenderSearchForm && (
            <SearchForm value={searchValues} onSubmit={handleSearchFormSubmit} {...searchFormProps} />
          )}
          {customRenderSearchForm && !searchFormProps && customRenderSearchForm()}
        </div>
        {paginationProps && bunkTop && (
          <div className={styles['normal-table-head-right']}>
            <Pagination
              {...paginationProps}
              className={classNames(styles['normal-table-pagination'], paginationProps.className)}
            />
          </div>
        )}
      </div>

      <div className={styles['normal-table-body']}>
        <Table
          loading={loading}
          {...restProps}
          rowKey={rowKey}
          pagination={false}
          dataSource={tableData.data}
          scroll={scroll}
        />
      </div>

      <div className={footCls}>
        <div className={styles['normal-table-foot-left']}>
          {renderFootContent && <div className={styles['normal-table-foot-content']}>{renderFootContent?.()}</div>}
        </div>
        <div className={styles['normal-table-foot-right']}>
          {paginationProps && !bunkTop && (
            <Pagination
              {...paginationProps}
              className={classNames(styles['normal-table-pagination'], paginationProps.className)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

const NormalTableForWard = React.forwardRef<NormalTableRefHandleType, NormalTableProps<any>>(NormalTable)

export default NormalTableForWard
