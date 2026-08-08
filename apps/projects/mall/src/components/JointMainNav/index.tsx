import React from 'react'
import cx from 'classnames'
import { useGlobalConext } from '@/context/globalProvider'
import { getWebIntl } from '@/utils/locales'
import CookieStorage from '@linkseeks/storage/src/adapter/cookie'
import { NAV_TYPE } from '@apps/design-ui'
import styles from './index.module.less'
import { getCookieDomain } from '@apps/utils'
import useLink from '@/hooks/useLink'

const MainNav: React.FC = () => {
  const { pathname, navList, userInfo, mallInfo, isMro, mallUrl, locale } = useGlobalConext()
  const translate = getWebIntl()
  const { linkPrefix } = useLink()

  const judgeIsActiveRoute = (path: string) => {
    if (pathname === '/') {
      return path === '/'
    } else {
      const temp = path.split('/')
      const routeName = temp[temp.length - 1]
      if (pathname.indexOf(routeName) > -1 && path !== '/') {
        return true
      }
    }
    return false
  }

  /**
   * 跳转srm时保存相关信息
   */
  const handleJumpSrm = (item: any) => {
    const data = {
      shopId: mallInfo?.id,
      type: 'b2b',
      memberId: userInfo?.memberId,
      memberRoleId: userInfo?.memberRoleId,
      title: mallInfo?.name,
      jumpUrl: location.href,
      logoUrl: mallInfo?.logoUrl,
    }
    const cookie = new CookieStorage()
    cookie.setItem('SrmDataSource', JSON.stringify(data), {
      domain: getCookieDomain(),
    })
    console.log('设置cookie=》SrmDataSource：', data)
    window.location.href = getLinkByType(item)
  }

  const getLinkByType = (item: { type: NAV_TYPE; value?: string }): string => {
    switch (item.type) {
      case NAV_TYPE.mallHome:
        return linkPrefix()
      case NAV_TYPE.commodity:
        return linkPrefix('/commodity')
      case NAV_TYPE.inquiry:
        return linkPrefix('/inquiry')
      case NAV_TYPE.integral:
        return linkPrefix('/integral')
      case NAV_TYPE.askPurchase:
        return linkPrefix('/askPurchase')
      case NAV_TYPE.stores:
        return linkPrefix('/stores')
      case NAV_TYPE.srm:
        return mallUrl?.srmUrl || '/'
      case NAV_TYPE.info:
        return linkPrefix('/info')
      case NAV_TYPE.category:
        return linkPrefix(`/commodity/${item.value}`)
      case NAV_TYPE.commodityDetail:
        return linkPrefix(`/commodity/detail/${item.value}`)
      case NAV_TYPE.customLink:
        return item.value || '/'
      case NAV_TYPE.keyword:
        return linkPrefix(`/commodity?keyword=${item.value}`)
      case NAV_TYPE.marketing:
        return linkPrefix(`/activity/${item.value}`)
      case NAV_TYPE.cpecialPage:
        return linkPrefix(`/cpecialPage/${item.value}`)
      default:
        return '/'
    }
  }

  return (
    <div className={cx(styles.main_nav)}>
      {/* 顶部导航栏去除 */}
      {/* <div className={styles.main_nav_container}>
        <ul className={styles.nav}>
          {navList &&
            navList.length > 0 &&
            navList.map((item) => {
              if (isMro) {
                if (item.type != 3 && item.status) {
                  return (
                    <li
                      className={cx(styles.nav_item, judgeIsActiveRoute(getLinkByType(item)) ? styles.active : '')}
                      key={getLinkByType(item)}
                    >
                      <a href={getLinkByType(item)} title={translate(item.name as any)}>
                        {translate(item.name as any)}
                      </a>
                    </li>
                  )
                }
              } else {
                return (
                  item.status && (
                    <li
                      className={cx(
                        styles.nav_item,
                        judgeIsActiveRoute(getLinkByType(item)) ? styles.active : '',
                        locale === 'en-US' ? styles.pad_s : '',
                      )}
                      key={getLinkByType(item)}
                    >
                      <a href={getLinkByType(item)} title={translate(item.name as any)}>
                        {translate(item.name as any)}
                      </a>
                    </li>
                  )
                )
              }
            })}
        </ul>
      </div> */}
    </div>
  )
}

export default MainNav
