import React from 'react'
import cx from 'classnames'
import { useLocation } from 'react-router-dom'
import { useGlobalConext } from '@/context/globalProvider'
import { getWebIntl } from '@/utils/locales'
import styles from './index.module.less'

const ShopNav: React.FC = () => {
  const { shopInfo } = useGlobalConext()
  const pathPrefix = `/shopIndex/${shopInfo?.id}`
  const translate = getWebIntl()
  const { pathname } = useLocation()

  const menuData = [
    {
      title: translate('web.resource.home.shou-ye'),
      path: pathPrefix,
      key: 'shopIndex',
    },
    {
      title: translate('web.resource.order.caigouxunjia'),
      path: pathPrefix + '/purchaseInquiry',
      key: 'purchaseInquiry',
    },
    {
      title: translate('web.resource.order.caigouzhaobiao'),
      path: pathPrefix + '/purchaseBidding',
      key: 'purchaseBidding',
    },
    {
      title: translate('web.resource.order.caigoujingjia'),
      path: pathPrefix + '/purchaseCompete',
      key: 'purchaseCompete',
    },
    {
      title: translate('web.resource.mall.caigougongshi'),
      path: pathPrefix + '/purchasePublicity',
      key: 'purchasePublicity',
    },
    {
      title: translate('web.resource.mall.aboutus'),
      path: pathPrefix + '/aboutUs',
      key: 'aboutUs',
    },
  ]

  const judgeIsActiveRoute = (path: string) => {
    if (shopInfo) {
      if (pathname === pathPrefix) {
        return pathname === path
      } else {
        if (pathname.indexOf(path) > -1 && path !== pathPrefix) {
          return true
        }
      }
    }
    return false
  }

  return (
    <div className={cx(styles.main_nav)}>
      <div className={styles.main_nav_container}>
        <ul className={styles.nav}>
          {menuData &&
            menuData.map((item) => (
              <li className={cx(styles.nav_item, judgeIsActiveRoute(item.path) && styles.active)} key={item.key}>
                <a href={`${item.path}`}>{item.title}</a>
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}

export default ShopNav
