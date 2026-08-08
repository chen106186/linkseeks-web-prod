import { Col, Descriptions, Row } from '@linkseeks/ui'
import React from 'react'
import CardWrapper from './CardWrapper'

const DetailItemWrapper = ({ children, label }) => {
  const renderLabel = () => {
    return label
  }
  return <Descriptions.Item label={renderLabel()}>{children}</Descriptions.Item>
}

export default DetailItemWrapper
