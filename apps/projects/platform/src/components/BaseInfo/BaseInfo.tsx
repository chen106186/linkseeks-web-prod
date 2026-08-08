import { Card, Col, Row } from 'antd'
import React from 'react'
import './index.global.less'

interface BaseInfoPorps {
  title?: string | React.ReactNode
  className?: string
  children: React.ReactNode
  cols?: number
  gap?: number
  id?: string
  subtitle?: string | React.ReactNode
  style?: any
}

/**
 * 基础信息布局 Card
 * @param param0
 * @returns
 */
function BaseInfo({ title, subtitle, className, children, cols = 2, gap = 4, id, style }: BaseInfoPorps) {
  return (
    <Card
      id={id}
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', ...style }}>
          <div>{title}</div>
          <div>{subtitle}</div>
        </div>
      }
      className={`${className ? className : 'mt-16'}`}
    >
      <div className={`base_info grid grid-cols-${cols} gap-${gap}`}>{children}</div>
    </Card>
  )
}

function BaseInfoItem({
  label,
  children,
  className,
}: {
  label: string
  children: JSX.Element | string | React.ReactNode
  className?: string
}) {
  return (
    <div className={`base_info_item ${className}`}>
      <Row align="middle">
        <Col span={6}>
          <span style={{ color: '#91959B' }}>{label}</span>
        </Col>
        <Col span={18}>{typeof children === 'string' ? <div>{children}</div> : children}</Col>
      </Row>
    </div>
  )
}

BaseInfo.BaseInfoItem = BaseInfoItem

export default BaseInfo
