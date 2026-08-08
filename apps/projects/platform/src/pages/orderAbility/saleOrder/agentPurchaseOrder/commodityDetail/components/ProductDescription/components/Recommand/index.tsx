import React from 'react'
import { LAYOUT_TYPE, COMMODITY_TYPE } from '@/constants'
import { ImageBox } from '@apps/components'
import cx from 'classnames'
import { numFormat, priceFormat } from '@/utils/numberFomat'
import { useIntl } from '@linkseeks/i18n'
import { getNameByPriceType } from '@/utils'
import styles from './index.less'
import { getWebIntl } from '@apps/locales'

interface RecommandPropsTyep {
  dataList: any
  layoutType?: LAYOUT_TYPE
}
const translate = getWebIntl()
const Recommand: React.FC<RecommandPropsTyep> = (props) => {
  const { dataList } = props
  const intl = useIntl()

  // const getCommodityDetailLink = (item: any) => {
  //   let link = ""
  //   switch (layoutType) {
  //     // case LAYOUT_TYPE.channel:
  //     //   link = `${GlobalConfig.channelRootRoute}/commodity/detail?id=${item.id}&type=${item.priceType}&channelId=${btoa(JSON.stringify({ shopId: item.storeId, memberId: item.memberId }))}`
  //     //   break
  //     // case LAYOUT_TYPE.ichannel:
  //     //   link = `${GlobalConfig.ichannelRootRoute}/commodity/detail?id=${item.id}&type=${item.priceType}&channelId=${btoa(JSON.stringify({ shopId: item.storeId, memberId: item.memberId }))}`
  //     //   break
  //     default:
  //       link = `/shop/commodity/detail?id=${item.id}&type=${item.priceType}&shopId=${btoa(JSON.stringify({ shopId: item.storeId, memberId: item.memberId }))}`
  //       break
  //   }
  //   return link
  // }

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
            <div className={cx(styles.recommand_list_item_price, styles.integral)}>
              {info.min === info.max
                ? `${numFormat(info.min)}${intl.formatMessage({ id: 'pay.pointsMall.integral' })}`
                : `${numFormat(info.min)}~${numFormat(info.max)}${intl.formatMessage({
                    id: 'pay.pointsMall.integral',
                  })}`}
            </div>
          )
        case COMMODITY_TYPE.prompt:
          return (
            <div className={styles.recommand_list_item_price}>
              {translate('web.common.currencySymbol')}
              {priceFormat(info.min)}
            </div>
          )
        default:
          return null
      }
    }
    return null
  }

  return (
    dataList &&
    dataList.length > 0 && (
      <div className={styles.recommand}>
        <div className={styles.recommand_title}>{intl.formatMessage({ id: 'Recommand.index.stillWatching' })}</div>
        <div className={styles.recommand_list}>
          {dataList &&
            dataList.map((item: any, index: number) => (
              <a
                href={`/shop/${item.memberId}_${item.memberRoleId}/${getNameByPriceType(item.priceType)}/detail/${
                  item.id
                }`}
                key={`recommand_list_item_${index}`}
              >
                <div className={styles.recommand_list_item}>
                  <div className={styles.recommand_list_item_img}>
                    <ImageBox width={180} height={180} src={item.mainPic} />
                  </div>
                  <div className={styles.recommand_list_item_name} title={item.name}>
                    {item.name}
                  </div>
                  {showPriceByType(item)}
                </div>
              </a>
            ))}
        </div>
      </div>
    )
  )
}

export default Recommand
