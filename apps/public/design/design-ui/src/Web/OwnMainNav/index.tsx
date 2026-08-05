import React, { useContext } from 'react'
import cx from 'classnames'
import styles from './index.less'
import { LAYOUT_TYPE } from '../constants'
import Category from '../Category'
import LocaleContext from '../../components/LocaleProvider/context'
import { NAV_TYPE } from '../../constants'

interface MenuItemType {
  sort: number
  name: string
  link?: string
  status: boolean
  type: NAV_TYPE
  value?: string
  valueText?: string
}

interface MainNavPropsType {
  menuData: MenuItemType[]
  pathname: string
  type: LAYOUT_TYPE
  shopId?: number
  shopUrlParam?: string
  categoryList?: any
  className: string
}

const OwnMainNav: React.FC<MainNavPropsType> = (props) => {
  const { menuData, pathname, categoryList, type, className, ...others } = props
  const context = useContext(LocaleContext)
  const classNameString = cx(styles.main_nav, className)

  const designReset = type === LAYOUT_TYPE.cpecialPage ? {} : others

  return (
    <div className={classNameString} {...designReset}>
      <div className={styles.main_nav_container}>
        <Category type={type || LAYOUT_TYPE.own} categoryList={categoryList} />
        <ul className={styles.nav}>
          {menuData &&
            menuData.map(
              (item, index) =>
                item.status && (
                  <li
                    className={cx(
                      styles.nav_item,
                      index === 0 ? styles.active : '',
                      context?.locale === 'en-US' ? styles.pad_s : '',
                    )}
                    key={item.type}
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

export default OwnMainNav
