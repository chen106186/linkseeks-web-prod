import React, { useState } from 'react'
import cx from 'classnames'
import defaultAvatar from './default_avatar.png'
import arrowRightIcon from './imgs/arrow_right.png'
import styles from './index.less'

import spotGoods1 from './imgs/spot_goods_1.png'
import spotGoods2 from './imgs/spot_goods_2.png'
import spotGoods3 from './imgs/spot_goods_3.png'
import spotGoods4 from './imgs/spot_goods_4.png'
import inquiryGoods1 from './imgs/inquiry_goods_1.png'
import inquiryGoods2 from './imgs/inquiry_goods_2.png'
import inquiryGoods3 from './imgs/inquiry_goods_3.png'
import inquiryGoods4 from './imgs/inquiry_goods_4.png'
import openStore1 from './imgs/open_store_1.png'
import openStore2 from './imgs/open_store_2.png'
import openStore3 from './imgs/open_store_3.png'
import openStore4 from './imgs/open_store_4.png'
import { QuickNavLocal } from '../../locale/types/quicknav'
import LocaleReceiver from '../../components/LocaleProvider/LocaleReceiver'

interface QuickNavPropsType {
  name?: string
  advertList: any
}

const QuickNav: React.FC<QuickNavPropsType> = (props) => {
  const { name } = props
  const [tabType, setTabType] = useState<number>(1) // 1; 卖家服务；2：买家服务

  const handleChangeTabType = (type: number) => {
    if (tabType !== type) {
      setTabType(type)
    }
  }

  const renderComponent = (locale: QuickNavLocal) => {
    const spotGoodsProcess = [
      {
        key: 'spot_goods_1',
        title: locale['quicknav.order.purchase'],
        icon: spotGoods1,
      },
      {
        key: 'spot_goods_2',
        title: locale['quicknav.payment.settlement'],
        icon: spotGoods2,
      },
      {
        key: 'spot_goods_3',
        title: locale['quicknav.logistic.delivery'],
        icon: spotGoods3,
      },
      {
        key: 'spot_goods_4',
        title: locale['quicknav.invoice'],
        icon: spotGoods4,
      },
    ]

    const inquiryGoodsProcess = [
      {
        key: 'inquiry_goods_1',
        title: locale['quicknav.inquiry'],
        icon: inquiryGoods1,
      },
      {
        key: 'inquiry_goods_2',
        title: locale['quicknav.quoted.price'],
        icon: inquiryGoods2,
      },
      {
        key: 'inquiry_goods_3',
        title: locale['quicknav.confirm.price'],
        icon: inquiryGoods3,
      },
      {
        key: 'inquiry_goods_4',
        title: locale['quicknav.goods.order'],
        icon: inquiryGoods4,
      },
    ]

    const openStoreProcess = [
      {
        key: 'open_store_1',
        title: locale['quicknav.apply.settled'],
        icon: openStore1,
      },
      {
        key: 'open_store_2',
        title: locale['quicknav.submit.basicinfo'],
        icon: openStore2,
      },
      {
        key: 'open_store_3',
        title: locale['quicknav.examine.qualifications'],
        icon: openStore3,
      },
      {
        key: 'open_store_4',
        title: locale['quicknav.create.store'],
        icon: openStore4,
      },
    ]

    // 公用快捷导航
    const quickNavList = [
      {
        path: '/commodity?priceType=1',
        title: locale['quicknav.become.member'],
      },
      {
        path: '/commodity?priceType=2',
        title: locale['quicknav.how.order'],
      },
      {
        path: '/purchaseOnline',
        title: locale['quicknav.pay.way'],
      },
      {
        path: '/shops',
        title: locale['quicknav.send.out.goods'],
      },
      {
        path: '/pointsMall',
        title: locale['quicknav.how.invoice'],
      },
      {
        path: '/infomation',
        title: locale['quicknav.after.service'],
      },
    ]

    const renderProcess = () => {
      switch (tabType) {
        case 1:
          return spotGoodsProcess.map((item, index) => (
            <div
              className={styles.quick_nav_list_item_wrap}
              key={`sell_quick_nav_list_item-${item.key}`}
            >
              <div className={cx(styles.quick_nav_list_item, styles.bb)}>
                <img
                  className={styles.quick_nav_list_item_icon}
                  src={item.icon}
                />
                <span className={cx(styles.quick_nav_list_item_text)}>
                  {item.title}
                </span>
              </div>
              {index < spotGoodsProcess.length - 1 && (
                <div className={styles.arrowSplit}>
                  <img src={arrowRightIcon} />
                </div>
              )}
            </div>
          ))
        case 2:
          return inquiryGoodsProcess.map((item, index) => (
            <div
              className={styles.quick_nav_list_item_wrap}
              key={`sell_quick_nav_list_item-${item.key}`}
            >
              <div className={cx(styles.quick_nav_list_item, styles.bb)}>
                <img
                  className={styles.quick_nav_list_item_icon}
                  src={item.icon}
                />
                <span className={cx(styles.quick_nav_list_item_text)}>
                  {item.title}
                </span>
              </div>
              {index < spotGoodsProcess.length - 1 && (
                <div className={styles.arrowSplit}>
                  <img src={arrowRightIcon} />
                </div>
              )}
            </div>
          ))
        case 3:
          return openStoreProcess.map((item, index) => (
            <div
              className={styles.quick_nav_list_item_wrap}
              key={`sell_quick_nav_list_item-${item.key}`}
            >
              <div className={cx(styles.quick_nav_list_item, styles.bb)}>
                <img
                  className={styles.quick_nav_list_item_icon}
                  src={item.icon}
                />
                <span className={cx(styles.quick_nav_list_item_text)}>
                  {item.title}
                </span>
              </div>
              {index < spotGoodsProcess.length - 1 && (
                <div className={styles.arrowSplit}>
                  <img src={arrowRightIcon} />
                </div>
              )}
            </div>
          ))
        default:
          return null
      }
    }

    return (
      <div className={styles.quikc_nav}>
        <div className={styles.quikc_nav_right}>
          <div className={styles.member_card}>
            <div className={styles.member_no_login}>
              <div className={cx(styles.welcome)}>
                <div className={styles.welcome_avatar}>
                  <img src={defaultAvatar} />
                </div>
                <span className={styles.welcome_text}>
                  Hi, {locale['quicknav.welcome']}
                  {name}
                </span>
              </div>
              <div className={styles.btn_group}>
                <div className={cx(styles.btn_item, styles.primary)}>
                  {locale['quicknav.login']}
                </div>
                <div className={styles.btn_item}>
                  {locale['quicknav.register']}
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
              {locale['quicknav.spot.goods.trade']}
            </div>
            <div
              className={cx(
                styles.quick_tab_item,
                tabType === 2 ? styles.active : '',
              )}
              onClick={() => handleChangeTabType(2)}
            >
              {locale['quicknav.goods.inquiry']}
            </div>
            <div
              className={cx(
                styles.quick_tab_item,
                tabType === 3 ? styles.active : '',
              )}
              onClick={() => handleChangeTabType(3)}
            >
              {locale['quicknav.apply.shop']}
            </div>
          </div>
          <div className={styles.quick_nav_list}>{renderProcess()}</div>
          <div className={styles.nav_list_wrap}>
            {quickNavList.map((item, index) => (
              <a
                href="javascript:;"
                className={styles.nav_list_item}
                key={`quick_nav_list_item-${index}`}
              >
                <span className={cx(styles.nav_list_item_text)}>
                  {item.title}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <LocaleReceiver componentName="QuickNav">{renderComponent}</LocaleReceiver>
  )
}

export default QuickNav
