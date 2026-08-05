import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import defaultAvatar from '@/components/TopBar/imgs/default_avatar.svg'
import useDomainPath from '@/hooks/useDomainPath'
import { GetOrderReportGetShopOrderResponse, getOrderReportGetShopOrder } from '@apps/apis'
import { getWebIntl } from '@/utils/locales'
import { UserInfoType } from '@/types/global'
import { MEMBER_CENTER_URL } from '@/constants/domain'
import { LinkTo } from '@/utils'
import { authService } from '@apps/services'
import { Advert } from '@apps/design-ui'
import arrowRightIcon from './imgs/arrow_right.png'
import spot_goods_1 from './imgs/spot_goods_1.png'
import spot_goods_2 from './imgs/spot_goods_2.png'
import spot_goods_3 from './imgs/spot_goods_3.png'
import spot_goods_4 from './imgs/spot_goods_4.png'
import inquiry_goods_1 from './imgs/inquiry_goods_1.png'
import inquiry_goods_2 from './imgs/inquiry_goods_2.png'
import inquiry_goods_3 from './imgs/inquiry_goods_3.png'
import inquiry_goods_4 from './imgs/inquiry_goods_4.png'
import open_store_1 from './imgs/open_store_1.png'
import open_store_2 from './imgs/open_store_2.png'
import open_store_3 from './imgs/open_store_3.png'
import open_store_4 from './imgs/open_store_4.png'

import styles from './index.module.less'

interface QuickNavPropsType {
  userInfo: UserInfoType | undefined
  name?: string
  advertList: any
  locationPath: string
}

