import React from 'react'
import { COMMODITY_TYPE } from '@/constants'
import { getWebIntl } from '@/utils/locales'
import { LAYOUT_TYPE } from '@/types/global'
import ImageBox from '@apps/components/src/web/ImageBox'
import { priceFormat } from '@apps/utils'
import styles from './index.module.less'
import useLink from '@/hooks/useLink'

interface InterestedCommodityPropsType {
  dataList: any
  layoutType?: LAYOUT_TYPE
}

const InterestedCommodity: React.FC<InterestedCommodityPropsType> = (props) => {
  const { dataList } = props
  const translate = getWebIntl()
  const { linkPrefix } = useLink()

  return (
    dataList &&
    dataList.length > 0 && (
      <div className={styles.interested_commodity}>
        <div className={styles.interested_commodity_title}>
          <span>{translate('web.resource.mall.ninkenengyeganxingqu')}：</span>
        </div>
        <div className={styles.interested_commodity_list}>
          {dataList.map(
            (item: any, index: number) =>
              index < 5 && (
                <div
                  className={styles.interested_commodity_list_item}
                  key={`interested_commodity_list_item_${item.id}`}
                >
                  <a
                    href={linkPrefix(
                      `/shop/${item.storeId}/${
                        item.priceType === COMMODITY_TYPE.integral ? 'integral' : 'commodity'
                      }/detail/${item.id}`,
                    )}
                    target="_blank"
                  >
                    <div className={styles.interested_commodity_list_item_imgbox}>
                      <ImageBox width={100} height={100} src={item.mainPic} />
                    </div>
                    <div className={styles.interested_commodity_list_item_name}>{item.name}</div>
                    <div className={styles.interested_commodity_list_item_price}>
                      <i>{translate('web.common.currencySymbol')}</i>
                      {priceFormat(item.min)}
                    </div>
                  </a>
                </div>
              ),
          )}
        </div>
      </div>
    )
  )
}

export default InterestedCommodity
