import React from 'react'
import { COMMODITY_TYPE } from '@/constants'
import cx from 'classnames'
import { getWebIntl } from '@/utils/locales'
import { getNameByPriceType } from '@/utils'
import { LAYOUT_TYPE } from '@/types/global'
import { numFormat, priceFormat } from '@apps/utils'
import ImageBox from '@apps/components/src/web/ImageBox'
import styles from './index.module.less'
import useLink from '@/hooks/useLink'

interface RecommandPropsTyep {
  dataList: any
  layoutType?: LAYOUT_TYPE
}

const Recommand: React.FC<RecommandPropsTyep> = (props) => {
  const { dataList } = props
  const translate = getWebIntl()
  const { linkPrefix } = useLink()

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
            <div className={cx(styles.recommand_list_item_price, styles.integral)}>
              {info.min === info.max
                ? `${numFormat(info.min)}${translate('web.resource.mall.integral')}`
                : `${numFormat(info.min)}~${numFormat(info.max)}${translate('web.resource.mall.integral')}`}
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
        <div className={styles.recommand_title}>{translate('web.resource.mall.maijiahaizaikan')}</div>
        <div className={styles.recommand_list}>
          {dataList &&
            dataList.map((item: any, index: number) => (
              <a
                href={linkPrefix(`/shop/${item.storeId}/${getNameByPriceType(item.priceType)}/detail/${item.id}`)}
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
