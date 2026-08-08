import React from 'react'
import { Progress, CustomizeTag } from '@apps/design-ui'
import styles from './index.less'
import classNames from 'classnames'
import Price from '../../Price'
import { GetMarketingAdornMerchantActivityListAdornResponseDetail } from '@apps/apis'
import { getIntl } from '@linkseeks/i18n'

const intl = getIntl()

type ActivityListType = {
  /** 活动类型 */
  belongType: number
  /** 活动id */
  id: number
  /** 活动label */
  label: string
  /** 活动名称 */
  name: string
  /** 类型 */
  type: string
}

type ProductType = GetMarketingAdornMerchantActivityListAdornResponseDetail['goodsList'][0] & {
  hasSold: number
  activityList: ActivityListType[]
}

interface Iprops extends ProductType {
  /** 以下是装修容器提供的属性 */
  className: string
  onMouseOver: () => void
  onClick: () => void
}

const HotCommodityItem: React.FC<Iprops> = (props: Iprops) => {
  const { className, onMouseOver, onClick, ...productData } = props
  const designProps = {
    onMouseOver,
    onClick,
  }

  if (!productData?.productId) {
    return <div className={classNames(styles['hot-commodity'], className, styles.empty)} {...designProps} />
  }

  const renderLabels = () => {
    return (
      <div className={styles['hot-commodity-info-tags']}>
        {productData.activityList.map((_item: ActivityListType) => {
          return (
            <>
              {_item.label && (
                <div className={styles['hot-commodity-info-tags-item']} key={_item.id}>
                  <CustomizeTag type={'danger'} name={_item.label} />
                </div>
              )}
            </>
          )
        })}
      </div>
    )
  }

  return (
    <div className={classNames(styles['hot-commodity'], className)} {...designProps}>
      <img src={productData.productImgUrl} />
      <div className={styles['hot-commodity-info']}>
        <div className={styles['hot-commodity-info-name']}>{productData.productName}</div>
        {renderLabels()}
        <div className={styles['hot-commodity-info-price']}>
          <Price originalPrice={productData.price} discountPrice={productData.activityPrice} unit={productData.unit} />
        </div>
        <div className={styles['commodity-info-hasSold']}>
          {intl.formatMessage({ id: 'activityPage.hasSold', defaultMessage: '已抢' })}
          {`${productData?.hasSold || 0} ${productData.unit}`}
        </div>
      </div>
    </div>
  )
}

export default HotCommodityItem
