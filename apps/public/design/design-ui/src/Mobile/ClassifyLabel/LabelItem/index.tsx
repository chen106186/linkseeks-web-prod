import React from 'react'
import cx from 'classnames'
import styles from '../index.less'

export interface CommodityItemType {
  [key: string]: any
}

export interface LabelItemProps {
  className: string
  type: number
  clientWidth?: number
  title: string
  explain: string
  list: CommodityItemType[]
  activeType: number
  updateActiveType?: (type: number) => void
}

const LabelItem: React.FC<LabelItemProps> = (props) => {
  const {
    children,
    type,
    title,
    explain,
    className,
    activeType,
    clientWidth,
    updateActiveType,
    ...others
  } = props

  const classNameString = cx(
    styles['classify-label-item'],
    activeType === type && styles['active'],
    className,
  )
  console.log(activeType, 'activeType', type, 'type')
  const handleClick = () => {
    if (type !== activeType) {
      updateActiveType && updateActiveType(type)
    }
  }

  return (
    <div className={classNameString} {...others}>
      <div className={styles['classify-label-item-wrap']} onClick={handleClick}>
        <div className={styles['classify-label-item-title']}>{title}</div>
        <div className={styles['classify-label-item-explain']}>{explain}</div>
      </div>
      <div className={styles['classify-label-list-wrap']}>
        {activeType === type &&
          children &&
          React.Children.map(children, (child: any) => {
            return React.cloneElement(child, {
              activeType,
              clientWidth,
            })
          })}
      </div>
    </div>
  )
}

export default LabelItem
