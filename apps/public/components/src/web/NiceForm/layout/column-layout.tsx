// 全局注册虚拟布局组件
import React from 'react'
import { Col, Row } from '@linkseeks/ui'

// 分列 容器
const columnLayout: React.FC<any> = (_props) => {
  const { children, props } = _props
  const xComponentProps = props || {}
  const { column = 3 } = xComponentProps

  const span = 24 / column

  const childNodes: React.ReactElement[] = React.Children.map(children, (child) => child)

  const cols = Array.apply(null, Array(column)).map(() => [])

  childNodes.forEach((item, index) => {
    cols[index % column].push(item as never)
  })

  return (
    <Row gutter={20}>
      {cols.map((item, index) => (
        <Col key={index} span={span}>
          {item}
        </Col>
      ))}
    </Row>
  )
}

export default columnLayout
