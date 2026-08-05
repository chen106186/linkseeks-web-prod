import React from 'react'
import cx from 'classnames'
import ImageBox from '@apps/components/src/web/ImageBox'
import emptyImg from './images/floor_shops.svg'
import styles from './index.less'

export interface ShopsItemType {
  sort: number
  /**
   * 店铺ID
   */
  storeId: number
  /**
   * 店铺Logo
   */
  logo: string
  /**
   * 店铺名称
   */
  name: string
  memberId: number
  roleId: number
}

interface ShopsProps {
  className?: string
  prefixCls?: string
  linkdisable?: boolean
  storeList: ShopsItemType[]
  linkUrl?: string
  shopTitle?: string
}

const Shops: React.FC<ShopsProps> = (props) => {
  const {
    className,
    linkdisable = false,
    shopTitle = '推荐店铺',
    storeList,
    linkUrl,
    ...others
  } = props
  const classString = cx(styles['lingxi-floor-line-shop'], className)

  return (
    <section className={classString} {...others}>
      <div className={styles.shop_title}>{shopTitle}</div>
      <div className={styles.shop_list}>
        {storeList && storeList.length > 0 ? (
          storeList.map((item, index) => (
            <a
              key={`shop_list_item-${item.storeId}-${index}`}
              className={cx(
                styles.shop_list_item,
                !linkdisable ? styles.link : '',
              )}
              href={!linkdisable ? `/shop/${item.storeId}` : undefined}
            >
              <div className={styles.shop_logo}>
                <ImageBox
                  src={item.logo}
                  alt={item.name}
                  title={item.name}
                  width={36}
                  height={36}
                />
              </div>
              <div className={styles.shop_name} title={item.name}>
                {item.name}
              </div>
            </a>
          ))
        ) : linkdisable ? (
          <img src={emptyImg} />
        ) : null}
      </div>
    </section>
  )
}

export default Shops
