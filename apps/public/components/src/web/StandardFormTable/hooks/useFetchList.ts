import { usePagination, useAntdTable } from '@linkseeks/hooks'
import { Service, Data, Params } from '@linkseeks/hooks/usePagination/types'
import { ApiResult } from '@linkseeks/hooks/useRequest/useRequestApi'
import { useIntl } from '@linkseeks/i18n'
import { useFormTable } from '../contexts'
import { useMemo } from 'react'
/**
 * 表格的获取数据方法
 */
const useFetchList = (
  service: Service<ApiResult<Data>, Params>,
  initalValue: any,
  refreshDeps: any = [],
  isCN = false,
) => {
  const { formSearchRef, cacheId, cacheQuery, isCache } = useFormTable()
  const defaultPagination = useMemo(() => {
    if (isCache) {
      const cache = cacheQuery.getCacheData(cacheId)
      return {
        current: cache?.pagination?.current,
        pageSize: cache?.pagination?.pageSize,
      }
    }
  }, [isCache])
  const { pagination, tableProps, search } = useAntdTable<any, any>(service as any, {
    form: formSearchRef,
    defaultParams: [{ ...initalValue }],
    defaultCurrent: defaultPagination?.current,
    defaultPageSize: defaultPagination?.pageSize,
    refreshDeps,
  })
  const intl = useIntl()

  const showTotal = (total: number) =>
    isCN
      ? `共 ${total} 条`
      : intl.formatMessage({
          id: 'componnets.standardTablePages',
          defaultMessage: '共 {{totalPage}} 条',
          totalPage: total,
        })

  return {
    pagination: {
      ...pagination,
      showSizeChanger: false,
      showTotal,
    },
    resetTableProps: {
      size: 'small',
      ...tableProps,
      pagination: {
        style: {
          marginBottom: 0,
        },
        ...tableProps.pagination,
        onChange(current: number, pageSize: number) {
          if (isCache) {
            cacheQuery.setCacheData(cacheId, {
              pagination: {
                current,
                pageSize,
              },
            })
          }
        },
        showTotal,
      },
    },
    searchForm: search,
  }
}

export default useFetchList
