import React from 'react'
import cx from 'classnames'
import styles from './index.less'
import { LAYOUT_TYPE } from '../constants'
import Category from '../Category'

interface MainNavPropsType {
  menuData: any
  pathname: string
  type: LAYOUT_TYPE
  shopId?: number
  shopUrlParam?: string
  categoryList?: any
  className?: string
}

const MainNav: React.FC<MainNavPropsType> = (props) => {
  const { menuData, pathname, type, categoryList, className, ...others } = props

  return (
    <div
      className={cx(
        styles.main_nav,
        type === LAYOUT_TYPE.shop ? styles.shop : '',
        className,
      )}
      {...others}
    >
      <div className={styles.main_nav_container}>
        {type === LAYOUT_TYPE.shop && (
          <Category type={type} canHide categoryList={categoryList} />
        )}
        <ul className={styles.nav}>
          {menuData &&
            menuData.map(
              (item: any, index: number) =>
                item.status && (
                  <li
                    className={cx(
                      styles.nav_item,
                      index === 0 ? styles.active : '',
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

export default MainNav
