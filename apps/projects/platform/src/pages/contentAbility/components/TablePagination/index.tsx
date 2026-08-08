import React from 'react'
import { Pagination } from 'antd'

const TablePagination = (props) => {
  const componentProps = props.props['x-component-props']
  const total = componentProps.total
  const parentStyle = props.props['x-style']
  const handleChange = (page, pageSize) => {
    props.mutators.change({ current: page, pageSize })
  }

  return (
    <div style={parentStyle}>
      {total > 0 ? (
        <Pagination {...componentProps} current={props.value?.current || 1} onChange={handleChange}></Pagination>
      ) : null}
    </div>
  )
}

TablePagination.isFieldComponent = true

export default TablePagination
