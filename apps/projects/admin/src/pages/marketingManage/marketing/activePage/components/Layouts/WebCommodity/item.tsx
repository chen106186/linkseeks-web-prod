import React from 'react'
import styles from './item.less'
import { CustomizeTag } from '@apps/design-ui'
import classNames from 'classnames'
import Price from '../../Price'
import type { GetMarketingAdornMerchantActivityListAdornResponseDetail } from '@apps/apis'
// import Label from '../Label';

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
  /** 自定义标签 */
  label: string[]
}

interface Iprops extends ProductType {
  /** 以下是装修容器提供的属性 */
  className: string
  onMouseOver: () => void
  onClick: () => void
}

const WebCommodity: React.FC<Iprops> = (props: Iprops) => {
  const { className, onMouseOver, onClick, ...productData } = props
  const designProps = {
    onMouseOver,
    onClick,
  }
  if (!productData.productId) {
    return <div className={classNames(styles.commodity, className, styles.empty)} {...designProps} />
  }

  const renderLabels = () => {
    const labels = productData.activityList
      .map((_item: ActivityListType) => _item.label)
      .concat(productData.label)
      .filter(Boolean)
    return (
      <div className={styles['commodity-info-tags']}>
        {labels.map((_item: string) => {
          return (
            <div className={styles['commodity-info-tags-item']} key={`commodity-info-tags-item_${_item}`}>
              <CustomizeTag type={'danger'} name={_item} />
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className={classNames(styles.commodity, className)} {...designProps}>
      <img className={styles['commodity-image']} src={productData.productImgUrl} />
      <div className={styles['commodity-info']}>
        <div className={styles['commodity-info-name']}>{productData.productName}</div>
        {renderLabels()}
        <div className={styles['commodity-info-price']}>
          <Price originalPrice={productData.price!} discountPrice={productData.activityPrice!} />
        </div>
        {/* <div className={styles['commodity-info-progress']}>
          <Progress
            progressTips='剩余33%'
            extra={
              <div className={styles.buyBtn}>去抢购</div>
            }
          />
        </div> */}
        <div className={styles['commodity-info-hasBuy']}>{`已抢 ${productData?.hasSold || 0} ${productData.unit}`}</div>
      </div>
    </div>
  )
}

export default WebCommodity
