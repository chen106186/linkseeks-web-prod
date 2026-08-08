import React, { useEffect, useState } from 'react'
import { COMMODITY_TYPE } from '@/constants'
import cx from 'classnames'
import { message } from 'antd'
import { getNameByPriceType } from '@/utils'
import {
  postProductShopScoreGetCommodityList,
  postProductShopSelfGetCommodityList,
  postProductShopStoreGetCommodityList,
} from '@apps/apis'
import { LAYOUT_TYPE } from '@/types/global'
import { getWebIntl } from '@/utils/locales'
import { numFormat, priceFormat } from '@apps/utils'
import ImageBox from '@apps/components/src/web/ImageBox'
import { useGlobalConext } from '@/context/globalProvider'
import styles from './index.module.less'
import useLink from '@/hooks/useLink'

interface InterestedPropsType {
  priceType: COMMODITY_TYPE | undefined
}

const Interested: React.FC<InterestedPropsType> = (props) => {
  const { priceType = 1 } = props
  const { layoutType, mallInfo, shopInfo } = useGlobalConext()
  const [commodityList, setCommodityList] = useState<any>([])
  const translate = getWebIntl()
  const { linkPrefix } = useLink()

  useEffect(() => {
    if (priceType) {
      getchLatelyCommodity()
    }
  }, [priceType])

  const getchLatelyCommodity = () => {
    let getFn
    const param: any = {
      current: 1,
      pageSize: 5,
      priceTypeList: [priceType],
    }
    const headers: any = {
      type: 1,
      shopId: mallInfo?.id,
    }
    switch (layoutType) {
      case LAYOUT_TYPE.shop:
      case LAYOUT_TYPE.joint:
        param.storeId = shopInfo?.id
        if (priceType === COMMODITY_TYPE.integral) {
          headers.type = 2
          getFn = postProductShopScoreGetCommodityList
        } else {
          getFn = postProductShopStoreGetCommodityList
        }
        break
      case LAYOUT_TYPE.own:
        param.memberId = mallInfo?.memberId
        getFn = postProductShopSelfGetCommodityList
        break
      default:
        break
    }
    getFn &&
      getFn(param, { headers, ctlType: 'none' }).then((res) => {
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
              <label>{translate('web.resource.mall.zaixianxunjia')}</label>
            </div>
          )
        case COMMODITY_TYPE.integral:
          return (
            <div className={cx(styles.interested_product_list_item_price, styles.integral)}>
              {info.min === info.max
                ? `${numFormat(info.min)}${translate('web.resource.mall.integral')}`
                : `${numFormat(info.min)}~${numFormat(info.max)}${translate('web.resource.mall.integral')}`}
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

  const getDetailLink = (info: any) => {
    if (layoutType === LAYOUT_TYPE.own) {
      return linkPrefix(`/${getNameByPriceType(info.priceType)}/detail/${info.id}`)
    } else {
      return linkPrefix(`/shop/${info.storeId}/${getNameByPriceType(info.priceType)}/detail/${info.id}`)
    }
  }

  return (
    <div className={styles.interested}>
      <div className={styles.interested_title}>{translate('web.resource.mall.zuijinxiaoshou')}</div>
      <div className={styles.interested_product_list}>
        {commodityList &&
          commodityList.map((item: any) => (
            <a href={getDetailLink(item)} key={item.id}>
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
