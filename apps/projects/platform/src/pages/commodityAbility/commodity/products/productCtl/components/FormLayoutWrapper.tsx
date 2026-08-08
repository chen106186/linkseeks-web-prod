import { Col, Row } from '@linkseeks/ui'
import React from 'react'

const FormLayoutWrapper = ({ children }) => {
  return (
    <Row wrap>
      {React.Children.map(children, (child, index) => {
        const full = !!child.props.full
        return full ? (
          <Col key={index} span={24}>
            {child}
          </Col>
        ) : (
          <Col key={index} span={12}>
            {child}
          </Col>
        )
      })}
    </Row>
  )
}

export default FormLayoutWrapper
