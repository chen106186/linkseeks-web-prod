import React from 'react'
import cx from 'classnames'
import styles from './index.less'
import { NavItemType } from '../Platform'

interface MainNavPropsType {
  className?: string
  menuData: NavItemType[]
  pathname: string
  shopId?: number
  shopUrlParam?: string
  categoryList?: any
}

const MallMainNav: React.FC<MainNavPropsType> = (props) => {
  const { menuData, pathname, className, ...others } = props

  const ClassString = cx(styles['mall_main_nav'], className)

  return (
    <div className={ClassString} {...others}>
      <div className={styles.mall_main_nav_container}>
        <ul className={styles.nav}>
          {menuData &&
            menuData.map(
              (item) =>
                item.status && (
                  <li
                    className={cx(
                      styles.nav_item,
                      item.link === pathname ? styles.active : '',
                    )}
                    key={item.key}
                  >
                    <span>{item.name}</span>
                  </li>
                ),
            )}
        </ul>
      </div>
    </div>
  )
}

export default MallMainNav
