import React from 'react'
import classNames from 'classnames'
import { priceFormat } from '@apps/utils/src/format'
import { getWebIntl } from '@/utils/locales'
import { ConfigConsumer } from '../Generator'
import styles from './index.module.less'

interface GoodsItemType {
  /**
   * 商品ID
   */
  goodsId: number
  /**
   * 商品名称
   */
  goodsName: string
  /**
   * 商品图片
   */
  goodsPicUrl: string
  /**
   * 商品价格
   */
  goodsPrice: string
  /**
   * 店铺ID
   */
  shopId: number
  memberId: number
  memberRoleId: number
}

interface GoodsProps {
  className?: string
  prefixCls?: string
  linkdisable?: boolean
  goodsList: GoodsItemType[]
  linkUrl?: string
  inquiryText?: string
  moneytext?: string
  moneyTitle?: string
}

const translate = getWebIntl()

export class Goods extends React.Component<GoodsProps, {}> {
  renderPriceByType = (info: any) => {
    const { inquiryText = '', moneytext = '' } = this.props
    switch (info.priceType) {
      case 1:
        return (
          <div className={styles.goods_price}>
            <span>{moneytext || translate('web.common.currencySymbol')}</span>
            {priceFormat(info.goodsPrice)}
          </div>
        )
      case 2:
        return (
          <div className={styles.inquiry_price}>
            <label>{inquiryText || translate('web.resource.mall.web.resource.inquiryOnline')}</label>
          </div>
        )
      default:
        break
    }
  }

  renderShowCase = () => {
    const { className, linkdisable = false, goodsList, linkUrl, inquiryText, moneyTitle, ...others } = this.props
    const classString = classNames(styles['lingxi-floor-line-goods'], className)

    return (
      <section className={classString} {...others}>
        <div className={styles.goods_list}>
          {goodsList &&
            goodsList.map((item) => (
              <div key={item.goodsId} className={styles.goods_list_item}>
                <a
                  href={`${linkUrl}/${item.shopId}/commodity/detail/${item.goodsId}`}
                  title={item.goodsName}
                  className={!linkdisable ? styles.link : ''}
                >
                  <div className={styles.goods_img}>
                    <img src={item.goodsPicUrl} alt={item.goodsName} />
                  </div>
                  <div className={styles.goods_name} title={item.goodsName}>
                    {item.goodsName}
                  </div>
                  {this.renderPriceByType(item)}
                </a>
              </div>
            ))}
        </div>
      </section>
    )
  }

  render() {
    return <ConfigConsumer>{this.renderShowCase}</ConfigConsumer>
  }
}
