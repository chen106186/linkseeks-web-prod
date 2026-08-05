import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import Category from '@/components/Category'
import {
  GetProductShopStoreGetCustomerCategoryTreeResponse,
  getProductShopStoreGetCustomerCategoryTree,
} from '@apps/apis'
import { useGlobalConext } from '@/context/globalProvider'
import { getWebIntl } from '@/utils/locales'
import { LAYOUT_TYPE } from '@/types/global'
import { initCategoryData } from '@/utils/category'
import { NAV_TYPE } from '@apps/design-ui'
import useLink from '@/hooks/useLink'
import styles from './index.module.less'

const ShopMainNav: React.FC = () => {
  const { mallInfo, navList, shopInfo, isMro, pathname } = useGlobalConext()
  const [categoryList, setCategoryList] = useState<GetProductShopStoreGetCustomerCategoryTreeResponse>([])
  const { linkPrefix } = useLink()
  const translate = getWebIntl()
  const shopUrlPrefix = `/shop/${shopInfo?.id}`

  useEffect(() => {
    if (shopInfo) {
      getCategoryTree()
    }
  }, [shopInfo])

  /**
   * 获取商品品类树
   */
  const getCategoryTree = () => {
    const param = {
      storeId: String(shopInfo?.id),
    }

    const headers = {
      type: 1,
      shopId: mallInfo?.id,
    }

    getProductShopStoreGetCustomerCategoryTree(param, { headers }).then((res) => {
      if (res.code === 1000) {
        setCategoryList(initCategoryData(res.data))
      }
    })
  }

  const judgeIsActiveRoute = (path: string) => {
    if (shopInfo) {
      if (pathname === shopUrlPrefix) {
        return pathname === path
      } else {
        if (pathname.indexOf(path) > -1 && path !== shopUrlPrefix) {
          return true
        }
      }
    }
    return false
  }

  const getLinkByType = (item: { type: NAV_TYPE; value?: string }): string => {
    switch (item.type) {
      case NAV_TYPE.mallHome:
        return linkPrefix(shopUrlPrefix)
      case NAV_TYPE.commodity:
        return linkPrefix(`${shopUrlPrefix}/commodity`)
      case NAV_TYPE.inquiry:
        return linkPrefix(`${shopUrlPrefix}/inquiry`)
      case NAV_TYPE.integral:
        return linkPrefix(`${shopUrlPrefix}/integral`)
      case NAV_TYPE.aboutus:
        return linkPrefix(`${shopUrlPrefix}/about`)
      case NAV_TYPE.info:
        return linkPrefix(`${shopUrlPrefix}/info`)
      case NAV_TYPE.category:
        return linkPrefix(`${shopUrlPrefix}/commodity/${item.value}`)
      case NAV_TYPE.commodityDetail:
        return linkPrefix(`${shopUrlPrefix}/commodity/detail/${item.value}`)
      case NAV_TYPE.customLink:
        return item.value || ''
      case NAV_TYPE.keyword:
        return linkPrefix(`${shopUrlPrefix}/commodity?keyword=${item.value}`)
      case NAV_TYPE.marketing:
        return linkPrefix(`/activity/${item.value}`)
      default:
        return ''
    }
  }

  return shopInfo ? (
    <div className={cx(styles.main_nav)}>
      <div className={styles.main_nav_container}>
        <Category type={LAYOUT_TYPE.shop} shopUrlParam={`${shopInfo?.id}`} categoryList={categoryList} canHide={true} />
        <ul className={styles.nav}>
          {navList &&
            navList.length > 0 &&
            navList.map((item, index) => {
              if (!item.status) return null
              if (isMro) {
                if (item.type !== NAV_TYPE.inquiry) {
                  return (
                    <li
                      className={cx(styles.nav_item, judgeIsActiveRoute(getLinkByType(item)) ? styles.active : '')}
                      key={`nav_item_${index}`}
                    >
                      <a href={getLinkByType(item)} title={translate(item.name as any)}>
                        {translate(item.name as any)}
                      </a>
                    </li>
                  )
                }
              } else {
                return (
                  <li
                    className={cx(styles.nav_item, judgeIsActiveRoute(getLinkByType(item)) ? styles.active : '')}
                    key={`nav_item_${index}`}
                  >
                    <a href={getLinkByType(item)} title={translate(item.name as any)}>
                      {translate(item.name as any)}
                    </a>
                  </li>
                )
              }
            })}
        </ul>
      </div>
    </div>
  ) : null
}

export default ShopMainNav
