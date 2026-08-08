import React, { useEffect } from 'react'
import { SchemaForm, registerVirtualBox, SchemaField, registerValidationRules } from '@apps/formily'
import { Row, Col } from 'antd'
// import { FormMegaLayout, Input } from '@apps/formily';

const renderCol = (schema) => {
  const { flexcol = {} } = (schema && schema['x-component-props']) || {}
  const flexProps = schema['x-flex-props'] || {}
  return (
    <Col {...flexcol} {...flexProps} key={schema.path}>
      <SchemaField schema={schema.toJSON()} path={schema.path} />
    </Col>
  )
}

registerVirtualBox('CustomFlexRowLayout', (props) => {
  const schemaProps = props
  const childProperties = (schemaProps.schema && schemaProps.schema.getOrderProperties()) || []
  const { justify = 'start', align = 'top' } =
    (schemaProps && schemaProps.props && schemaProps.props['x-component-props']) || {}
  return (
    <Row justify={justify} align={align}>
      {childProperties.map((v, i, arr) => renderCol(v.schema))}
    </Row>
  )
})

const FlexColumnLayoutStyle = {
  display: 'flex',
  flexDirection: 'column',
}
registerVirtualBox('CustomFlexColumnLayout', (props) => {
  const schemaProps = props
  const childProperties = (schemaProps.schema && schemaProps.schema.getOrderProperties()) || []
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
})

const FilterTable = (props) => {
  const { actions, schema, components, ...rest } = props

  return (
    <div>
      <SchemaForm components={components} actions={actions} schema={schema} {...rest}></SchemaForm>
    </div>
  )
}

export default FilterTable
