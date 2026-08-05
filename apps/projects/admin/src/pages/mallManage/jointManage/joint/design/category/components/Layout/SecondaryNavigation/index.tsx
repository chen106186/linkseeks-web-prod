import React from 'react'
// import { Card } from 'antd';
import cs from 'classnames'
import { PlusOutlined } from '@ant-design/icons'
import styles from './index.less'
import CustomizeCard from '../Card'

interface Iprops {
  children: React.ReactElement
  /** 显示隐藏 */
  status: boolean
}

const SecondaryNavigation: React.FC<Iprops> & { Item: typeof Item } = (props: Iprops) => {
  const { children, status } = props
  console.log(status, 'SecondaryNavigation')
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
    [styles.hidden]: !status,
  })

  return (
    <div className={wrapClass} {...divProps}>
      <CustomizeCard bordered={false} bodyStyle={{ padding: '12px 12px 0 12px', borderRadius: 8 }}>
        <div className={styles.list}>
          {React.Children.map(children, (_item) => {
            if (_item === null) {
              return null
            }
            return React.cloneElement(_item)
          })}
        </div>
      </CustomizeCard>
    </div>
  )
}

const Item = (props) => {
  const { icon, id, name } = props
  const { onClick, onDrag, onDragEnd, onDragEnter, onDragStart, onMouseOver, getOperateState, className, ...rest } =
    props as any
  /** guaidLine 属性 */
  const divProps = {
    onClick,
    onDrag,
    onDragEnd,
    onDragEnter,
    onDragStart,
    onMouseOver,
  }

  const wrapClass = cs(styles.content)
  const isEmpty = typeof name === 'undefined' && typeof id === 'undefined'

  if (isEmpty) {
    return (
      <div className={styles.item}>
        <div {...divProps} className={cs(wrapClass, className, styles.empty)}>
          <PlusOutlined />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.item}>
      <div className={wrapClass}>
        <div {...divProps} className={cs(className, styles.center)}>
          <img src={icon} className={styles.image} />
          <div className={styles.name}>{name}</div>
        </div>
      </div>
    </div>
  )
}

SecondaryNavigation.Item = Item

export default SecondaryNavigation
