import React from 'react'
import cx from 'classnames'
import { getWebIntl } from '@/utils/locales'
import ShopCredit from '@/components/ShopCredit'
import StarRate from '@/components/StarRate'
import attestationIcon from '@/assets/icons/attestation_icon.png'
import { AppstoreOutlined, EnvironmentOutlined } from '@ant-design/icons'
import { priceFormat } from '@apps/utils/src/format'
import ImageBox from '@apps/components/src/web/ImageBox'
import styles from './list.module.less'
import useLink from '@/hooks/useLink'

interface CommodityListPropsType {
  shopList: any
}

const CommodityList: React.FC<CommodityListPropsType> = (props) => {
  const { shopList } = props
  const translate = getWebIntl()
  const { linkPrefix } = useLink()

  const renderCommodityPrice = (unitPrice: string | number, priceType: number) => {
    if (priceType === 2) {
      return (
        <div className={styles.inquiry_price}>
          <label>{translate('web.resource.mall.zaixianxunjia')}</label>
        </div>
      )
    }
    return (
      <div className={styles.shop_list_goods_item_price}>
        <span className={styles.unit}>{translate('web.common.currencySymbol')}</span>
        <span>{priceFormat(unitPrice)}</span>
      </div>
    )
  }

  return (
    <div className={cx(styles.shop_list)}>
      {shopList.map((item: any, index: number) => (
        <div key={`${item.id}_${index}`} className={cx(styles.shop_list_item, styles.row)}>
          <div className={styles.shop_list_left}>
            <div className={styles.shop_list_info}>
              <div className={styles.shop_list_info_imgbox}>
                <ImageBox width={48} height={48} src={item.logo} />
              </div>
              <div className={styles.shop_list_info_box}>
                <div className={styles.shop_list_info_name}>
                  <a href={linkPrefix(`/shop/${item.id}`)}>{item.name || item.memberName}</a>
                  <div className={styles.shop_satisfaction}>
                    <label>{translate('web.resource.mall.manyidu')}：</label>
                    <StarRate value={item.avgTradeCommentStar || 0} />
                  </div>
                </div>
                <div className={styles.shop_list_info_about}>
                  <ShopCredit creditPoint={item.creditPoint || 0} />
                </div>
              </div>
            </div>
            <div className={styles.shop_list_line} style={{ marginTop: 'auto' }}>
              <AppstoreOutlined className={styles.shop_list_line_icon} />
              <label>{translate('web.resource.member.zhuying')}</label>
              <span className={styles.shop_list_line_brief}>{item.customerCategoryName}</span>
            </div>
            <div className={styles.shop_list_line}>
              <EnvironmentOutlined className={styles.shop_list_line_icon} translate={undefined} />
              <label>{translate('web.resource.mall.areas')}</label>
              <span className={styles.shop_list_line_brief}>{item.areas}</span>
            </div>
            <div className={styles.shop_list_line}>
              <img src={attestationIcon} className={styles.shop_list_line_icon} />
              <label>{translate('web.resource.mall.yishangxinxiyitongguohuiyuanrenzheng')}</label>
              <a href={linkPrefix(`/shop/${item.id}/about`)} className={styles.shop_list_line_link}>
                {translate('web.resource.mall.zizhizhengshu')} &gt;
              </a>
              <a href={linkPrefix(`/shop/${item.id}/about`)} className={styles.shop_list_line_link}>
                {translate('web.resource.mall.gongsixinxi')} &gt;
              </a>
            </div>
          </div>
          <div className={styles.shop_list_goods}>
            {item.productList &&
              item.productList.map(
                (commodityItem: any, commodityIndex: number) =>
                  commodityIndex < 2 && (
                    <a
                      href={linkPrefix(`/shop/${item.id}/commodity/detail/${commodityItem.id}`)}
                      key={commodityItem.id}
                      target="_blank"
                    >
                      <div className={styles.shop_list_goods_item}>
                        <div className={styles.shop_list_goods_item_imgbox}>
                          <ImageBox width={112} height={112} src={commodityItem.mainPic} />
                        </div>
                        {renderCommodityPrice(commodityItem.min, commodityItem.priceType)}
                      </div>
                    </a>
                  ),
              )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default CommodityList
