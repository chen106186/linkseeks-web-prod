import React from 'react'
import cx from 'classnames'
import { RightOutlined } from '@ant-design/icons'
import styles from './index.less'
import LocaleReceiver from '../../components/LocaleProvider/LocaleReceiver'
import { MobileLocale } from '../../locale/types/mobile'
import CommodityItem, {
  CommodityItemProps,
  EmptyCommodityItem,
} from '../QualityRecommend/RecommendList/CommodityList/item'

interface ShopCommodityItemProps {
  className?: string
  title: string
  dataList: CommodityItemProps[]
}

const ShopCommodityItem: React.FC<ShopCommodityItemProps> = (props) => {
  const { className, title, dataList, ...others } = props

  const classNameString = cx(styles['shop-commodity-item'], className)

  const renderComponent = (locale: MobileLocale) => (
    <div className={classNameString} {...others}>
      <div className={styles['shop-commodity-item-title']}>
        <label>{title}</label>
        <div className={styles['shop-commodity-item-title-more']}>
          <span>{locale['mobile.more.btn']}</span>
          <RightOutlined />
        </div>
      </div>
      <div className={styles['recommend_commodity_list']}>
        {dataList && dataList.length > 0 ? (
          dataList.map((item, index) => (
            <div
              className={styles['recommend_commodity_list_item']}
              key={`${item.name}-${index}`}
            >
              <CommodityItem {...item} sold={null} />
            </div>
          ))
        ) : (
          <div className={styles['recommend_commodity_list_item']}>
            <EmptyCommodityItem />
          </div>
        )}
      </div>
    </div>
  )

  return (
    <LocaleReceiver componentName="Mobile">{renderComponent}</LocaleReceiver>
  )
}

export default ShopCommodityItem
