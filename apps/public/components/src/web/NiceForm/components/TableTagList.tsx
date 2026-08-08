import React from 'react'
import { Tag, Row } from '@linkseeks/ui'

const TableTagList = (props) => {
  const { value = [], mutators, editable } = props
  const { extra = null, callback = null } = props
  const handleClose = (id) => {
    callback && callback(id)
    mutators.remove(value.findIndex((v) => v.id === id))
  }
  return (
    <div className="table-tag-list" style={{ width: '100%' }}>
      <Row style={{ flexWrap: 'wrap' }}>
        {value.map((v) => (
          <Tag
            closable={editable}
            onClose={() => handleClose(v.id)}
            color="#4279DF"
            key={v.id}
            style={{ marginBottom: 8 }}
          >
            {v.roleName}
          </Tag>
        ))}
      </Row>
      {extra}
    </div>
  )
}

TableTagList.defaultProps = {}

TableTagList.isFieldComponent = true

export default TableTagList
