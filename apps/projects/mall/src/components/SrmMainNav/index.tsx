import React from 'react'
import cx from 'classnames'
import { useGlobalConext } from '@/context/globalProvider'
import { getWebIntl } from '@/utils/locales'
import styles from './index.module.less'

const MainNav: React.FC = () => {
  const { pathname, locale } = useGlobalConext()
  const translate = getWebIntl()

  const judgeIsActiveRoute = (path: string) => {
    if (pathname === '/') {
      return path === '/'
    } else {
      if (path.indexOf(pathname) > -1 && path !== '/') {
        return true
      }
    }
    return false
  }

  const navList = [
    {
      link: '/',
      name: translate('web.resource.home.shou-ye'),
      status: true,
    },
    {
      link: '/purchaseInquiry',
      name: translate('web.resource.order.caigouxunjia'),
      status: true,
    },
    {
      link: '/purchaseBidding',
      name: translate('web.resource.order.caigouzhaobiao'),
      status: true,
    },
    {
      link: '/purchaseCompete',
      name: translate('web.resource.order.caigoujingjia'),
      status: true,
    },
    {
      link: '/enterprisePurchasing',
      name: translate('web.resource.mall.mingqicaigou'),
      status: true,
    },
    {
      link: '/purchasePublicity',
      name: translate('web.resource.mall.caigougongshi'),
      status: true,
    },
  ]

  return (
    <div className={cx(styles.main_nav)}>
      {/* 顶部导航栏去除 */}
      {/* <div className={styles.main_nav_container}>
        <ul className={styles.nav}>
          {navList.map((item) => (
            <li
              className={cx(
                styles.nav_item,
                judgeIsActiveRoute(item.link!) ? styles.active : '',
                locale === 'en-US' ? styles.pad_s : '',
              )}
              key={item.link}
            >
              <a href={item.link} title={item.name}>
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  )
}

export default MainNav
