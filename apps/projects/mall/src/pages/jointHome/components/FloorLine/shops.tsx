import React from 'react'
import cx from 'classnames'
import { getWebIntl } from '@/utils/locales'
import styles from './index.module.less'

interface ShopsItemType {
  /**
   * 店铺ID
   */
  storeId: number
  /**
   * 公司LOGO
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

const translate = getWebIntl()

const Shops: React.FC<ShopsProps> = (props) => {
  const { shopTitle = '', className, linkdisable = false, shopsList, linkUrl, ...others } = props
  const classString = cx(styles['lingxi-floor-line-shop'], className)

  return (
    <section className={classString} {...others}>
      <div className={styles.shop_title}>{shopTitle || translate('web.resource.mall.tuijiandianpu')}</div>
      <div className={styles.shop_list}>
        {shopsList &&
          shopsList.map((item, index) => (
            <a
              key={`shop_list_item-${item.storeId}`}
              className={cx(styles.shop_list_item, !linkdisable ? styles.link : '')}
              href={`${linkUrl}/${item.storeId}`}
            >
              <div className={styles.shop_logo}>
                <img src={item.logo} alt={item.name} title={item.name} />
              </div>
              <div className={styles.shop_name} title={item.name}>
                {item.name}
              </div>
            </a>
          ))}
      </div>
    </section>
  )
}

export default Shops
