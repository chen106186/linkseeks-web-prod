import type { TablePaginationConfig } from 'antd'
import { ActionType, Bordered, BorderedType, ProColumnType, ProColumns, RecordKey, UseFetchDataAction } from '../typing'
import { GetRowKey, SortOrder } from 'antd/lib/table/interface'

/**
 * 获取用户的 action 信息
 *
 * @param actionRef
 * @param counter
 * @param onCleanSelected
 */
export function useActionType<T>(
  ref: React.MutableRefObject<ActionType | undefined>,
  action: UseFetchDataAction<T>,
  props: {
    onCleanSelected: () => void
    resetAll: () => void
  },
) {
  /** 这里生成action的映射，保证 action 总是使用的最新 只需要渲染一次即可 */
  const userAction: ActionType = {
    pageInfo: action.pageInfo,
    reload: async (resetPageIndex?: boolean) => {
      // 如果为 true，回到第一页
      if (resetPageIndex) {
        await action.setPageInfo({
          current: 1,
        })
      }
      await action?.reload()
    },
    reloadAndRest: async () => {
      // reload 之后大概率会切换数据，清空一下选择。
      props.onCleanSelected()
      await action.setPageInfo({
        current: 1,
      })
      await action?.reload()
    },
    reset: async () => {
      await props.resetAll()
      await action?.reset?.()
      await action?.reload()
    },
    clearSelected: () => props.onCleanSelected(),
    setPageInfo: (rest) => action.setPageInfo(rest),
  }
  // eslint-disable-next-line no-param-reassign
  ref.current = userAction
}

type PostDataType<T> = (data: T) => T

/**
 * 一个转化的 pipeline 列表
 *
 * @param data
 * @param pipeline
 */
export function postDataPipeline<T>(data: T, pipeline: PostDataType<T>[]) {
  if (pipeline.filter((item) => item).length < 1) {
    return data
  }
  return pipeline.reduce((pre, postData) => {
    return postData(pre)
  }, data)
}

export const isBordered = (borderType: BorderedType, border?: Bordered) => {
  if (border === undefined) {
    return false
  }
  if (typeof border === 'boolean') {
    return border
  }
  return border[borderType]
}

/** 如果是个方法执行一下它 */
export function runFunction<T extends any[]>(valueEnum: any, ...rest: T) {
  if (typeof valueEnum === 'function') {
    return valueEnum(...rest)
  }
  return valueEnum
}

/**
 * 根据 key 和 dataIndex 生成唯一 id
 *
 * @param key 用户设置的 key
 * @param dataIndex 在对象中的数据
 * @param index 序列号，理论上唯一
 */
export const genColumnKey = (key?: string | number, index?: number | string): string => {
  if (key) {
    return Array.isArray(key) ? key.join('-') : key.toString()
  }
  return `${index}`
}

type OmitUndefined<T> = {
  [P in keyof T]: NonNullable<T[P]>
}

export const omitUndefined = <T>(obj: T): OmitUndefined<T> => {
  const newObj = {} as T
  Object.keys(obj || {}).forEach((key) => {
    if (obj[key] !== undefined) {
      newObj[key] = obj[key]
    }
  })
  if (Object.keys(newObj as Record<string, any>).length < 1) {
    return undefined as any
  }
  return newObj as OmitUndefined<T>
}

/**
 * 合并用户 props 和 预设的 props
 *
 * @param pagination
 * @param action
 * @param intl
 */
export function mergePagination<T>(
  pagination: TablePaginationConfig | boolean | undefined,
  pageInfo: UseFetchDataAction<T>['pageInfo'] & {
    setPageInfo: any
  },
  intl: any,
): TablePaginationConfig | false | undefined {
  if (pagination === false) {
    return false
  }

  const { total, current, pageSize, setPageInfo, simple, showSizeChanger, showQuickJumper, size, pageSizeOptions } =
    pageInfo
  const defaultPagination: TablePaginationConfig = typeof pagination === 'object' ? pagination : {}

  return {
    showTotal: (all, range) =>
      `${intl.formatMessage({
        id: 'common.text.common',
        defaultMessage: '共',
      })} ${all} ${intl.formatMessage({
        id: 'common.text.unit.strip',
        defaultMessage: '条',
      })}`,
    total,
    ...(defaultPagination as TablePaginationConfig),
    current: pagination !== true && pagination ? pagination.current ?? current : current,
    pageSize: pagination !== true && pagination ? pagination.pageSize ?? pageSize : pageSize,
    simple,
    showSizeChanger,
    showQuickJumper,
    size,
    pageSizeOptions,
    onChange: (page: number, newPageSize?: number) => {
      const { onChange } = pagination as TablePaginationConfig
      onChange?.(page, newPageSize || 20)
      // pageSize 改变之后就没必要切换页码
      if (newPageSize !== pageSize || current !== page) {
        setPageInfo({ pageSize: newPageSize, current: page })
      }
    },
  }
}

/**
 * 将 ProTable - column - dataIndex 转为字符串形式
 *
 * @param dataIndex Column 中的 dataIndex
 */
