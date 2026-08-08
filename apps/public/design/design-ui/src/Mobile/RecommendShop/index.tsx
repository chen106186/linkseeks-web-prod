import React from 'react'
import cx from 'classnames'
import ShopItem from './shopItem'
import styles from './index.less'
import LocaleReceiver from '../../components/LocaleProvider/LocaleReceiver'
import { MobileLocale } from '../../locale/types/mobile'

export interface ProductItemType {
  name: string
  mainPic: string
  price: string
}

export interface ShopProps {
  className?: string
  title?: string
  state?: boolean
  visible?: boolean
}

type ItemProps = {
  Item: typeof ShopItem
}

const RecommendShop: React.FC<ShopProps> & ItemProps = (props) => {
  const renderComponent = (locale: MobileLocale) => {
    const {
      children,
      className,
      state = true,
      visible = true,
      title = locale['mobile.recommendShop.title'],
      ...others
    } = props
    const classNameString = cx(styles['shop-list'], className)

    if (!visible) return null

    return (
      <div className={classNameString} {...others}>
        <div className={styles['shop-list-title']}>{title}</div>
        {state ? children : null}
      </div>
    )
  }
  return (
    <LocaleReceiver componentName="Mobile">{renderComponent}</LocaleReceiver>
  )
}

RecommendShop.Item = ShopItem

export default RecommendShop
