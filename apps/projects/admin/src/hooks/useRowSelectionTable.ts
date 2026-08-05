import { useState } from 'react'
import { TableRowSelection } from 'antd/es/table/interface'
import { mergeArrByKey, dupliArr } from '@/utils'

interface useRowSelectionTableCtl {
  selectRow: any[]
  selectedRowKeys: any[]
  setSelectRow(rows: any[])
  setSelectedRowKeys(rows: any)
}

interface useRowSelectionOptions {
  type?: 'checkbox' | 'radio'
  customKey?: string

  // 可通过该参数扩展多选选项
  // https://ant.design/components/table-cn/#components-table-demo-row-selection
  extendsSelection?: TableRowSelection<any>
}

/**
 * 用于处理table 多选或者单选时的hooks
 * @auth xjm
 */
export const useRowSelectionTable = (
  options: useRowSelectionOptions = {},
): [TableRowSelection<any>, useRowSelectionTableCtl] => {
  const { type = 'checkbox', customKey = 'id', extendsSelection = {} } = options
  const [selectRow, setSelectRow] = useState<any[]>([]) // 模态框选择的行数据
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>(() => [])

  const mergeRowKeys = (item) => {
    setSelectedRowKeys([...selectedRowKeys, item])
  }

  const mergeRow = (item) => {
    setSelectRow([...selectRow, item])
  }

  const removeRows = (arr: any[]) => {
    return selectRow.filter((v) => {
      const result = arr.find((item) => item[customKey] === v[customKey])
      if (!result) {
        return v
      }
    })
  }

  const removeRowsKeys = (arr: any[]) => {
    return selectedRowKeys.filter((v) => {
      const result = arr.find((item) => item === v)
      if (!result) {
        return v
      }
    })
  }

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    type,
    // 为解决分页情况下， 保存多选的数据
    onSelect: (record, selects, selectedRows, nativeEvent) => {
      if (type === 'radio') {
        // 单选情况下
        setSelectedRowKeys([record[customKey]])
        setSelectRow([record])
        return
      }
      const findIds = selectedRowKeys.indexOf(record[customKey])
      if (findIds === -1) {
        mergeRowKeys(record[customKey])
        mergeRow(record)
      } else {
        setSelectedRowKeys(selectedRowKeys.filter((_, i) => i !== findIds))
        setSelectRow(selectRow.filter((_, i) => i !== findIds))
      }
    },

    onSelectAll: (selected, selectedRows, changeRows) => {
      if (selected) {
        setSelectedRowKeys(dupliArr([...selectedRowKeys, ...changeRows.map((v) => v[customKey])]))
        setSelectRow(mergeArrByKey(selectRow, changeRows, customKey))
      } else {
        setSelectedRowKeys(removeRowsKeys(changeRows.map((v) => v[customKey])))
        setSelectRow(removeRows(changeRows))
      }
    },

    ...extendsSelection,
  }

  return [
    rowSelection,
    {
      selectRow,
      setSelectRow,
      selectedRowKeys,
      setSelectedRowKeys,
    },
  ]
}
