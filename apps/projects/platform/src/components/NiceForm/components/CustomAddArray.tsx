import React from 'react'
import styled from 'styled-components'
import { toArr, SchemaField, FormPath } from '@apps/formily'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useWebIntl } from '@apps/locales'

// 由于自增列表里 无法进行mega布局， 所以只能在该组件下 重写样式
const RowStyleLayout = styled(({ style, ...restProps }) => (
  <div {...restProps} style={{ paddingRight: 56, position: 'relative', ...style }} />
))`
  > .ant-form-item {
    width: 100%;
    flex: 1;
  }
  .schema-wrap {
    width: 100%;
  }
  .btn-remove {
    position: absolute;
    top: 0;
    right: 0;
  }
`

// 自增组件
const CustomAddArray = (props) => {
  const { value, schema, className, editable, path, mutators } = props
  const componentProps = schema.getExtendsComponentProps() || {}
  const onAdd = () => mutators.push(schema.items.getEmptyValue())
  const onRemove = (index) => mutators.remove(index)
  const translate = useWebIntl()
  return (
    <div style={{ width: '100%', flex: 1 }}>
      {toArr(value).map((item, index, arr) => (
        <RowStyleLayout {...componentProps} key={index}>
          <SchemaField path={FormPath.parse(path).concat(index)} onlyRenderProperties />
          <Button className="btn-remove" onClick={onRemove.bind(null, index)}>
            -
          </Button>
        </RowStyleLayout>
      ))}
      <Button onClick={onAdd} type="dashed" icon={<PlusOutlined />} block>
        {translate('web.common.addResource')}
      </Button>
    </div>
  )
}

CustomAddArray.isFieldComponent = true

export default CustomAddArray
