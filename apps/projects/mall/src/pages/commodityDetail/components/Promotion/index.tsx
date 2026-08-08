import React, { useEffect, useState } from 'react'
import { TagItem } from '@/components/ActivityTags'
import { MarketingTypeEnum } from '@/constants/marketing'
import { getWebIntl } from '@/utils/locales'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import { PromotionItem } from '../../types'
import styles from './index.module.less'
import useLink from '@/hooks/useLink'

interface PromotionProps {
  data: PromotionItem[] | undefined
  skuId: number | undefined
}

const Promotion: React.FC<PromotionProps> = (props) => {
  const { data, skuId } = props
  const [list, setList] = useState<PromotionItem[]>()
  const [expand, setExpand] = useState<boolean>(false)
  const SHOW_COUNT = 2 // 默认显示数量
  const translate = getWebIntl()
  const { linkPrefix } = useLink()
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
      <div className={styles.product_info_promotion_line_label}>{translate('web.resource.mall.cuxiao')}</div>
      <div className={styles.product_info_promotion_line_brief}>
        <div className={styles.product_promotion_list}>
          {list.map(
            (item, index) =>
              (index < SHOW_COUNT || expand) && (
                <div
                  className={styles.product_promotion_list_item}
                  key={`product_promotion_list_item_${item.activityId}`}
                >
                  <TagItem tag={item.preferentialTag} />
                  <span>{item.preferentialTagDesc}</span>
                  {!doNotShowList.includes(item.activityType) && (
                    <a
                      className={styles.activity_link}
                      href={linkPrefix(
                        `/makeUpList/activity/${item.activityId}?belongType=${item.belongType}&skuId=${skuId}`,
                      )}
                    >
                      {translate('web.resource.mall.xiangqing')} &gt;
                    </a>
                  )}
                </div>
              ),
          )}
          {list.length > SHOW_COUNT && (
            <div className={styles.product_promotion_expand} onClick={() => setExpand(!expand)}>
              <span>{expand ? translate('web.resource.mall.shouqi') : translate('web.resource.mall.zhankai')}</span>
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
