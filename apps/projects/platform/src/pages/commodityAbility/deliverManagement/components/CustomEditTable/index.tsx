import React from 'react'
import { EditableHeaderCell } from './EditableHeaderCell'
import { EditableRow } from './EditableRow'
import { EditableCell } from './EditableCell'

const CustomEditTable = (columns) => ({
  header: {
    cell: (props) => EditableHeaderCell({ ...props, columns }),
  },
  body: {
    row: EditableRow,
    cell: EditableCell,
  },
})

export default CustomEditTable
