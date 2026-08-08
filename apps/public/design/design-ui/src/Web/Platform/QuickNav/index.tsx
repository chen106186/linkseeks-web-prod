import React, { useState } from 'react'
import cx from 'classnames'
import defaultAvatar from './default_avatar.png'
import uploadIcon from './icons/upload_icon.png'
import offerIcon from './icons/offer_icon.png'
import orderIcon from './icons/order_icon.png'
import buyIcon from './icons/buy_icon.png'
import offerinfoIcon from './icons/offerinfo_icon.png'
import myorderIcon from './icons/myorder_icon.png'
import promptIcon from './icons/prompt_icon.png'
import findSupplyIcon from './icons/find_supply_icon.png'
import tobuyIcon from './icons/tobuy_icon.png'
import findShopsIcon from './icons/findshops_icon.png'
import integral from './icons/integral.png'
import informationIcon from './icons/information_icon.png'
import styles from './index.less'
import { PlatformLocale } from '../../../locale/types/platform'
import LocaleReceiver from '../../../components/LocaleProvider/LocaleReceiver'

export interface QuickNavItemType {
  name: string
  icon: string
  link: string
}

interface QuickNavPropsType {
  name?: string
  className?: string
  sellQuickNavList: QuickNavItemType[]
  buyQuickNavList: QuickNavItemType[]
  quickNavList: QuickNavItemType[]
}

const PlatformQuickNav: React.FC<QuickNavPropsType> = (props) => {
  const {
    name,
    className,
    sellQuickNavList,
    buyQuickNavList,
    quickNavList,
    ...others
  } = props
  const [tabType, setTabType] = useState<number>(1) // 1; 卖家服务；2：买家服务

  const handleChangeTabType = (type: number) => {
    if (tabType !== type) {
      setTabType(type)
    }
  }

  const quikcNavClassString = cx(styles['quikc_nav'], className)

  const renderComponent = (locale: PlatformLocale) => {
    const showDetaulImg = (name: string) => {
      switch (name) {
        case locale['platform.nav.item.upload']:
          return uploadIcon
        case locale['platform.nav.item.offer']:
          return offerIcon
        case locale['platform.nav.item.order']:
          return orderIcon
        case locale['platform.nav.item.buy']:
          return buyIcon
        case locale['platform.nav.item.offerinfo']:
          return offerinfoIcon
        case locale['platform.nav.item.myorder']:
          return myorderIcon
        case locale['platform.nav.item.findprompt']:
          return promptIcon
        case locale['platform.nav.item.findSupply']:
          return findSupplyIcon
        case locale['platform.nav.item.tobuy']:
          return tobuyIcon
        case locale['platform.nav.item.findShop']:
          return findShopsIcon
        case locale['platform.nav.item.integral']:
          return integral
        case locale['platform.nav.item.information']:
          return informationIcon
        default:
          return null
      }
    }

    return (
      <div className={quikcNavClassString} {...others}>
        <div className={styles.quikc_nav_right}>
          <div className={styles.member_card}>
            <div className={styles.member_no_login}>
              <div className={cx(styles.welcome)}>
                <div className={styles.welcome_avatar}>
                  <img src={defaultAvatar} />
                </div>
                <span className={styles.welcome_text}>
                  Hi, {locale['platform.welcome']}
                  {name}
                </span>
              </div>
              <div className={styles.btn_group}>
                <div className={cx(styles.btn_item, styles.primary)}>
                  {locale['platform.btn.login']}
                </div>
                <div className={styles.btn_item}>
                  {locale['platform.btn.register']}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.quick_tab}>
            <div
              className={cx(
                styles.quick_tab_item,
                tabType === 1 ? styles.active : '',
              )}
              onClick={() => handleChangeTabType(1)}
            >
              {locale['platform.seller.service']}
            </div>
            <div
              className={cx(
                styles.quick_tab_item,
                tabType === 2 ? styles.active : '',
              )}
              onClick={() => handleChangeTabType(2)}
            >
              {locale['platform.buyers.service']}
            </div>
          </div>
          <div className={cx(styles.quick_nav_list, styles.bb)}>
            {tabType === 1
              ? sellQuickNavList &&
                sellQuickNavList.map((item, index) => (
                  <span
                    className={cx(styles.quick_nav_list_item)}
                    key={`sell_quick_nav_list_item-${index}`}
                  >
                    <img
                      className={styles.quick_nav_list_item_icon}
                      src={item.icon || showDetaulImg(item.name)}
                    />
                    <span className={cx(styles.quick_nav_list_item_text)}>
                      {item.name}
                    </span>
                  </span>
                ))
              : buyQuickNavList &&
                buyQuickNavList.map((item, index) => (
                  <span
                    className={cx(styles.quick_nav_list_item)}
                    key={`buy_quick_nav_list_item-${index}`}
                  >
                    <img
                      className={styles.quick_nav_list_item_icon}
                      src={item.icon || showDetaulImg(item.name)}
                    />
                    <span className={cx(styles.quick_nav_list_item_text)}>
                      {item.name}
                    </span>
                  </span>
                ))}
          </div>
          <div className={styles.quick_nav_list}>
            {quickNavList &&
              quickNavList.map((item, index) => (
                <span
                  className={styles.quick_nav_list_item}
                  key={`quick_nav_list_item-${index}`}
                >
                  <img
                    className={styles.quick_nav_list_item_icon}
                    src={item.icon || showDetaulImg(item.name)}
                  />
                  <span className={cx(styles.quick_nav_list_item_text)}>
                    {item.name}
                  </span>
                </span>
              ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <LocaleReceiver componentName="Platform">{renderComponent}</LocaleReceiver>
  )
}

export default PlatformQuickNav
