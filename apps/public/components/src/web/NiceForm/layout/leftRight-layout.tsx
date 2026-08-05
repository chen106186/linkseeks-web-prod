// 全局注册虚拟布局组件
import React from 'react'
import { createSchemaField, RecursionField, useFieldSchema, isObj } from '@apps/form'
import { Col, Row } from '@linkseeks/ui'

// 左右两列布局
const LeftRightLayout: React.FC<any> = (props) => {
  const fieldSchema = useFieldSchema()
  const properties = fieldSchema.properties
  const childProperties = (isObj(properties) && Object.values(properties)) || []
  const leftItems = childProperties.filter((child) => child['x-component-props'].position === 'left')
  const rightItems = childProperties.filter((child) => child['x-component-props'].position === 'right')

  const leftItemsProperties = leftItems[0].properties
  const rightItemsProperties = rightItems[0].properties

  const leftChildProperties = (isObj(leftItemsProperties) && Object.keys(leftItemsProperties)) || []
  const rightChildProperties = (isObj(rightItemsProperties) && Object.keys(rightItemsProperties)) || []

  const wrapProps = props.wrapProps
  const leftProps = props.leftProps
  const rightProps = props.rightProps

  return (
    <Row align="middle" {...wrapProps}>
      {leftChildProperties.map((v, index) => (
        <Col span={18} {...leftProps} key={index}>
          <RecursionField
            schema={{
              type: leftItemsProperties[v].type,
              properties: {
                [v]: leftItemsProperties[v].toJSON(),
              },
            }}
            onlyRenderProperties
          />
        </Col>
      ))}
      {rightChildProperties.map((v, index) => (
        <Col span={6} {...rightProps} key={index}>
          <RecursionField
            schema={{
              type: rightItemsProperties[v].type,
              properties: {
                [v]: rightItemsProperties[v].toJSON(),
              },
            }}
            onlyRenderProperties
          />
        </Col>
      ))}
    </Row>
  )
}

export default LeftRightLayout
