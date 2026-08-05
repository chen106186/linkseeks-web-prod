// 全局注册虚拟布局组件
import React from 'react'
import { createSchemaField, RecursionField, useFieldSchema, isObj } from '@apps/form'
import { Col, Row } from '@linkseeks/ui'
import cx from 'classnames'

const renderCol = (schema: any, v: string, isLast: boolean) => {
  const { flexcol = {} } = schema['x-component-props']
  return (
    <Col style={isLast ? {} : { marginRight: 24 }} {...flexcol} key={v}>
      <RecursionField
        schema={{
          type: schema.type,
          properties: {
            [v]: schema.toJSON(),
          },
        }}
        onlyRenderProperties
      />
    </Col>
  )
}
// 自定义flex布局容器
const flexBox: React.FC<any> = (props) => {
  const fieldSchema = useFieldSchema()
  const { labelcol, wrappercol } = props
  const { title, required } = fieldSchema
  const properties = fieldSchema.properties
  const childProperties = (isObj(properties) && Object.keys(properties)) || []

  return (
    <Row>
      {title && (
        <Col span={labelcol} className={cx(required ? 'flex-layout-label-required' : '')}>
          {title}
        </Col>
      )}
      <Col span={wrappercol}>
        <Row>{childProperties.map((v, i, arr) => renderCol(properties?.[v], v, arr.length - 1 === i))}</Row>
      </Col>
    </Row>
  )
}

export default flexBox
