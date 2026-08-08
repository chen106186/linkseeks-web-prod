import { Card } from '@linkseeks/ui'
import LineTitle, { LineTitleProps } from '../LineTitle'
import React, { ReactNode } from 'react'
import mixins from 'classnames'
import './index.global.less'
import { CardProps } from '@linkseeks/ui/src/Card'

interface LineCardProps extends CardProps {
  headTitle?: ReactNode
  headClassName?: string
  headExtra?: ReactNode
  className?: string
  children?: ReactNode
}

/**
 * 带有线框标题的卡片，支持头部传入工具栏
 */
const LineCard = (props: LineCardProps) => {
  const { headTitle, headClassName, headExtra, className, children, ...resetCardProps } = props
  return (
    <Card
      title={
        headTitle ? (
          <LineTitle className={headClassName} extra={headExtra}>
            {headTitle}
          </LineTitle>
        ) : null
      }
      className={mixins('cp-line-card', className)}
      {...resetCardProps}
    >
      {children}
    </Card>
  )
}

export default LineCard
