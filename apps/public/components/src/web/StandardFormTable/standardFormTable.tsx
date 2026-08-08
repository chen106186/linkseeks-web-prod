import React, { RefObject, useImperativeHandle, useCallback, useMemo, useState, useRef, useEffect } from 'react'
import { StandardFormTableProvider, useFormTable } from './contexts'
import useFetchList from './hooks/useFetchList'
import { Card, ColumnType, Form, Input, Table, TableProps, Pagination } from '@linkseeks/ui'
import { ActionType, EditColProps, RecordColumns, SearchButtonsProps, SearchButtonsType } from './types'
import useActionType from './hooks/useActionType'
import useColumns from './hooks/useColumns'
import FormController from './components/formController'
import useEditCol from './hooks/useEditCol'
import { useMemoizedFn, useSelections } from '@linkseeks/hooks'
import './index.less'
import { dupliArr, mergeArrByKey } from './utils'
import { uniqBy } from 'lodash'
import { useTableSelection } from './hooks/useTableSelection'

export type StandardFormTableTypes = 'table' | 'modal' | 'tabs' | undefined

export interface StandardFormTableProps<RecordType> extends TableProps<RecordType> {
  /**
   * 表格类型
   * table: 通用列表搜索模式，左边按钮，右边筛选
   * modal: 弹窗模式，左边筛选，右边分页
   * tabs: 标签页模式，启用后，表单上方出现标签页筛选
   */
  type?: StandardFormTableTypes
  /**
   * tabs筛选项，type等于tabs时生效
   */
  tabsItems?: {
    key?: string
    label: string
    value?: string
  }[]
  /**
   * tabs筛选的Key值， type等于tabs时生效
   */
  tabsKey?: string
  /**
   * tabs默认添加全部选项
   */
  tabsDefaultAll?: boolean
  /**
   * 表格请求，刷新都是使用这个
   */
  request: any
  /**
   * 列
   */
  columns: RecordColumns<RecordType>[]

  rowKey?: string

  /**
   * 提供表格相关的一些方法，如reload
   */
  actionRef?: RefObject<ActionType>
  /**
   * 表单操作按钮
   */
  searchButtons?: SearchButtonsType[]

  /**
   * 搜索栏中，下拉框的统一调用
   * @todo 暂时不用，因为这个字段的使用需要后端将下拉框接口 将字段统一成{label, value}形式，在这之前可通过searchSelectMaps传递进来
   */
  searchSelectRequest?: any

  /**
   * 为搜索栏中，下拉框提供初始数据，这里的key会对应columns的key
   */
  searchSelectMaps?: any

  tableProps?: TableProps<RecordType>

  /**
   * 是否可编辑单元格
   *
   * 使用useEditTable hook即可直接传入
   *
   * 若设置了该属性，则columns上的editable开关开始生效
   */
  editableProps?: EditColProps

  /**
   * 是否开启选择功能
   */
  isRowSelection?: boolean
  /**
   * 选择功能类型：
   * checkbox：复选（默认）
   * radio：单选
   */
  rowSelectionType?: 'checkbox' | 'radio'
  /**
   * 是否需要自动推断滚动条显示
   */
  autoScrollX?: boolean
  /**
   * 是否需要响应式、可视区域内的竖向滚动
   * - 默认: true
   */
  autoScrollY?: boolean
  /**
   * 表单初始化的值
   */
  initalValue?: any
  /**
   * 表单禁选方法
   */
  getCheckboxProps?: (record) => { disabled: boolean | undefined }
  /**
   * 点击行时禁选方法
   */
  getRowCheckboxProps?: (record) => { disabled: boolean | undefined }
  /**
   * tab按钮点击回调
   */
  tabChange?: (params: any) => void
  /**
   * 当开启缓存时，可以传入id，否则会默认以当前页面url作为id
   */
  cacheId?: string | number
  bodyStyle?: React.CSSProperties

  /**
   * refreshDeps
   * 当依赖数组内的值发生变更时会重新请求表格
   */
  refreshDeps?: any[]

  /**
   * 兼容一些特殊情况下 只需要中文的情况
   */
  isCN?: boolean
}

// 自动推断时，单列的默认宽度
const AUTO_DEFAULT_WIDTH = 150

