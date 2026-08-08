import React from 'react'
import WebCard from '../WebCard'
import styles from './index.less'
import classNames from 'classnames'

/** web 装修页活动商品容器 */

interface Iprops {
  title: string
  children: React.ReactNode
  /** 控制显示隐藏 */
  visible: boolean
  /** 以下是装修容器提供的属性 */
  className: string
  onMouseOver: () => void
  onClick: () => void
}

const WebCommodityContainer: React.FC<Iprops> = (props: Iprops) => {
  const { title, children, className, onMouseOver, onClick, visible } = props

  const designProps = {
    onMouseOver,
    onClick,
  }

  if (!visible) {
    return null
  }

  const renderChildren = () => {
    return React.Children.map(children, (_child: any, _index) => {
      return (
        <div className={styles.commodityItem} key={_index}>
          {React.cloneElement(_child, { ..._child.props })}
        </div>
      )
    })
  }

  return (
    <div className={classNames(styles.container, className)} {...designProps}>
      <WebCard title={title}>
        <div className={styles.commodityList}>{renderChildren()}</div>
      </WebCard>
    </div>
  )
}

export default WebCommodityContainer
