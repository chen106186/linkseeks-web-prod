import React from 'react'
import ClassNames from 'classnames'
import { Card as AntdCard, CardProps as AntdCardProps } from 'antd'

export interface CardProps extends AntdCardProps {
  isMarginBottom?: boolean
}

const Card = (props: CardProps) => {
  const { className, isMarginBottom, ...reset } = props

  const mixinClass = isMarginBottom ? 'ui-card-mb' : ''
  return <AntdCard className={ClassNames('ui-card', mixinClass, className)} bordered={false} {...reset} />
}

export default Card
