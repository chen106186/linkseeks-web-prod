import React from 'react'
import styled from 'styled-components'
import { SchemaField, FormPath, toArr } from '@apps/formily'
import { Button } from 'antd'

// 由于自增列表里 无法进行mega布局， 所以只能在该组件下 重写样式
const RowStyleLayout = styled((props) => <div {...props} />)`
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
const CustomAddArray = (props) => {
  const { value, schema, className, editable, path, mutators } = props
  const componentProps = schema.getExtendsComponentProps() || {}
  const onAdd = () => mutators.push(schema.items.getEmptyValue())
  const onRemove = (index) => mutators.remove(index)

  return (
    <div>
      {toArr(value).map((item, index, arr) => (
        <RowStyleLayout {...componentProps} key={index}>
          <SchemaField path={FormPath.parse(path).concat(index)} onlyRenderProperties />
          <Button onClick={onAdd.bind(null, index)} type="primary">
            +
          </Button>
          <Button onClick={onRemove.bind(null, index)}>-</Button>
        </RowStyleLayout>
      ))}
      {(!value || !value.length) && (
        <Button onClick={onAdd} type="primary">
          +
        </Button>
      )}
    </div>
  )
}

CustomAddArray.isFieldComponent = true

export default CustomAddArray
