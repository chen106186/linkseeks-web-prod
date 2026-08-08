import React from 'react'
import { Col, Row } from '@linkseeks/ui'
import { RecursionField, useFieldSchema, isObj } from '@apps/form'
import styled from 'styled-components'

const RowLayout = styled((props: any) => <Row justify="end" {...props} />)`
  .mega-layout-item {
    margin-bottom: 20px !important;
  }
  .mega-layout-container {
    margin-bottom: 0;
  }
`
const flexLayout: React.FC<any> = (props) => {
  const fieldSchema = useFieldSchema()
  const rowStyle = props.rowStyle || {}
  const colStyle = props.colStyle || {}
  const properties = fieldSchema.properties
  return (
    <RowLayout style={rowStyle}>
      {isObj(properties) &&
        Object.keys(properties).map((v: string, i: number) => {
          return (
            <Col style={colStyle} key={i}>
              <RecursionField
                schema={{
                  type: fieldSchema.type,
                  properties: {
                    [v]: properties[v].toJSON(),
                  },
                }}
                onlyRenderProperties
              />
            </Col>
          )
        })}
    </RowLayout>
  )
}

export default flexLayout