const StandardFormTable = <RecordType extends object>(props: StandardFormTableProps<RecordType>) => {
  const {
    request,
    actionRef: propActionRef,
    columns: userColumns = [],
    searchButtons,
    rowKey = 'id',
    type = 'table',
    tabsItems,
    tabsKey,
    tabsDefaultAll = true,
    isRowSelection,
    rowSelectionType = 'checkbox',
    tableProps = {},
    searchSelectRequest,
    searchSelectMaps,
    autoScrollX,
    autoScrollY = true,
    editableProps = {} as EditColProps,
    initalValue: initalValue,
    bodyStyle,
    getCheckboxProps,
    getRowCheckboxProps,
    refreshDeps,
    tabChange,
    isCN,
  } = props
  const { editForm, editKey } = editableProps
  const { ...extendTableProps } = tableProps
  const { pagination, searchForm, resetTableProps } = useFetchList(request, initalValue, refreshDeps, isCN)
  const { searchFormFields, tableColumns, mainCol, resetSearchField, handleUpdateColumns } = useColumns(userColumns, {
    searchSelectMaps,
    rowKey: rowKey,
    editKey,
  })
  const { actionRef, cacheId, cacheQuery, formSearchRef, isCache } = useFormTable()
  const { components } = useEditCol()
  const {
    selected,
    setSelected,
    select,
    unSelect,
    isSelected,
    clearSelect,
    rowSelection,
    selectionItems,
    setSelectionItems,
    onRow,
  } = useTableSelection({
    rowKey,
    rowSelectionType,
    getCheckboxProps,
    getRowCheckboxProps,
    isRowSelection,
  })
  useImperativeHandle(propActionRef as any, () => actionRef.current)
  // 修改ref绑定到实际表格容器
  const tableWrapperRef = useRef<any>()

  // ---------- 绑定ref，使得外部的tableRef可以调用这里面的方法 ---------------
  useActionType(actionRef, {
    reset() {
      if (isCache) {
        cacheQuery.removeCacheData(cacheId)
      }
      searchForm.reset()
      setSelectionItems([])
      handleSetSelected([])
    },
    reload() {
      searchForm.reload()
      setSelectionItems([])
      handleSetSelected([])
    },
    submit() {
      if (isCache) {
        cacheQuery.setCacheData(cacheId, {
          search: formSearchRef.getFieldsValue(),
          pagination: {
            ...pagination,
            current: 1,
          },
        })
      }
      searchForm.submit()
    },
    selectionKeys: selected,
    selectionItems,
    setSelectionKeys(keys: any[]) {
      handleSetSelected(keys)
    },
    setSelectionItems(items: any[], isConcat = true) {
      setSelectionItems(isConcat ? uniqBy([...selectionItems, ...items], rowKey) : items)
    },
    getSelectionItems() {
      return selectionItems
    },
    clearSelection() {
      setSelectionItems([])
      handleSetSelected([])
    },
  })

  // 多选操作
  const handleSetSelected = useMemoizedFn((selectKeys) => {
    setSelected(selectKeys)
  })

  const setSelection = useMemoizedFn((record) => {
    if (isSelected(record[rowKey])) {
      unSelect(record[rowKey])
      setSelectionItems([...selectionItems.filter((v) => v[rowKey] !== record[rowKey])])
    } else {
      // 单选时候先清除
      rowSelectionType === 'radio' && clearSelect()
      select(record[rowKey])
      setSelectionItems(rowSelectionType === 'radio' ? [record] : [...selectionItems, record])
    }
  })

  // ---------- 当需要表格出现横向滚动条时，自动推断x的值 ---------------
  const autoWidthX = useMemo(() => {
    if (!autoScrollX) {
      return 0
    }
    return tableColumns.reduce((prev, next) => {
      if (next.width) {
        if (typeof next.width === 'number') {
          prev += next.width
        } else {
          throw '不支持自动推断时使用非数字类型的宽度, 请设置一个固定值'
        }
      } else {
        prev += AUTO_DEFAULT_WIDTH
      }

      return prev
    }, 0)
  }, [tableColumns, autoScrollX])

  // ---------- 当表格需要竖向滚动时, 计算表格y可使用高度并设置 ---------------
  const [tableHeight, setTableHeight] = useState<number>(0)
  useEffect(() => {
    const MIN_HEIGHT = 380
    const calculateHeight = () => {
      const layoutContent = document.getElementById('layout-content')
      const pageHeaderMain = document.getElementById('page-header-main')
      // 直接通过容器元素查找滚动父级
      const scrollParent = findScrollParent(tableWrapperRef.current)
      const scrollParentClientHeight = scrollParent?.clientHeight ? scrollParent.clientHeight - 16 : 0

      // 可视取区域高度 page-header-main
      const one =
        (pageHeaderMain?.clientHeight || layoutContent?.clientHeight || scrollParentClientHeight || 0) -
        (type === 'tabs' ? 0 : 16)
      // standard-form-table-form-controller + margin-bottom: 16
      const two = (document.getElementsByClassName('standard-form-table-form-controller')[0]?.clientHeight || 0) + 16
      // footer Copy Right
      const footer = document.getElementsByTagName('footer')[0]?.clientHeight || 0
      // standard-form-table-wrapper>ant-card-body padding-bottom: 16 + footer
      const three = 16 + footer
      // ant-table-thead
      const four = document.getElementsByClassName('ant-table-thead')[0]?.clientHeight || 0
      // ant-table-pagination + margin-top: 16
      const pagination = (document.getElementsByClassName('ant-table-pagination')[0]?.clientHeight || 0) + 16
      // 计算出可用高度
      const height = one - two - three - four - pagination

      setTableHeight(height > MIN_HEIGHT ? height : MIN_HEIGHT)
    }
    // 初始计算
    calculateHeight()
    // 添加 resize 事件监听
    window.addEventListener('resize', calculateHeight)
    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver(calculateHeight)
    const config = { childList: true, subtree: true }
    // 监听所有相关元素
    const elements = [
      document.getElementById('page-header-main'),
      document.getElementsByClassName('standard-form-table-form-controller')[0],
      document.getElementsByClassName('ant-table-pagination')[0],
      document.getElementsByTagName('footer')[0],
    ].filter(Boolean)
    elements.forEach((element) => {
      if (element) {
        observer.observe(element, config)
      }
    })
    return () => {
      // 销毁
      window.removeEventListener('resize', calculateHeight)
      observer.disconnect()
    }
  }, [])

  const findScrollParent = (element?: Element | null): Element | null => {
    if (!element) return null
    const style = window.getComputedStyle(element)
    if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
      return element
    }
    return findScrollParent(element.parentElement)
  }

  return (
    <Card
      className="standard-form-table-wrapper"
      bodyStyle={type === 'tabs' ? { paddingTop: 0, ...bodyStyle } : bodyStyle}
    >
      <FormController
        type={type}
        tabsItems={tabsItems}
        tabsKey={tabsKey}
        tabsDefaultAll={tabsDefaultAll}
        mainCol={mainCol}
        tabChange={tabChange}
        searchFormFields={searchFormFields}
        searchButtons={searchButtons}
        resetSearchField={resetSearchField}
        handleUpdateColumns={handleUpdateColumns}
        initalValue={initalValue}
        pagination={
          <div className="standard-form-table-pagination-wrap">
            <Pagination size="small" {...pagination} />
          </div>
        }
      />
      <div className="table-container-wrapper" ref={tableWrapperRef}>
        <Form form={editForm} component={false}>
          <Table
            rowKey={rowKey}
            columns={tableColumns}
            components={components}
            {...(resetTableProps as any)}
            // scroll={autoScrollX ? { x: autoWidthX } : false}
            scroll={{ x: autoScrollX ? autoWidthX : null, y: autoScrollY ? tableHeight : null }}
            {...extendTableProps}
            onRow={onRow}
            rowSelection={isRowSelection ? rowSelection : null}
          />
        </Form>
      </div>
    </Card>
  )
}

export const TableContainer = <RecordType extends object>(props: StandardFormTableProps<RecordType>) => {
  return (
    <StandardFormTableProvider initValue={props}>
      <StandardFormTable {...props} />
    </StandardFormTableProvider>
  )
}

TableContainer.useTableRef = () => useRef<ActionType>({} as any)

/**
 * 创建columns，使得获得类型提示
 */
TableContainer.createColumns = <T extends {} = any>(targetArr: RecordColumns<T>[]) => {
  return targetArr
}
