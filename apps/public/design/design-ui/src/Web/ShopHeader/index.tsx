import React from 'react'
import { CaretDownOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import cx from 'classnames'
import styles from './index.less'
import LocaleReceiver from '../../components/LocaleProvider/LocaleReceiver'
import ShopCredit from '../../components/ShopCredit'
import { HeaderLocale } from '../../locale/types/header'
import StarRate from '../StarRate'

interface GetCommodityShopFindShopResponse {
  /**
   * 归属地市(为空的话则为所有) ,MemberShopArea
   */
  memberShopAreas: {
    /**
     * ID
     */
    id: number
    /**
     * 店铺ID
     */
    shopId: number
    /**
     * 省
     */
    province: string
    /**
     * 省编码
     */
    provinceCode: string
    /**
     * 市
     */
    city: string
    /**
     * 市编码
     */
    cityCode: string
  }[]
  /**
   * 店铺ID
   */
  id: number
  /**
   * 店铺LOGO
   */
  logo: string
  /**
   * 公司简介
   */
  describe: string
  /**
   * 厂房照片 :
   */
  workshopPics: string[]
  /**
   * 资质荣誉 :
   */
  honorPics: string[]
  /**
   * 商城ID
   */
  shopId: number
  /**
   * 店铺链接
   */
  storeUrl: string
  /**
   * 客服链接
   */
  customerUrl: string
  /**
   * 归属地市是否为所有: 0:否; 1:是;
   */
  allStatus: number
  /** 店铺名称 */
  name: string
  /**
   * 会员名称
   */
  memberName: string
  /**
   * 满意度
   */
  avgTradeCommentStar: number
  /**
   * 注册年数
   */
  registerYears: number
  /**
   * 信用积分
   */
  creditPoint: number
  /**
   * 注册资本
   */
  registeredCapital: number
  /**
   * 成立日期
   */
  establishmentDate: string
  /**
   * 营业执照
   */
  businessLicence: string
}

interface ShopHeaderPropsType {
  shopInfo: GetCommodityShopFindShopResponse
  logoUrl: string
}

const ShopHeader: React.FC<ShopHeaderPropsType> = (props) => {
  const { shopInfo, logoUrl } = props

  const renderComponent = (locale: HeaderLocale) => {
    const getDate = (value: string) => {
      if (value) {
        const temp = value.split('日')
        if (temp.length > 0) {
          return `${temp[0]}${locale['unit.day']}`
        }
      }
      return null
    }

    return (
      <div className={styles.shop_header}>
        <div className={styles.shop_header_container}>
          <div className={styles.logo}>
            <img src={logoUrl} />
          </div>
          <div className={styles.shop_header_split}></div>
          <div className={styles.shop_header_info}>
            <div className={styles.shop_header_info_logo}>
              <img src={shopInfo?.logo} />
            </div>
            <div className={styles.shop_header_info_content}>
              <div className={styles.shop_header_info_content_name}>
                <span>{shopInfo?.name || shopInfo?.memberName}</span>
                <CaretDownOutlined
                  className={styles.shop_header_info_content_icon}
                />
              </div>
              <div className={styles.shop_header_info_content_about}>
                <ShopCredit creditPoint={shopInfo?.creditPoint || 0} />
              </div>
            </div>
            <div className={styles.shop_info}>
              <div className={styles.shop_info_title}>
                <div className={styles.shop_info_title_split}></div>
                <div className={styles.shop_info_title_text}>
                  {locale['shop.info.title']}
                </div>
                <div className={styles.shop_info_title_split}></div>
              </div>
              <div className={styles.shop_info_body}>
                <div className={styles.shop_info_list}>
                  <div className={styles.shop_info_list_item}>
                    <div className={styles.label}>
                      {locale['shop.creditPoint']}：
                    </div>
                    <div className={styles.breif}>
                      <ShopCredit creditPoint={shopInfo?.creditPoint || 0} />
                    </div>
                  </div>
                  <div className={styles.shop_info_list_item}>
                    <div className={styles.label}>
                      {locale['shop.registeredCapital']}：
                    </div>
                    <div className={styles.breif}>
                      {shopInfo?.registeredCapital || ''}
                    </div>
                  </div>
                  <div className={styles.shop_info_list_item}>
                    <div className={styles.label}>
                      {locale['shop.establishmentDate']}：
                    </div>
                    <div className={styles.breif}>
                      {getDate(shopInfo?.establishmentDate)}
                    </div>
                  </div>
                  <div className={styles.shop_info_list_item}>
                    <div className={styles.label}>
                      {locale['shop.businessLicence']}：
                    </div>
                    <div className={styles.breif}>
                      <span className={styles.certified}>
                        {shopInfo?.businessLicence ? '[已认证]' : '[未认证]'}
                      </span>
                    </div>
                  </div>
                  <div className={styles.shop_info_list_item}>
                    <div className={styles.label}>
                      {locale['shop.avgTradeCommentStar']}：
                    </div>
                    <div className={styles.breif}>
                      <StarRate value={shopInfo?.avgTradeCommentStar || 0} />
                    </div>
                  </div>
                </div>
                <div className={styles.dashed_split}></div>
                <div className={styles.shop_info_btn_group}>
                  <div className={styles.shop_info_btn}>
                    <span>{locale['btn.enter.shop']}</span>
                  </div>
                  <div className={cx(styles.shop_info_btn)}>
                    {locale['btn.collect.shop']}
                  </div>
                </div>
                <Button className={styles.apply_member_btn} type="primary">
                  {locale['apply.shop.member']}
                </Button>
              </div>
            </div>
          </div>
          <div className={styles.mall_search}>
            <div className={styles.mall_search_box}>
              <input
                className={styles.mall_search_input}
                placeholder={locale['search.placeholder']}
              />
              <div className={styles.search_btn}>
                {locale['search.shop.all']}
              </div>
            </div>
            <div className={styles.search_all_btn}>
              {locale['search.site.all']}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <LocaleReceiver componentName="Header">{renderComponent}</LocaleReceiver>
  )
}

export default ShopHeader
