import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import React from 'react'
import classNames from 'classnames'
import omit from 'lodash/omit'
import { getWebIntl } from '@/utils/locales'
import { CommodityData } from '.'
import Label from '../Label'
import Price from './price'
import useSwiper from './useSwiper'
import styles from './hotCommodity.module.less'

type HotCommodityData = CommodityData
interface HotCommodityDataProps extends HotCommodityData {
  onClick?: (data: HotCommodityData) => void
}

interface Iprops {
  dataSource: CommodityData[]
  onClick?: ((itemData: HotCommodityData) => void) | null
}

/** 当前屏幕的swiper 一页的宽度 */
const SCREEN_WIDTH = 1200
/** 每个 HotCommodityItem 间隔看度 */
const OFFSET_WIDTH = 16

const HotCommoditySwiper: React.FC<Iprops> = (props: Iprops) => {
  const { dataSource, onClick } = props
  const count = dataSource.length
  const { current, onPrev, onNext } = useSwiper({ count: count })

  const handleClick = (itemData: HotCommodityData) => {
    onClick?.(itemData)
  }

  return (
    <div className={styles.swiper}>
      <div className={classNames(styles['swiper-prev'], { [styles.hidden]: current === 0 })} onClick={onPrev}>
        <LeftOutlined style={{ fontSize: '20px', color: 'red' }} />
      </div>
      <div className={styles['swiper-view']}>
        <div
          className={styles.commodityList}
          style={{ transform: `translateX(${-current * SCREEN_WIDTH + -(current * OFFSET_WIDTH)}px)` }}
        >
          {dataSource.map((_item) => {
            return (
              <div className={styles['commodity-item']} key={_item.id}>
                <HotCommodity {..._item} onClick={handleClick} />
              </div>
            )
          })}
        </div>
      </div>
      <div
        className={classNames(styles['swiper-next'], { [styles.hidden]: (current + 1) * 3 >= count })}
        onClick={onNext}
      >
        <RightOutlined style={{ fontSize: '20px', color: 'red' }} />
      </div>
    </div>
  )
}

const HotCommodity: React.FC<HotCommodityDataProps> = (props: HotCommodityDataProps) => {
  const {
    productImgUrl,
    productName,
    activityPrice,
    label,
    price,
    hasSold,
    unit,
    onClick,
    minOrder = 0,
    stockCount,
  } = props
  const labelList = Array.isArray(label) ? label : [label]
  const translate = getWebIntl()

  const handleClick = () => {
    const commodityData = omit(props, 'onClick')
    onClick?.(commodityData)
  }
  return (
    <div className={styles['hot-commodity']} onClick={handleClick}>
      <img src={productImgUrl} />
      {minOrder === 0 || (stockCount === 0 && <div className={styles['mask-box']}>补货中</div>)}
      <div className={styles['hot-commodity-info']}>
        <div className={styles['hot-commodity-info-name']}>{productName}</div>
        <div className={styles['hot-commodity-info-tags']}>
          {labelList.map((_item, key) => {
            return (
              (_item && (
                <div className={styles['hot-commodity-info-tags-item']} key={key}>
                  <Label mode="ghost" type="danger" name={_item} />
                </div>
              )) ||
              null
            )
          })}
        </div>
        <div className={styles['hot-commodity-info-price']}>
          <Price originalPrice={price} discountPrice={activityPrice!} unit={unit} />
        </div>
        <div className={styles['commodity-info-hasSold']}>
          {translate('web.resource.mall.yiqiang')}
          {`${hasSold || 0}${unit}`}
        </div>
      </div>
    </div>
  )
}

export default HotCommoditySwiper
