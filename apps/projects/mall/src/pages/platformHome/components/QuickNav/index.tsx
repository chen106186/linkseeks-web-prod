import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { getOrderReportGetShopOrder, GetOrderReportGetShopOrderResponse } from '@apps/apis'
import { useGlobalConext } from '@/context/globalProvider'
import { LinkTo } from '@/utils'
import { getWebIntl } from '@/utils/locales'
import useDomainPath from '@/hooks/useDomainPath'
import { MEMBER_CENTER_URL } from '@/constants/domain'
import defaultAvatar from './default_avatar.svg'
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
import styles from './index.module.less'

export interface QuickNavItemType {
  name: string
  icon: string
  link: string
}

interface DataInfoType {
  sellerBOList: QuickNavItemType[]
  buyerBOList: QuickNavItemType[]
  fastFunctionBOList: QuickNavItemType[]
}

interface QuickNavPropsType {
  name?: string
  dataInfo: DataInfoType
}

const QuickNav: React.FC<QuickNavPropsType> = (props) => {
  const { name, dataInfo } = props
  const { userInfo, pathname } = useGlobalConext()
  const { sellerBOList = [], buyerBOList = [], fastFunctionBOList = [] } = dataInfo
  const [tabType, setTabType] = useState<number>(1) // 1; 卖家服务；2：买家服务
  const [consumerNav, setConsumerNav] = useState<any>()
  const [memberMallBacklog, setMemberMallBacklog] = useState<GetOrderReportGetShopOrderResponse>()
  const { LOGIN_DOMAIN, REGISTER_DOMAIN } = useDomainPath(pathname)

  const handleChangeTabType = (type: number) => {
    if (tabType !== type) {
      setTabType(type)
    }
  }
  const translate = getWebIntl()

  const fetchMemberMallBacklog = () => {
    if (userInfo) {
      const param: any = {
        isPurchase: userInfo.memberRoleType === 2 ? 1 : 0,
      }
      getOrderReportGetShopOrder(param).then((res: any) => {
        if (res.code === 1000) {
          setMemberMallBacklog(res.data)
        }
      })
    }
  }

  useEffect(() => {
    fetchMemberMallBacklog()
  }, [])

  useEffect(() => {
    if (userInfo) {
      getNavList()
    }
  }, [memberMallBacklog])

  const getNavList = () => {
    let component
    if (userInfo && userInfo.memberRoleType === 1) {
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
              <a href={`${MEMBER_CENTER_URL}/orderAbility/saleOrder/readyConfirmDelevedOrder`}>
                {translate('web.resource.mall.toShipped')}
              </a>
            </div>
          </div>
        </div>
      )
    } else if (userInfo && userInfo.memberRoleType === 2) {
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
    component && setConsumerNav(component)
  }

  const goToLink = (path: string) => {
    if (userInfo) {
      return LinkTo(path)
    } else {
      return LinkTo(LOGIN_DOMAIN, 'replace')
    }
  }

  const showDetaulImg = (name: string) => {
    switch (name) {
      case translate('web.resource.mall.shangchuanshangpin'):
        return uploadIcon
      case translate('web.resource.mall.baojia'):
        return offerIcon
      case translate('web.resource.mall.jiedan'):
        return orderIcon
      case translate('web.resource.mall.woyaoqiugou'):
        return buyIcon
      case translate('web.resource.mall.baojiaxinxi'):
        return offerinfoIcon
      case translate('web.resource.mall.wodedingdan'):
        return myorderIcon
      case translate('web.resource.mall.zhaoxianhuo'):
        return promptIcon
      case translate('web.resource.mall.zhaogongying'):
        return findSupplyIcon
      case translate('web.resource.mall.quqiugou'):
        return tobuyIcon
      case translate('web.resource.mall.zhaodianpu'):
        return findShopsIcon
      case translate('web.resource.mall.huanjifen'):
        return integral
      case translate('web.resource.mall.kanzixun'):
        return informationIcon
      default:
        return null
    }
  }

  return (
    <div className={styles.quikc_nav}>
      <div className={styles.quikc_nav_right}>
        <div className={styles.member_card}>
          <div className={styles.member_no_login}>
            {!userInfo ? (
              <>
                <div className={cx(styles.welcome, styles.center)}>
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
                <div className={styles.welcome} style={{ paddingBottom: 8 }}>
                  <div className={styles.welcome_avatar}>
                    <img src={userInfo.logo || defaultAvatar} />
                  </div>
                  <span className={styles.welcome_text}>{userInfo.userName}</span>
                  <div style={{ marginTop: 12 }}>
                    <div className={cx(styles.roleTag, userInfo.memberRoleType === 1 ? styles.supply : '')}>
                      {userInfo?.roleName}
                    </div>
                  </div>
                </div>
                {consumerNav ? consumerNav : null}
              </>
            )}
          </div>
        </div>
        <div className={styles.quick_tab}>
          <div
            className={cx(styles.quick_tab_item, tabType === 1 ? styles.active : '')}
            onClick={() => handleChangeTabType(1)}
          >
            {translate('web.resource.mall.maijiafuwu')}
          </div>
          <div
            className={cx(styles.quick_tab_item, tabType === 2 ? styles.active : '')}
            onClick={() => handleChangeTabType(2)}
          >
            {translate('web.resource.mall.maijiafuwu3')}
          </div>
        </div>
        <div className={cx(styles.quick_nav_list, styles.bb)}>
          {tabType === 1
            ? sellerBOList.map((item, index) => (
                <div
                  onClick={() => goToLink(item.link)}
                  className={cx(styles.quick_nav_list_item)}
                  key={`sell_quick_nav_list_item-${index}`}
                >
                  <img className={styles.quick_nav_list_item_icon} src={item.icon || showDetaulImg(item.name)} />
                  <span className={cx(styles.quick_nav_list_item_text)}>{item.name}</span>
                </div>
              ))
            : buyerBOList.map((item, index) => (
                <div
                  onClick={() => goToLink(item.link)}
                  className={cx(styles.quick_nav_list_item)}
                  key={`buy_quick_nav_list_item-${index}`}
                >
                  <img className={styles.quick_nav_list_item_icon} src={item.icon || showDetaulImg(item.name)} />
                  <span className={cx(styles.quick_nav_list_item_text)}>{item.name}</span>
                </div>
              ))}
        </div>
        <div className={styles.quick_nav_list}>
          {fastFunctionBOList.map((item, index) => (
            <div
              onClick={() => goToLink(item.link)}
              className={styles.quick_nav_list_item}
              key={`quick_nav_list_item-${index}`}
            >
              <img className={styles.quick_nav_list_item_icon} src={item.icon || showDetaulImg(item.name)} />
              <span className={cx(styles.quick_nav_list_item_text)}>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default QuickNav
