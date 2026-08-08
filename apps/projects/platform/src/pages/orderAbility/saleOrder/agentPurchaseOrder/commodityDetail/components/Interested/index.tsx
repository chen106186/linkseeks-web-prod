import React, { useEffect, useState } from 'react'
import { COMMODITY_TYPE, LAYOUT_TYPE } from '@/constants'
import cx from 'classnames'
import { message } from 'antd'
import { ImageBox } from '@apps/components'
import { numFormat, priceFormat } from '@/utils/numberFomat'
import { useIntl } from '@linkseeks/i18n'
import { getNameByPriceType } from '@/utils'
import styles from './index.less'
import { getWebIntl } from '@apps/locales'
import { postProductShopScoreGetCommodityList, postProductShopStoreGetCommodityList } from '@apps/apis'

interface InterestedPropsType {
  priceType: COMMODITY_TYPE | undefined
  layoutType?: LAYOUT_TYPE
  mallId: number
  shopInfo: any
}
const translate = getWebIntl()
const Interested: React.FC<InterestedPropsType> = (props) => {
  const { priceType = 1, layoutType, mallId, shopInfo } = props
  const [commodityList, setCommodityList] = useState<any>([])
  const intl = useIntl()

  useEffect(() => {
    if (shopInfo && priceType) {
      getchLatelyCommodity()
    }
  }, [shopInfo, priceType])

  const getchLatelyCommodity = () => {
    let getFn
    const param: any = {
      current: 1,
      pageSize: 5,
    }
    const headers: any = {
      type: 1,
      shopId: mallId,
    }
    switch (layoutType) {
      case LAYOUT_TYPE.shop:
      case LAYOUT_TYPE.mall:
        param.storeId = shopInfo.id
        if (priceType === COMMODITY_TYPE.integral) {
          headers.type = 2
          param.priceTypeList = [3]
          getFn = postProductShopScoreGetCommodityList
        } else if (priceType === COMMODITY_TYPE.inquiry) {
          param.priceTypeList = [2]
          getFn = postProductShopStoreGetCommodityList
        } else if (priceType === COMMODITY_TYPE.prompt) {
          param.priceTypeList = [1]
          getFn = postProductShopStoreGetCommodityList
        }
        break
      default:
        break
    }
    getFn &&
      getFn(param, { headers }).then((res) => {
        if (res.code === 1000) {
          message.destroy()
          setCommodityList(res.data.data)
        }
      })
  }

  const showPriceByType = (info: any) => {
    if (info) {
      switch (info.priceType) {
        case COMMODITY_TYPE.inquiry:
          return (
            <div className={styles.inquiry_price}>
              <label>{intl.formatMessage({ id: 'shopList.list.OnlineInquiry' })}</label>
            </div>
          )
        case COMMODITY_TYPE.integral:
          return (
            <div className={cx(styles.interested_product_list_item_price, styles.integral)}>
              {info.min === info.max
                ? `${numFormat(info.min)}${intl.formatMessage({ id: 'pay.pointsMall.integral' })}`
                : `${numFormat(info.min)}~${numFormat(info.max)}${intl.formatMessage({
                    id: 'pay.pointsMall.integral',
                  })}`}
            </div>
          )
        case COMMODITY_TYPE.prompt:
          return (
            <div className={styles.interested_product_list_item_price}>
              <span>{translate('web.common.currencySymbol')}</span> {priceFormat(info.min)}
            </div>
          )
        default:
          return null
      }
    }

    return null
  }

  return (
    <div className={styles.interested}>
      <div className={styles.interested_title}>{intl.formatMessage({ id: 'Interested.index.sales' })}</div>
      <div className={styles.interested_product_list}>
        {commodityList &&
          commodityList.map((item: any) => (
            <a
              href={`/shop/${item.memberId}_${item.memberRoleId}/${getNameByPriceType(item.priceType)}/detail/${
                item.id
              }`}
              key={item.id}
            >
              <div className={styles.interested_product_list_item}>
                <div className={styles.interested_product_list_item_img_box}>
                  <ImageBox width={160} height={160} src={item.mainPic} />
                </div>
                <div className={styles.interested_product_list_item_name}>{item.name}</div>
                {showPriceByType(item)}
              </div>
            </a>
          ))}
      </div>
    </div>
  )
}

export default Interested
