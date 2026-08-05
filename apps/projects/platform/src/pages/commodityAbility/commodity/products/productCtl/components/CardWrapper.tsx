import { Card, Row, Col } from '@linkseeks/ui'
import { CardProps } from 'antd'
import { ReactNode } from 'react'

interface CardWrapperProps extends CardProps {
  renderLeft?: ReactNode
  renderRight?: ReactNode
}

const CardWrapper = (props: CardWrapperProps) => {
  const { children, renderLeft, renderRight, style, ...resetProps } = props
  return (
    <Card style={{ marginBottom: 24, ...style }} {...resetProps}>
      {renderLeft && (
        <Row>
          <Col style={{ width: '50%' }}>{renderLeft}</Col>
          <Col style={{ width: '50%' }}>{renderRight}</Col>
        </Row>
      )}
      {children}
    </Card>
  )
}

export default CardWrapper