function parseDataIndex(dataIndex: ProColumnType['dataIndex']): string | undefined {
  if (Array.isArray(dataIndex)) {
    return dataIndex.join(',')
  }
  return dataIndex?.toString()
}

/**
 * 从 ProColumns 数组中取出默认的排序和筛选数据
 *
 * @param columns ProColumns
 */
export function parseDefaultColumnConfig<T, Value>(columns: ProColumns<T, Value>[]) {
  const filter: Record<string, (string | number)[] | null> = {}
  const sort: Record<string, SortOrder> = {}
  columns.forEach((column) => {
    // 转换 dataIndex
    const dataIndex = parseDataIndex(column.dataIndex)
    if (!dataIndex) {
      return
    }
    // 当 column 启用 filters 功能时，取出默认的筛选值
    if (column.filters) {
      const defaultFilteredValue = column.defaultFilteredValue as (string | number)[]
      if (defaultFilteredValue === undefined) {
        filter[dataIndex] = null
      } else {
        filter[dataIndex] = column.defaultFilteredValue as (string | number)[]
      }
    }
    // 当 column 启用 sorter 功能时，取出默认的排序值
    if (column.sorter && column.defaultSortOrder) {
      sort[dataIndex] = column.defaultSortOrder!
    }
  })
  return { sort, filter }
}

export const recordKeyToString = (rowKey: RecordKey): React.Key => {
  if (Array.isArray(rowKey)) return rowKey.join(',')
  return rowKey
}

/**
 * 使用map 来删除数据，性能一般 但是准确率比较高
 *
 * @param keyProps
 * @param action
 */
export function editableRowByKey<RecordType>(
  keyProps: {
    data: RecordType[]
    childrenColumnName: string
    getRowKey: GetRowKey<RecordType>
    key: RecordKey
    row: RecordType
  },
  action: 'update' | 'top' | 'delete',
) {
  const { getRowKey, row, data, childrenColumnName = 'children' } = keyProps
  const key = recordKeyToString(keyProps.key)?.toString()

  const kvMap = new Map<string, RecordType & { parentKey?: React.Key }>()

  /**
   * 打平这个数组
   *
   * @param records
   * @param parentKey
   */
  function dig(records: RecordType[], map_row_parentKey?: React.Key, map_row_index?: number) {
    records.forEach((record, index) => {
      const eachIndex = (map_row_index || 0) * 10 + index
      const recordKey = getRowKey(record, eachIndex).toString()
      // children 取在前面方便拼的时候按照反顺序放回去
      if (record && typeof record === 'object' && childrenColumnName in record) {
        dig(record[childrenColumnName] || [], recordKey, eachIndex)
      }
      const newRecord = {
        ...record,
        map_row_key: recordKey,
        children: undefined,
        map_row_parentKey,
      }
      delete newRecord.children
      if (!map_row_parentKey) {
        delete newRecord.map_row_parentKey
      }
      kvMap.set(recordKey, newRecord)
    })
  }

  if (action === 'top') {
    kvMap.set(key, {
      ...kvMap.get(key),
      ...row,
    })
  }

  dig(data)

  if (action === 'update') {
    kvMap.set(key, {
      ...kvMap.get(key),
      ...row,
    })
  }

  if (action === 'delete') {
    kvMap.delete(key)
  }

  const fill = (map: Map<string, RecordType & { map_row_parentKey?: string; map_row_key?: string }>) => {
    const kvArrayMap = new Map<string, RecordType[]>()
    const kvSource: RecordType[] = []
    const fillNewRecord = (fillChildren: boolean = false) => {
      map.forEach((value) => {
        if (value.map_row_parentKey && !value.map_row_key) {
          const { map_row_parentKey, ...rest } = value
          if (!kvArrayMap.has(map_row_parentKey)) {
            kvArrayMap.set(map_row_parentKey, [])
          }
          if (fillChildren) {
            kvArrayMap.get(map_row_parentKey)?.push(rest as unknown as RecordType)
          }
        }
      })
    }

    fillNewRecord(action === 'top')

    map.forEach((value) => {
      if (value.map_row_parentKey && value.map_row_key) {
        const { map_row_parentKey, map_row_key, ...rest } = value
        if (kvArrayMap.has(map_row_key)) {
          rest[childrenColumnName] = kvArrayMap.get(map_row_key)
        }
        if (!kvArrayMap.has(map_row_parentKey)) {
          kvArrayMap.set(map_row_parentKey, [])
        }
        kvArrayMap.get(map_row_parentKey)?.push(rest as unknown as RecordType)
      }
    })

    fillNewRecord(action === 'update')

    map.forEach((value) => {
      if (!value.map_row_parentKey) {
        const { map_row_key, ...rest } = value
        if (map_row_key && kvArrayMap.has(map_row_key)) {
          const item = {
            ...rest,
            [childrenColumnName]: kvArrayMap.get(map_row_key),
          }
          kvSource.push(item as RecordType)
          return
        }
        kvSource.push(rest as RecordType)
      }
    })
    return kvSource
  }
  return fill(kvMap)
}
