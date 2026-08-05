import React from 'react'
import { Row, Col } from 'antd'
import { SchemaField } from '@apps/formily'

const renderCol = (schema) => {
  const { flexcol = {} } = (schema && schema['x-component-props']) || {}
  const flexProps = schema['x-flex-props'] || {}
  return (
    <Col {...flexcol} {...flexProps} key={schema.path}>
      <SchemaField schema={schema.toJSON()} path={schema.path} />
    </Col>
  )
}
const SchemaFlexRowLayout = (props) => {
  const schemaProps = props
  console.log('FlexRowLayout', schemaProps)
  const childProperties = (schemaProps.schema && schemaProps.schema.getOrderProperties()) || []
  const { justify = 'start', align = 'top' } =
    (schemaProps && schemaProps.props && schemaProps.props['x-component-props']) || {}
  return (
    <Row justify={justify} align={align}>
      {childProperties.map((v, i, arr) => renderCol(v.schema))}
    </Row>
  )
}

SchemaFlexRowLayout.isVirtualFieldComponent = true

const FlexColumnLayoutStyle = {
  display: 'flex',
  flexDirection: 'column',
}
const SchemaFlexColumnLayout = (props) => {
  const schemaProps = props
  console.log('FlexColumnLayout', schemaProps)
  const childProperties = (schemaProps.schema && schemaProps.schema.getOrderProperties()) || []
  console.log('childProperties', childProperties)
  const { style } = (schemaProps && schemaProps.props && schemaProps.props['x-component-props']) || {}

  return (
    <div style={{ ...FlexColumnLayoutStyle, ...style }}>
      {childProperties.map((v) => {
        const { flexCol = {} } = (v.schema && v.schema['x-component-props']) || {}
        return (
          <div {...flexCol} key={v.schema.path}>
            <SchemaField schema={v.schema.toJSON()} path={v.schema.path} />
          </div>
        )
      })}
    </div>
  )
}

SchemaFlexColumnLayout.isVirtualFieldComponent = true

export { SchemaFlexRowLayout, SchemaFlexColumnLayout }
