import React from 'react'
import styles from './index.less'
import { SimpleCommodity, CustomizeTag } from '@apps/design-ui'

import cx from 'classnames'
import { PlusOutlined } from '@ant-design/icons'

interface Iprops {
  children: React.ReactNode
  className: string
  title: string
  /** 控制显示隐藏 */
  status?: boolean
  theme: number
}

function parseChildrenList(children: React.ReactNode) {
  const elements = React.Children.map(children, (node) => {
    if (React.isValidElement(node)) {
      const key = node.key !== undefined ? String(node.key) : undefined
      return {
        key,
        ...node.props,
        node,
      }
    }
    return null
  })
  return elements || []
}

const Combination: React.FC<Iprops> & { Item: typeof CombinationItem } = (props: Iprops) => {
  const { children, className, title, theme, status = true, ...other } = props
  const visible = status
  const classNameStr = cx(styles.combiantion, className, { [styles.hide]: !visible })
  const { onClick, onMouseOver, getOperateState } = props as any
  const divProps = {
    onClick,
    onMouseOver,
  }
  const childrenList = parseChildrenList(children)
  const containerTitle =
    childrenList.length === 0
      ? `以下商品认选n件，只需m元`
      : childrenList[0]?.activityList?.find((_item) => _item.id === childrenList[0]?.activityId)?.label

  // const { onClick, onDrag, onDragEnd, onDragEnter, onDragStart, onMouseOver, getOperateState } = other as any;
  const count = React.Children.count(children)
  const renderChildren = () => {
    return (
      <div className={styles.wrap}>
        {React.Children.map(children, (_child: any) => {
          if (_child === null) {
            return null
          }
          return React.cloneElement(_child, { ...(_child?.props || {}), customizeClassName: styles.commodityItem })
        })}
      </div>
    )
  }

  const getCombinationPrice = () => {
    if (childrenList.length > 0 && containerTitle) {
      try {
        const match = containerTitle.match(/^(\d+\.?\d*)[\u4e00-\u9fa5]/)
        if (match) {
          return match[1]
        }
      } catch (error) {
        return 0
      }
    }
    return 0
  }

  return (
    <div className={classNameStr} {...divProps}>
      {/* <p className={styles.title}>{title}</p> */}
      <div className={styles.container}>
        <div className={styles['container-title']}>{containerTitle}</div>
        {renderChildren()}
        {count > 0 && (
          <div className={styles.footer}>
            <div className={styles['footer-price']}>￥{getCombinationPrice()}</div>
            <div className={styles['footer-btn']}>立即购买</div>
          </div>
        )}
      </div>
    </div>
  )
}

const CombinationItem: React.FC<any> = (props: any) => {
  const { productImgUrl, discount, price, footer, sale, productName, id, activityPrice, activityList } = props as any
  const { onClick, onMouseOver, getOperateState, className } = props as any
  const divProps = {
    onClick,
    onMouseOver,
  }
  // const wrapClass = cx(styles.simple);
  const wrapClass = cx(styles.section, className)

  const isEmpty = typeof productName === 'undefined' && typeof id === 'undefined'
  if (isEmpty) {
    return (
      <div className={cx(styles.simple)}>
        <div className={cx(wrapClass, styles.empty)} {...divProps}>
          <PlusOutlined />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.simple}>
      <div className={wrapClass} {...divProps}>
        <img src={productImgUrl} className={styles['simple-product-image']} />
        <div className={styles['simple-product-name']}>{productName}</div>
        <div className={styles['simple-product-label']}>
          {activityList.map((_item) => {
            return <CustomizeTag>{_item.label}</CustomizeTag>
          })}
        </div>
      </div>
    </div>
  )
}

Combination.Item = CombinationItem

export default Combination
