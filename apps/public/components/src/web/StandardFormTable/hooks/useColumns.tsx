import React, { useMemo, useRef, useState } from 'react'
import { RecordColumns, SearchField, SearchFieldProps, SearchFieldSet } from '../types'
import useSearchSelect from './useSearchSelect'
import StatusAuthButton from '../../AuthButton/StatusAuthButton'
import RenderColumnItem from '../components/renderColumnItem'
import { useFormTable } from '../contexts'
import { useCreation, useMemoizedFn, useUpdate } from '@linkseeks/hooks'
import { cloneDeep, assign } from 'lodash'
import { Tooltip } from '@linkseeks/ui'

interface ColumnsOptions {
  searchSelectRequest?(): void
  searchSelectMaps?: Record<any, any>
  editKey: any
  rowKey: any
}

const useColumns = (userColumns: RecordColumns<any>[], options?: ColumnsOptions) => {
  const { searchSelectMaps, rowKey, editKey } = options || {}
  const { setLinkages } = useFormTable()
  const handleUpdateColumns = useUpdate()
  /**
   * 初始化表单字段项
   * 这里处理了来自columns的searchField
   * 同时保留了最初的数据，便于后续重置时恢复
   */
  const initSearchFormFields = useCreation<any>(
    () =>
      userColumns
        .reduce((prev, next) => {
          const searchField = next.searchField
          if (searchField) {
            if (typeof searchField === 'string') {
              prev.push({
                type: searchField,
                name: next.key,
                title: next.title,
                display: true,
              })
            } else if (Array.isArray(searchField)) {
              prev.push(
                ...searchField
                  .filter((v) => !!!v?.main)
                  .map((v) => {
                    v.name = v.name || next.key
                    v.title = v.title || next.title
                    v.linkage && setLinkages(v.name as string, v.linkage)
                    v.display = v.display || true
                    return v
                  }),
              )
            } else if (typeof searchField === 'object' && !searchField.main) {
              prev.push({
                name: searchField.name || next.key,
                title: searchField.title || next.title,
                display: searchField.display || true,
                ...searchField,
              })
              searchField.linkage && setLinkages((searchField.name || next.key) as string, searchField.linkage)
            }
          }
          return prev
        }, [] as SearchFieldProps[])
        .map((v: any) => {
          if (searchSelectMaps) {
            if (searchSelectMaps[v.name] && !v.valueEnum) {
              v.valueEnum = searchSelectMaps[v.name] || []
            }
          }
          // @todo 由于后端暂时无法统一数据格式，筛选条件先暂时由外部传入数据
          // if (data) {
          //   if (data[v.key] && !v.valueEnum) {
          //     v.valueEnum = data[v.key]
          //   }
          // }
          return v
        }),
    [userColumns, searchSelectMaps],
  )

  const searchFormFields = useCreation<any>(() => cloneDeep(initSearchFormFields), [initSearchFormFields])
  // 支持响应式，便于在联动中可以直接操控字段
  // const searchFormFields = useReactive(initSearchFormFields)

  const resetSearchField = useMemoizedFn(() => {
    // 这里需要深拷贝一份，不然地址每次都是重复的
    assign(searchFormFields, cloneDeep(initSearchFormFields))
  })
  // const { data } = useSearchSelect(options?.searchSelectRequest)
  const { tableColumns } = useMemo(() => {
    return {
      tableColumns: userColumns
        .filter((v) => !v.hidden)
        .map((v) => {
          v.dataIndex = v.dataIndex || v.key
          v.align = v.align || 'left'

          v.render =
            v.render ||
            function (value, record) {
              // 如果外部传入了ellipsis，则需要包裹一层toolTip， 因为全部的render都由自己代理了，所以不会走内部的table提示机制
              if (v.ellipsis) {
                return (
                  <Tooltip placement="top" title={value}>
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <RenderColumnItem column={v} value={value} record={record} />
                    </div>
                  </Tooltip>
                )
              } else {
                return <RenderColumnItem column={v} value={value} record={record} />
              }
            }
          // 处理可编辑的情况
          if (v.editable) {
            v.onCell = function (record) {
              return {
                record,
                inputType: 'input',
                dataIndex: v.dataIndex,
                title: v.title,
                editing: editKey === record[rowKey],
              }
            } as any
          }

          return v
        }),
    }
  }, [userColumns, editKey])

  const mainCol = useMemo(() => {
    let _mainCol: any = []
    userColumns.forEach((v: any) => {
      if (Array.isArray(v?.searchField)) {
        const _col = v?.searchField
          .filter((item) => !!item?.main)
          .map((item) => ({
            ...v,
            searchField: {
              ...item,
              title: item?.title ?? v?.title,
              name: item?.name ?? v?.key,
              type: item?.type,
            },
          }))
        _mainCol = _mainCol.concat(_col)
      } else {
        v?.searchField?.main &&
          _mainCol.push({
            ...v,
            searchField: {
              ...v.searchField,
              title: v.searchField?.title ?? v?.title,
              name: v.searchField?.name ?? v?.key,
              type: v.searchField?.type,
            },
          })
      }
    })
    if (_mainCol.length > 3) {
      throw 'mainCol 单行最多包含3个，超出部分建议放到高级筛选'
    }
    return _mainCol.length > 0 ? _mainCol : false
  }, [userColumns])

  return {
    searchFormFields: searchFormFields,
    tableColumns,
    resetSearchField,
    mainCol: mainCol,
    handleUpdateColumns,
  }
}

export default useColumns
