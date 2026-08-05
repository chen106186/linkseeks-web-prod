import React from 'react'
import cx from 'classnames'
import Item from './item'
import styles from './index.less'

interface ShowCaseBannerProps {
  className: string
  visible?: boolean
}

export interface ItemProps {
  Item: typeof Item
}

const ShowCaseBanner: React.FC<ShowCaseBannerProps> & ItemProps = (props) => {
  const { children, className, visible = true, ...other } = props

  const classNameString = cx(styles['lingxi-mobile-show-case'], className)

  if (!visible) return null

  return (
    <div className={classNameString} {...other}>
      {children}
    </div>
  )
}

ShowCaseBanner.Item = Item

export default ShowCaseBanner
