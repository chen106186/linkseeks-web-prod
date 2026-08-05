import React, { useState, useEffect } from 'react'
import { message } from 'antd'
import { history } from '@linkseeks/router-manager'
import { Link } from '@linkseeks/router-core'
import YearBox from '@/components/ShopCredit/year'
import ShopCredit from '@/components/ShopCredit'
import StarRate from '@/components/StarRate'
import shopCreditTagImg from '@/assets/imgs/shop_credit_tag.png'
import { LOGIN_DOMAIN } from '@/constants'
import ApplyMemberButton from '@/components/ApplyMemberButton'
import { useIntl } from '@linkseeks/i18n'
import cx from 'classnames'
import styles from './index.less'
import { postCommodityWebStoreWebCollect } from '@apps/apis'

interface ShopInfoPropsType {
  shopInfo: any
  userInfo: any
  shopUrlParam: string
  updateShopInfo: Function
  siteUrl: string
}

const ShopInfo: React.FC<ShopInfoPropsType> = (props) => {
  const intl = useIntl()
  const { shopInfo, userInfo, shopUrlParam, updateShopInfo } = props
  const [collectState, setCollectState] = useState<boolean>(false)

  useEffect(() => {
    if (shopInfo) {
      setCollectState(shopInfo.collectStatus)
    }
  }, [shopInfo])

  const handleCollect = () => {
    if (!userInfo) {
      history.redirect(LOGIN_DOMAIN)
      return
    }
    const status = !collectState
    const param: any = {
      id: shopInfo.id,
      status,
    }
    postCommodityWebStoreWebCollect(param).then((res) => {
      if (res.code === 1000) {
        updateShopInfo()
        message.destroy()
        if (status) {
          message.success(intl.formatMessage({ id: 'information.detail.CollectionSuccessful' }))
          setCollectState(true)
        } else {
          message.success(intl.formatMessage({ id: 'information.detail.CancelnCollectionSuccessful' }))
          setCollectState(false)
        }
      }
    })
  }

  const showDate = (dateString: string): string => {
    if (dateString && typeof dateString === 'string') {
      return `${dateString.split(intl.formatMessage({ id: 'ShopInfo.index.day' }))[0]}${intl.formatMessage({
        id: 'ShopInfo.index.day',
      })}`
    }
    return ''
  }

  return (
    <div className={styles.shop_info}>
      <div className={styles.shop_info_title}>
        <div className={styles.shop_info_title_body}>
          <div className={styles.shop_info_title_text}>
            <span>{intl.formatMessage({ id: 'ShopInfo.index.Membership' })}</span>
            <img src={shopCreditTagImg} />
          </div>
          <div className={styles.shop_name}>{shopInfo?.memberName}</div>
          <div className={styles.shop_about}>
            <div className={styles.shop_about_year}>
              <YearBox year={shopInfo?.registerYears || 0} />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.shop_info_body}>
        <div className={styles.shop_info_list}>
          <div className={styles.shop_info_list_item}>
            <div className={styles.label}>{intl.formatMessage({ id: 'index.creditPoints' })}：</div>
            <div className={styles.breif}>
              <ShopCredit creditPoint={shopInfo?.creditPoint || 0} />
            </div>
          </div>
          <div className={styles.shop_info_list_item}>
            <div className={styles.label}>{intl.formatMessage({ id: 'ShopInfo.index.registeredCapital' })}：</div>
            <div className={styles.breif}>{shopInfo?.registeredCapital || ''}</div>
          </div>
          <div className={styles.shop_info_list_item}>
            <div className={styles.label}>{intl.formatMessage({ id: 'ShopInfo.index.DateIncorporation' })}：</div>
            <div className={styles.breif}>{showDate(shopInfo?.establishmentDate)}</div>
          </div>
          <div className={styles.shop_info_list_item}>
            <div className={styles.label}>{intl.formatMessage({ id: 'ShopInfo.index.BusinessLicense' })}：</div>
            <div className={styles.breif}>
              <span className={styles.certified}>
                {shopInfo?.businessLicence
                  ? intl.formatMessage({ id: 'ShopInfo.index.Certified' })
                  : intl.formatMessage({ id: 'ShopInfo.index.NotCertified' })}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.dashed_split}></div>
        <div className={styles.shop_info_list_item}>
          <div className={styles.label}>{intl.formatMessage({ id: 'shopAbout.index.Satisfaction' })}：</div>
          <div className={styles.breif}>
            <StarRate value={shopInfo?.avgTradeCommentStar || 0} />
          </div>
        </div>
        <div className={styles.dashed_split}></div>
        <div className={styles.shop_info_btn_group}>
          <div className={styles.shop_info_btn}>
            <Link to={`/shop/${shopUrlParam}`}>{intl.formatMessage({ id: 'ShopInfo.index.EnterStore' })}</Link>
          </div>
          <div className={cx(styles.shop_info_btn, collectState ? styles.active : '')} onClick={() => handleCollect()}>
            {collectState
              ? intl.formatMessage({ id: 'shopAbout.index.collectedStore' })
              : intl.formatMessage({ id: 'shopAbout.index.toCollectedStore' })}
          </div>
        </div>
        <ApplyMemberButton shopInfo={shopInfo} className={styles.apply_member_btn} />
      </div>
    </div>
  )
}

export default ShopInfo
