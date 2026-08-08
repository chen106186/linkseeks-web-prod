import React, { ReactNode } from 'react'
import { RecordColumns, SearchField } from '../types'
import FormField from '../components/formField'

export const parserColumns = <RecordType,>(columns: RecordColumns<RecordType>[]) => {
  const searchColumnsFields: ReactNode[] = []

  const insertField = (col: RecordColumns<RecordType>) => {
    const formItemProps = {
      name: col.key,
    }

    if (typeof col.searchField === 'function') {
      const searchField = col.searchField(SearchField as any)

      searchColumnsFields.push(<FormField type={searchField} formItemProps={formItemProps} {...col} />)
    } else if (Array.isArray(col.searchField)) {
      col.searchField.forEach((colSearch) => {
        insertField(colSearch)
      })
    } else if (typeof col.searchField === 'object') {
      insertField({ ...col, ...col.searchField })
    }
  }
  // 根据order字段进行排序，order值越大则越靠右边
  columns
    .sort((a, b) => {
      if (!a.order) return -1
      if (!b.order) return 1
      return a.order - b.order
    })
    .forEach((col) => {
      insertField(col)
    })

  return {
    searchColumnsFields,
  }
}
