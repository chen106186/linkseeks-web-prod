import React, { useEffect, useState } from 'react'
import { MarketingTypeEnum } from '../../../constants/marketing'
import { PromotionItem } from '../../types'
import { useIntl } from '@linkseeks/i18n'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import TagList from '../../../components/TagList'
import styles from './index.less'

interface PromotionProps {
  data: PromotionItem[] | undefined
  skuId: number | undefined
}

const Promotion: React.FC<PromotionProps> = (props) => {
  const { data, skuId } = props
  const [list, setList] = useState<PromotionItem[]>()
  const [expand, setExpand] = useState<boolean>(false)
  const SHOW_COUNT = 2 // 默认显示数量
  const intl = useIntl()

  const doNotShowList = [MarketingTypeEnum.activity_type_6, MarketingTypeEnum.activity_type_13]

  useEffect(() => {
    if (data && data.length > 0) {
      // 过滤不显示标签的营销活动的显示
      const filterList = [MarketingTypeEnum.activity_type_9, MarketingTypeEnum.activity_type_15]
      const newList = data.filter((item) => !filterList.includes(item.activityType))
      setList(newList)
    } else {
      setList([])
    }
  }, [data])

  return list && list.length > 0 ? (
    <div className={styles.product_info_promotion_line}>
      <div className={styles.product_info_promotion_line_label}>
        {intl.formatMessage({ id: 'commodityDetail.promotion' })}
      </div>
      <div className={styles.product_info_promotion_line_brief}>
        <div className={styles.product_promotion_list}>
          {list.map(
            (item, index) =>
              (index < SHOW_COUNT || expand) && (
                <div
                  className={styles.product_promotion_list_item}
                  key={`product_promotion_list_item_${item.activityId}`}
                >
                  <TagList.Item tag={item.preferentialTag} />
                  <span>{item.preferentialTagDesc}</span>
                  {!doNotShowList.includes(item.activityType) && (
                    <a
                      className={styles.activity_link}
                      href={`/orderAbility/saleOrder/agentPurchaseOrder/activityMakeUp?id=${item.activityId}&belongType=${item.belongType}&skuId=${skuId}`}
                    >
                      {intl.formatMessage({ id: 'commodityDetail.promotion.detail' })} &gt;
                    </a>
                  )}
                </div>
              ),
          )}
          {list.length > SHOW_COUNT && (
            <div className={styles.product_promotion_expand} onClick={() => setExpand(!expand)}>
              <span>
                {expand
                  ? intl.formatMessage({ id: 'order.index.payway.PutAway', defaultMessage: '收起' })
                  : intl.formatMessage({ id: 'order.index.payway.open', defaultMessage: '展开' })}
              </span>
              {expand ? (
                <CaretUpOutlined className={styles.product_promotion_expand_icon} />
              ) : (
                <CaretDownOutlined className={styles.product_promotion_expand_icon} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null
}
export default Promotion
