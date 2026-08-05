import { useMemoizedFn, useSelections } from '@linkseeks/hooks'
import { useState } from 'react'

export interface TableSelectionProps {
  /**
   * 选择功能类型：
   * checkbox：复选（默认）
   * radio：单选
   */
  rowSelectionType?: 'checkbox' | 'radio'

  rowKey?: string
  /**
   * 正常情况下 希望rowKey是columns中的某一个字段作为key
   *
   * 但在自增/虚拟列表情况下，是没有一个固定的columnKey可以作为固定，所以此时rowKey可能会考虑取当前行的对象序列化字符串作为key
   *
   * 该场景下可将该属性设置为true
   */
  getRowKey?(record: any): string
  /**
   * 表单禁选方法
   */
  getCheckboxProps?: (record) => { disabled: boolean | undefined }

  /**
   * 点击行时禁选方法
   */
  getRowCheckboxProps?: (record) => { disabled: boolean | undefined }

  isRowSelection?: boolean
}

/**
 * 给表格赋予多选功能
 *
 */
export const useTableSelection = (props: TableSelectionProps) => {
  const {
    rowSelectionType = 'checkbox',
    rowKey = 'id',
    getRowKey = (record) => record[rowKey],
    getRowCheckboxProps,
    getCheckboxProps,
    isRowSelection = true,
  } = props
  const { selected, setSelected, select, unSelect, isSelected, clearSelect } = useSelections<any>([])
  const [selectionItems, setSelectionItems] = useState<any[]>([])

  const setSelection = useMemoizedFn((record) => {
    const selectKey = getRowKey(record)

    if (isSelected(selectKey)) {
      unSelect(selectKey)
      setSelectionItems([...selectionItems.filter((v) => getRowKey(v) !== selectKey)])
    } else {
      // 单选时候先清除
      rowSelectionType === 'radio' && clearSelect()
      select(selectKey)
      setSelectionItems(rowSelectionType === 'radio' ? [record] : [...selectionItems, record])
    }
  })

  // ---------- 勾选相关功能 ---------------
  // 自动将点击行事件关联到勾选功能中
  const onRow = useMemoizedFn((record) => {
    return {
      // 出现勾选项时，支持点击当前行也可自动勾选
      onClick(e) {
        // fix 由于表格中有些控件会冒泡上来导致勾选事件触发，这里做写死判断
        if (e.target.classList.contains('ant-table-cell')) {
          const disabled = getCheckboxProps ? getCheckboxProps(record).disabled : false

          if (isRowSelection && !disabled) {
            setSelection(record)
          }
        }
      },
    }
  })

  const rowSelection = {
    type: rowSelectionType,
    selectedRowKeys: selected,
    // 选择/反选时触发
    onSelect(record, selected, selectedRows) {
      setSelection(record)
    },
    // 全选时触发
    onSelectAll(selectedOption, selectedRows: any[], changeRows) {
      if (selectedOption) {
        setSelected((s) => s.concat(changeRows.map((v) => getRowKey(v))))
        setSelectionItems([...selectionItems, ...changeRows])
      } else {
        setSelected(selected.filter((key) => !changeRows.find((s) => getRowKey(s) === key)))
        setSelectionItems([...selectionItems.filter((v) => !changeRows.find((c) => getRowKey(c) === getRowKey(v)))])
      }
    },
    getCheckboxProps,
  }

  return {
    rowSelection,
    selectionItems,
    setSelectionItems,
    selected,
    setSelected,
    select,
    unSelect,
    isSelected,
    clearSelect,
    onRow,
  }
}
