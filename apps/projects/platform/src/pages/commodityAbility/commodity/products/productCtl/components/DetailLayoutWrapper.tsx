import { Col, Descriptions, Row } from '@linkseeks/ui'
import React from 'react'
import CardWrapper from './CardWrapper'

interface DetailLayoutWrapperProp {
  children: any
  title: any
  isPadding?: boolean
}
const DetailLayoutWrapper = (props: DetailLayoutWrapperProp) => {
  const { children, title, isPadding = true } = props
  return (
    <CardWrapper bodyStyle={isPadding ? {} : { padding: 0 }}>
      <Descriptions title={title} column={2}>
        {children}
      </Descriptions>
    </CardWrapper>
  )
}

export default DetailLayoutWrapper
