import React from 'react'
import { Card } from 'antd'
import cs from 'classnames'
import styles from './index.less'

type CardProps = React.ComponentProps<typeof Card>

interface Iprops extends CardProps {
  children: React.ReactNode
}

const CustomizeCard: React.FC<Iprops> = (props: Iprops) => {
  const { children, ...rest } = props
  const {
    onClick,
    onDrag,
    onDragEnd,
    onDragEnter,
    onDragStart,
    onMouseOver,
    getOperateState,
    className,
    ...otherRest
  } = props as any
  /** guaidLine 属性 */
  const divProps = {
    onClick,
    onDrag,
    onDragEnd,
    onDragEnter,
    onDragStart,
    onMouseOver,
  }
  return (
    <div {...divProps} className={cs(styles.wrap, className)}>
      <Card {...otherRest}>{children}</Card>
    </div>
  )
}

export default CustomizeCard
