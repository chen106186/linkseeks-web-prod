import React, { CSSProperties } from 'react'
import cs from 'classnames'
import { Card, Tooltip } from 'antd'
import styles from './index.less'
import CustomizeCard from '../Card'

type CardProps = Omit<React.ComponentProps<typeof Card>, 'children'>

interface Iprops {
  children: React.ReactElement
  card?: boolean
  cardProps?: CardProps
  listStyle?: CSSProperties
  itemStyle?: CSSProperties
  toolTipTitle?: string
  visible?: boolean
}

const Container: React.FC<Iprops> = (props: Iprops) => {
  const {
    children,
    card = true,
    cardProps = {},
    listStyle = {},
    itemStyle = {},
    toolTipTitle = '',
    visible = true,
  } = props
  const { onClick, onDrag, onDragEnd, onDragEnter, onDragStart, onMouseOver, getOperateState, className, ...rest } =
    props as any
  const divProps = {
    onClick,
    onDrag,
    onDragEnd,
    onDragEnter,
    onDragStart,
    onMouseOver,
  }
  const wrapClass = cs(className, styles.wrap, {
    [styles.hidden]: !visible,
  })

  return (
    <div className={wrapClass} {...divProps}>
      {(card && (
        <CustomizeCard bordered={false} {...cardProps}>
          <div className={styles.list} style={listStyle}>
            {React.Children.map(children, (_child, _index) => {
              if (_child === null) {
                return null
              }
              const node = React.cloneElement(_child)
              return (
                <div key={_index} className={styles.item} style={itemStyle}>
                  {node}
                </div>
              )
            })}
          </div>
        </CustomizeCard>
      )) || (
        <Tooltip placement="topLeft" title={toolTipTitle}>
          <div className={styles.list} style={listStyle}>
            {React.Children.map(children, (_child, _index) => {
              if (_child === null) {
                return null
              }
              const node = React.cloneElement(_child)
              return (
                <div key={_index} className={styles.item} style={itemStyle}>
                  {node}
                </div>
              )
            })}
          </div>
        </Tooltip>
      )}
    </div>
  )
}

export default Container
