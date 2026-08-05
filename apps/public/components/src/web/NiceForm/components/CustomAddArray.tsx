import React from 'react'
import styled from 'styled-components'
import { useField, useFieldSchema, RecursionField, observer, ArrayField } from '@apps/form'
import { Button } from '@linkseeks/ui'

// 由于自增列表里 无法进行mega布局， 所以只能在该组件下 重写样式
const RowStyleLayout = styled((props: any) => <div {...props} />)`
  .ant-btn {
    margin-right: 16px;
  }
  .ant-form-item {
    display: inline-flex;
    margin-right: 16px;
    margin-bottom: 16px;
  }
  > .ant-form-item {
    margin-bottom: 20px;
    margin-right: 20px;
  }
  > .ant-form-item:last-child {
    margin-right: 0;
  }
  .ant-form-item-control {
    max-width: none;
  }
`

// 自增组件
const CustomAddArray = observer(() => {
  const field = useField<ArrayField>()
  const schema = useFieldSchema()
  const dataSource = Array.isArray(field.value) ? field.value : []

  const onAdd = () => {
    field.push({})
  }

  const onRemove = (index: any) => {
    field.remove(index)
  }

  return (
    <div>
      {dataSource?.map((item, index) => {
        const items = Array.isArray(schema.items) ? schema.items[index] || schema.items[0] : schema.items
        return (
          <RowStyleLayout key={index}>
            <RecursionField schema={items} name={index} />
            <Button onClick={onAdd} type="primary">
              +
            </Button>
            <Button onClick={(index) => onRemove(index)}>-</Button>
          </RowStyleLayout>
        )
      })}
      {(!dataSource || !dataSource.length) && (
        <Button onClick={onAdd} type="primary">
          +
        </Button>
      )}
    </div>
  )
})

export default CustomAddArray
