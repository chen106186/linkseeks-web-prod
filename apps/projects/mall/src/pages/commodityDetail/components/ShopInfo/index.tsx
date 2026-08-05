import React, { useState, useEffect } from 'react'
import { message } from 'antd'
import { Link } from 'react-router-dom'
import YearBox from '@/components/ShopCredit/year'
import ShopCredit from '@/components/ShopCredit'
import StarRate from '@/components/StarRate'
import shopCreditTagImg from '@/assets/imgs/shop_credit_tag.png'
import { LinkTo } from '@/utils'
import ApplyMemberButton from '@/components/ApplyMemberButton'
import { getWebIntl } from '@/utils/locales'
import cx from 'classnames'
import { postCommodityWebStoreWebCollect } from '@apps/apis'
import { useGlobalConext } from '@/context/globalProvider'
import styles from './index.module.less'
import { useStoreContext } from '@/context/storeProvider'
import { validateLoginWrapper } from '@/utils/validateLogin'
import useLink from '@/hooks/useLink'

const ShopInfo: React.FC = () => {
  const translate = getWebIntl()
  const { shopInfo, userInfo, url } = useGlobalConext()
  const { collectState, updatecollectState } = useStoreContext()
  const { linkPrefix } = useLink()

  const handleCollect = validateLoginWrapper(() => {
    const status = !collectState
    const param: any = {
      id: shopInfo?.id,
      status,
    }
    postCommodityWebStoreWebCollect(param).then((res) => {
      if (res.code === 1000) {
        message.destroy()
        if (status) {
          message.success(translate('web.resource.mall.shoucangchenggong'))
          updatecollectState?.(true)
        } else {
          message.success(translate('web.resource.mall.quxiaoshoucangchenggong'))
          updatecollectState?.(false)
        }
      }
    })
  })

  return (
    <div className={styles.shop_info}>
      <div className={styles.shop_info_title}>
        <div className={styles.shop_info_title_body}>
          <div className={styles.shop_info_title_text}>
            <span>{translate('web.resource.mall.huiyuanrenzheng')}</span>
            <img src={shopCreditTagImg} />
          </div>
          <div className={styles.shop_name}>{shopInfo?.name || shopInfo?.memberName}</div>
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
            <div className={styles.label}>{translate('web.resource.mall.xinyongjifen')}：</div>
            <div className={styles.breif}>
              <ShopCredit creditPoint={shopInfo?.creditPoint || 0} />
            </div>
          </div>
          <div className={styles.shop_info_list_item}>
            <div className={styles.label}>{translate('web.resource.mall.zhuceziben')}：</div>
            <div className={styles.breif}>{shopInfo?.registeredCapital || ''}</div>
          </div>
          <div className={styles.shop_info_list_item}>
            <div className={styles.label}>{translate('web.resource.mall.chengliriqi')}：</div>
            <div className={styles.breif}>{shopInfo?.establishmentDate}</div>
          </div>
          <div className={styles.shop_info_list_item}>
            <div className={styles.label}>{translate('web.resource.mall.yingyezhizhao')}：</div>
            <div className={styles.breif}>
              <span className={styles.certified}>
                {shopInfo?.businessLicence
                  ? translate('web.resource.mall.yirenzheng')
                  : translate('web.resource.mall.weirenzheng')}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.dashed_split}></div>
        <div className={styles.shop_info_list_item}>
          <div className={styles.label}>{translate('web.resource.mall.manyidu')}：</div>
          <div className={styles.breif}>
            <StarRate value={shopInfo?.avgTradeCommentStar || 0} />
          </div>
        </div>
        <div className={styles.dashed_split}></div>
        <div className={styles.shop_info_btn_group}>
          <div className={styles.shop_info_btn}>
            <Link to={linkPrefix(`/shop/${shopInfo?.id}`)}>{translate('web.resource.mall.jinrudianpu')}</Link>
          </div>
          <div className={cx(styles.shop_info_btn, collectState ? styles.active : '')} onClick={() => handleCollect()}>
            {collectState
              ? translate('web.resource.mall.yishoucangbendian')
              : translate('web.resource.mall.shoucangbendian')}
          </div>
        </div>
        <ApplyMemberButton className={styles.apply_member_btn} />
      </div>
    </div>
  )
}

export default ShopInfo
