import React from 'react'
import cx from 'classnames'
import purchaseIcon from './icons/purchase_icon.svg'
import purchaseIconScience from './icons/purchase_icon_science.svg'
import mineIcon from './icons/mine_icon.svg'
import mineIconScience from './icons/mine_icon_science.svg'
import messageIcon from './icons/message_icon.svg'
import messageIconScience from './icons/message_icon_science.svg'
import styles from './index.less'
import SearchItem from './searchItem'
import { DataItemType } from './index'

interface ActionItemProps {
  data: DataItemType
  styleTheme: number
  className?: string
}

const ActionItem = (props: ActionItemProps) => {
  const { data, styleTheme, className, ...others } = props

  const showItemIcon = () => {
    if (!data.content) {
      switch (data.type) {
        case 1:
          switch (styleTheme) {
            case 0:
              return mineIcon
            case 1:
              return mineIconScience
          }
          break
        case 2:
          switch (styleTheme) {
            case 0:
              return purchaseIcon
            case 1:
              return purchaseIconScience
          }
          break
        case 3:
          switch (styleTheme) {
            case 0:
              return messageIcon
            case 1:
              return messageIconScience
          }
          break
      }
    }
    return data.content
  }

  const renderByType = () => {
    const classNameString = cx(styles['lingxi-header-actions-item'], className)
    if (data) {
      switch (data.type) {
        case 1:
        case 2:
        case 3:
          return (
            <div className={classNameString} {...others}>
              <img
                className={styles['lingxi-header-actions-item-icon']}
                src={showItemIcon()}
              />
            </div>
          )
        case 4:
          return <SearchItem data={data} className={className} {...others} />
      }
    }
    return null
  }

  return renderByType()
}

export default ActionItem
