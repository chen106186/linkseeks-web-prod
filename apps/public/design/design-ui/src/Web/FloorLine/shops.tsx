import React from 'react'
import cx from 'classnames'
import ImageBox from '@apps/components/src/web/ImageBox'
import emptyImg from './images/floor_shops.svg'
import styles from './index.less'

interface ShopsItemType {
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
  shopsList: ShopsItemType[]
  linkUrl?: string
  shopTitle?: string
}

const Shops: React.FC<ShopsProps> = (props) => {
  const {
    className,
    linkdisable = false,
    shopTitle = '推荐店铺',
    shopsList,
    linkUrl,
    ...others
  } = props
  const classString = cx(styles['lingxi-floor-line-shop'], className)

  return (
    <section className={classString} {...others}>
      <div className={styles.shop_title}>{shopTitle}</div>
      <div className={styles.shop_list}>
        {shopsList && shopsList.length > 0 ? (
          shopsList.map((item, index) => (
            <span
              key={`shop_list_item-${item.storeId}-${index}`}
              className={cx(
                styles.shop_list_item,
                !linkdisable ? styles.link : '',
              )}
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
            </span>
          ))
        ) : (
          <img src={emptyImg} />
        )}
      </div>
    </section>
  )
}

export default Shops
