/**
 * @Description 优惠券卡片
 */
import React from 'react'
import { Button, message, Tag, Tooltip } from 'antd'
import { formatTimeString } from '@/utils'
import { random } from 'lodash'
import { getIntl } from '@linkseeks/i18n'
import { getWebIntl } from '@apps/locales'
import { GetCommodityShopListShopByReqResponse } from '@apps/apis'
import { REQUEST_HEADER, TOP_DOMAIN } from '@apps/constants'
import { COUPON_STATE_UNUSED, COUPON_STATE_USED, COUPON_STATE_EXPIRED } from '../../utils'
import styles from './index.less'

const intl = getIntl()
const translate = getWebIntl()
type CouponCardDate = {
  /**
   * 领取记录id
   */
  id: number
  /**
   * 优惠券id
   */
  couponId: number
  /**
   * 所属类型1-平台2-商家
   */
  belongType: number
  /**
   * 优惠券名称
   */
  name: string
  /**
   * 优惠券类型,如果所属类型为平台则有1-0元抵扣券2-平台通用优惠券,如果所属类型为商家则有1-0元抵扣券2-商家通用优惠券3-品类优惠券4-品牌优惠券5-商品优惠券
   */
  type: number
  /**
   * 优惠券类型名称
   */
  typeName: string
  /**
   * 券面额
   */
  denomination: number
  /**
   * 使用条件,满多少金额可用
   */
  useConditionMoney: number
  /**
   * 有效时间开始
   */
  validTimeStart: number
  /**
   * 有效时间结束
   */
  validTimeEnd: number
  /**
   * 领取时间
   */
  crateTime: number
  /**
   * 品牌id集合(品牌优惠券才有) ,Long
   */
  brandIds: number[]
  /**
   * 品类id集合(品类优惠券才有) ,Long
   */
  categoryIds: number[]
  /**
   * 商品Id集合(商品优惠券才有) ,Long
   */
  productIds: number[]
  /**
   * 商城信息 ,ShopResponse
   */
  shopList: {
    /**
     * 商城id
     */
    shopId?: number
    /**
     * 商城名称
     */
    shopName?: string
    /**
     * 商城url
     */
    url?: string
  }[]
  /**
   * 券码
   */
  code: string
}

interface CouponCardProps {
  /**
   * 数据，后台数据没有返回 status
   * 所以自己整一个 status
   */
  data: CouponCardDate
  /**
   * 优惠券状态
   */
  status: number
  mallList: GetCommodityShopListShopByReqResponse
}

const CouponCard: React.FC<CouponCardProps> = (props: CouponCardProps) => {
  const { data, status, mallList = [] } = props

  const handleGoUse = () => {
    if (!data.shopList && !data.shopList.length) {
      message.warning(
        intl.formatMessage({
          id: 'coupon.meiyongshiyongshangchengxinxi',
          defaultMessage: '没有适用商城信息，无法进行跳转',
        }),
      )
      return
    }

    const shopList: GetCommodityShopListShopByReqResponse = []
    for (const shopItem of data.shopList) {
      const shopInfo = mallList.find((item) => item.id === shopItem.shopId)
      if (shopInfo) {
        shopList.push(shopInfo)
      }
    }

    const shop = shopList[random(0, shopList.length)] || shopList[0]

    if (!shop || (shop && !shop.url)) {
      message.warning(
        intl.formatMessage({
          id: 'coupon.meiyongshiyongshangchengxinxi',
          defaultMessage: '没有适用商城信息，无法进行跳转',
        }),
      )
      return
    }
    const mallUrl = `${REQUEST_HEADER}${shop.url}.${TOP_DOMAIN}`

    let url = `${mallUrl}${shop.isSelf ? `/${shop.memberId}` : ''}/makeUpList/${data.couponId}?belongType=${
      data.belongType
    }`

    if (data.belongType === 1) {
      url = `${REQUEST_HEADER}${shop.url}.${TOP_DOMAIN}/commodity`
    }

    window.open(url)
  }

  const ACTIONS_MAP = {
    [COUPON_STATE_UNUSED]: (
      <Button type="primary" size="small" onClick={handleGoUse}>
        {intl.formatMessage({ id: 'coupon.qushiyong', defaultMessage: '去使用' })}
      </Button>
    ),
    [COUPON_STATE_USED]: (
      <Button type="primary" size="small" disabled>
        {intl.formatMessage({ id: 'coupon.yishiyong', defaultMessage: '已使用' })}
      </Button>
    ),
    [COUPON_STATE_EXPIRED]: (
      <Button type="primary" size="small" disabled>
        {intl.formatMessage({ id: 'coupon.yiguoqi', defaultMessage: '已过期' })}
      </Button>
    ),
  }

  return (
    <div className={styles['coupon-card']}>
      <div className={styles['coupon-card-left']}>
        <Tag color="red" className={styles['coupon-card-belong']}>
          {data.typeName}
        </Tag>
        <Tooltip title={data.name}>
          <div className={styles['coupon-card-name']}>{data.name}</div>
        </Tooltip>
        <div className={styles['coupon-card-date']}>
          {`${data.validTimeStart ? formatTimeString(data.validTimeStart, 'YYYY-MM-DD') : ''}-${
            data.validTimeEnd ? formatTimeString(data.validTimeEnd, 'YYYY-MM-DD') : ''
          }`}
        </div>
        <div className={styles['coupon-card-code']}>
          {intl.formatMessage({ id: 'coupon.quanma', defaultMessage: '券码' })}：{data.code}
        </div>
        <Tooltip title={data.shopList.map((item) => item.shopName).join('、')}>
          <div className={styles['coupon-card-webs']}>
            {intl.formatMessage({ id: 'coupon.shiyongshangcheng', defaultMessage: '适用商城' })}：
            {data.shopList.map((item) => item.shopName).join('、')}
          </div>
        </Tooltip>
      </div>
      <div className={styles['coupon-card-right']}>
        <div className={styles['coupon-card-yuanWrap']}>
          <span className={styles['coupon-card-yuan']}>{translate('web.common.currencySymbol')}</span>
          <span className={styles['coupon-card-denomination']}>{data.denomination}</span>
        </div>
        <div className={styles['coupon-card-description']}>
          {/* 满
          {data.useConditionMoney}
          元可用 */}
          {intl.formatMessage({
            id: 'coupon.mandatayuankeyong',
            defaultMessage: '满{{data}}元可用',
            data: data.useConditionMoney,
          })}
        </div>
        <div className={styles['coupon-card-actions']}>{ACTIONS_MAP[status]}</div>
      </div>
    </div>
  )
}

export default CouponCard