const QuickNav: React.FC<QuickNavPropsType> = (props) => {
  const { name, userInfo, advertList, locationPath } = props
  const [tabType, setTabType] = useState<number>(1) // 1; 卖家服务；2：买家服务 3: 申请开店
  const [memberMallBacklog, setMemberMallBacklog] = useState<GetOrderReportGetShopOrderResponse>()
  const { LOGIN_DOMAIN, REGISTER_DOMAIN } = useDomainPath(locationPath)
  const translate = getWebIntl()
  const baseUrl = 'https://www.yuque.com/xsnnko/kh076h'

  const handleChangeTabType = (type: number) => {
    if (tabType !== type) {
      setTabType(type)
    }
  }

  const fetchMemberMallBacklog = () => {
    const param: any = {
      isPurchase: userInfo?.memberRoleType === 2 ? 1 : 0,
    }
    getOrderReportGetShopOrder(param).then((res: any) => {
      if (res.code === 1000) {
        setMemberMallBacklog(res.data)
      }
    })
  }

  useEffect(() => {
    if (userInfo) {
      fetchMemberMallBacklog()
    }
  }, [])

  const spotGoodsProcess = [
    {
      key: 'spot_goods_1',
      title: translate('web.resource.mall.orderThePurchase'),
      icon: spot_goods_1,
    },
    {
      key: 'spot_goods_2',
      title: translate('web.resource.mall.paymentSettlement'),
      icon: spot_goods_2,
    },
    {
      key: 'spot_goods_3',
      title: translate('web.resource.mall.logisticsDelivery'),
      icon: spot_goods_3,
    },
    {
      key: 'spot_goods_4',
      title: translate('web.resource.mall.kaijufapiao'),
      icon: spot_goods_4,
    },
  ]

  const inquiryGoodsProcess = [
    {
      key: 'inquiry_goods_1',
      title: translate('web.resource.mall.commodityInquiry'),
      icon: inquiry_goods_1,
    },
    {
      key: 'inquiry_goods_2',
      title: translate('web.resource.mall.commodityQuotation'),
      icon: inquiry_goods_2,
    },
    {
      key: 'inquiry_goods_3',
      title: translate('web.resource.mall.confirmQuote'),
      icon: inquiry_goods_3,
    },
    {
      key: 'inquiry_goods_4',
      title: translate('web.resource.mall.goodsOrdered'),
      icon: inquiry_goods_4,
    },
  ]

  const openStoreProcess = [
    {
      key: 'open_store_1',
      title: translate('web.resource.mall.applyForResidement'),
      icon: open_store_1,
    },
    {
      key: 'open_store_2',
      title: translate('web.resource.mall.submitInformation'),
      icon: open_store_2,
    },
    {
      key: 'open_store_3',
      title: translate('web.resource.mall.reviewQualifications'),
      icon: open_store_3,
    },
    {
      key: 'open_store_4',
      title: translate('web.resource.mall.createStore'),
      icon: open_store_4,
    },
  ]

  // 询价交易快捷导航
  const inquiryQuickNavList = [
    {
      path: baseUrl,
      title: translate('web.resource.mall.askForAnOffer'),
    },
    {
      path: baseUrl,
      title: translate('web.resource.mall.howtoquote'),
    },
    {
      path: baseUrl,
      title: translate('web.resource.mall.confirmQuote'),
    },
    {
      path: baseUrl,
      title: translate('web.resource.mall.makeAnOrder'),
    },
    {
      path: baseUrl,
      title: translate('web.resource.mall.fahuopeisong'),
    },
    {
      path: baseUrl,
      title: translate('web.resource.mall.afterSaleService'),
    },
  ]

  // 申请开店快捷导航
  const applyQuickNavList = [
    {
      path: baseUrl,
      title: translate('web.resource.mall.howtoapply'),
    },
    {
      path: baseUrl,
      title: translate('web.resource.mall.qualificationRequirements'),
    },
    {
      path: baseUrl,
      title: translate('web.resource.mall.reviewProcess'),
    },
    {
      path: baseUrl,
      title: translate('web.resource.mall.createStore'),
    },
    {
      path: baseUrl,
      title: translate('web.resource.mall.postItem'),
    },
    {
      path: baseUrl,
      title: translate('web.resource.mall.takeOrders'),
    },
  ]

  // 现货交易快捷导航
  const quickNavList = [
    {
      path: baseUrl,
      title: translate('web.resource.mall.becomeMember'),
    },
    {
      path: baseUrl,
      title: translate('web.resource.mall.makeAnOrder'),
    },
    {
      path: baseUrl,
      title: translate('web.resource.mall.payType'),
    },
    {
      path: baseUrl,
      title: translate('web.resource.mall.shipping'),
    },
    {
      path: baseUrl,
      title: translate('web.resource.mall.invoice'),
    },
    {
      path: baseUrl,
      title: translate('web.resource.mall.afterSaleService'),
    },
  ]

  const renderQuickNavList = () => {
    switch (tabType) {
      case 1:
        return quickNavList.map((item, index) => (
          <a className={styles.nav_list_item} key={`quick_nav_list_item-${index}`} href={item.path} target="_blank">
            <span className={cx(styles.nav_list_item_text)}>{item.title}</span>
          </a>
        ))
      case 2:
        return inquiryQuickNavList.map((item, index) => (
          <a className={styles.nav_list_item} key={`quick_nav_list_item-${index}`} href={item.path} target="_blank">
            <span className={cx(styles.nav_list_item_text)}>{item.title}</span>
          </a>
        ))
      case 3:
        return applyQuickNavList.map((item, index) => (
          <a className={styles.nav_list_item} key={`quick_nav_list_item-${index}`} href={item.path} target="_blank">
            <span className={cx(styles.nav_list_item_text)}>{item.title}</span>
          </a>
        ))
    }
  }

  const _renderNavList = () => {
    let component
    if (userInfo?.memberRoleType === 1) {
      component = (
        <div className={styles.navList}>
          <div className={styles.navList_item}>
            <div className={styles.navList_item_count}>{memberMallBacklog?.saleToBeVerify || 0}</div>
            <div className={styles.navList_item_text}>
              <a href={`${MEMBER_CENTER_URL}/orderAbility/saleOrder/readyApprovedOrder`}>
                {translate('web.resource.mall.toBeReviewed')}
              </a>
            </div>
          </div>
          <div className={styles.navList_item}>
            <div className={styles.navList_item_count}>{memberMallBacklog?.saleToBeConfirm || 0}</div>
            <div className={styles.navList_item_text}>
              <a href={`${MEMBER_CENTER_URL}/orderAbility/saleOrder/readyConfirmOrder`}>
                {translate('web.resource.mall.toBeConfirmed')}
              </a>
            </div>
          </div>
          <div className={styles.navList_item}>
            <div className={styles.navList_item_count}>{memberMallBacklog?.saleToBeDelivery || 0}</div>
            <div className={styles.navList_item_text}>
              <a href={`${MEMBER_CENTER_URL}/orderAbility/saleOrder/readyAddDelevedOrder`}>
                {translate('web.resource.mall.toShipped')}
              </a>
            </div>
          </div>
        </div>
      )
    } else if (userInfo?.memberRoleType === 2) {
      component = (
        <div className={styles.navList}>
          <div className={styles.navList_item}>
            <div className={styles.navList_item_count}>{memberMallBacklog?.purchaseToBeVerify || 0}</div>
            <div className={styles.navList_item_text}>
              <a href={`${MEMBER_CENTER_URL}/orderAbility/purchaseOrder/firstApprovedOrder`}>
                {translate('web.resource.mall.toBeReviewed')}
              </a>
            </div>
          </div>
          <div className={styles.navList_item}>
            <div className={styles.navList_item_count}>{memberMallBacklog?.purchaseToBePay || 0}</div>
            <div className={styles.navList_item_text}>
              <a href={`${MEMBER_CENTER_URL}/orderAbility/purchaseOrder/readyPayOrder`}>
                {translate('web.resource.mall.toPaid')}
              </a>
            </div>
          </div>
          <div className={styles.navList_item}>
            <div className={styles.navList_item_count}>{memberMallBacklog?.purchaseToBeReceive || 0}</div>
            <div className={styles.navList_item_text}>
              <a href={`${MEMBER_CENTER_URL}/orderAbility/purchaseOrder/readyReceiveOrder`}>
                {translate('web.resource.mall.goodsReceived')}
              </a>
            </div>
          </div>
        </div>
      )
    } else {
      component = null
    }
    return component
  }

  const renderProcess = () => {
    switch (tabType) {
      case 1:
        return spotGoodsProcess.map((item, index) => (
          <div className={styles.quick_nav_list_item_wrap} key={`sell_quick_nav_list_item-${item.key}`}>
            <div className={cx(styles.quick_nav_list_item, styles.bb)}>
              <img className={styles.quick_nav_list_item_icon} src={item.icon} title={item.title} />
              <span className={cx(styles.quick_nav_list_item_text)}>{item.title}</span>
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
          <div className={styles.quick_nav_list_item_wrap} key={`sell_quick_nav_list_item-${item.key}`}>
            <div className={cx(styles.quick_nav_list_item, styles.bb)}>
              <img className={styles.quick_nav_list_item_icon} src={item.icon} title={item.title} />
              <span className={cx(styles.quick_nav_list_item_text)}>{item.title}</span>
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
          <div className={styles.quick_nav_list_item_wrap} key={`sell_quick_nav_list_item-${item.key}`}>
            <div className={cx(styles.quick_nav_list_item, styles.bb)}>
              <img className={styles.quick_nav_list_item_icon} src={item.icon} title={item.title} />
              <span className={cx(styles.quick_nav_list_item_text)}>{item.title}</span>
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

  const handleChangeAccount = () => {
    authService.removeAuth()
    LinkTo(LOGIN_DOMAIN, 'replace')
  }

  return (
    <div className={styles.quikc_nav}>
      <div className={styles.quikc_nav_right}>
        <div className={styles.member_card}>
          <div className={styles.member_no_login}>
            {!userInfo ? (
              <>
                <div className={cx(styles.welcome)}>
                  <div className={styles.welcome_avatar}>
                    <img src={defaultAvatar} />
                  </div>
                  <span className={styles.welcome_text}>
                    Hi, {translate('web.resource.mall.welcome')}
                    {name}
                  </span>
                </div>
                <div className={styles.btn_group}>
                  <div className={cx(styles.btn_item, styles.primary)}>
                    <a href={LOGIN_DOMAIN}>{translate('web.resource.mall.login')}</a>
                  </div>
                  <div className={styles.btn_item}>
                    <a href={REGISTER_DOMAIN}>{translate('web.resource.mall.register')}</a>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className={styles.welcome}>
                  <div className={styles.welcome_avatar}>
                    <img src={userInfo.logo || defaultAvatar} />
                  </div>
                  <div style={{ flex: 1, width: 0 }}>
                    <div className={styles.welcome_text_wrap}>
                      <div className={styles.welcome_text}>{userInfo.userName}</div>
                      <div className={styles.change_account_btn} onClick={handleChangeAccount}>
                        {translate('web.resource.mall.switchAccounts')}
                      </div>
                    </div>
                    <div className={cx(styles.roleTag, userInfo.memberRoleType === 1 ? styles.supply : '')}>
                      {userInfo?.roleName}
                    </div>
                  </div>
                </div>
                {_renderNavList()}
              </>
            )}
          </div>
        </div>
        {/* 商城首页指引隐藏 */}
        {/* <div className={styles.quick_tab}>
          <div
            className={cx(styles.quick_tab_item, tabType === 1 ? styles.active : '')}
            onClick={() => handleChangeTabType(1)}
          >
            {translate('web.resource.mall.spotTrading')}
          </div>
          <div
            className={cx(styles.quick_tab_item, tabType === 2 ? styles.active : '')}
            onClick={() => handleChangeTabType(2)}
          >
            {translate('web.resource.mall.commodityInquiry')}
          </div>
          <div
            className={cx(styles.quick_tab_item, tabType === 3 ? styles.active : '')}
            onClick={() => handleChangeTabType(3)}
          >
            {translate('web.resource.mall.applyOpenAShop')}
          </div>
        </div> */}
        {/* <div className={styles.quick_nav_list}>{renderProcess()}</div> */}
        {/* <div className={styles.nav_list_wrap}>{renderQuickNavList()}</div> */}
        <Advert type="nav" advertList={advertList} tabType={tabType} />
      </div>
    </div>
  )
}

export default QuickNav
