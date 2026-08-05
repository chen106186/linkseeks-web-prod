import React from 'react'
import cx from 'classnames'
import { PlusOutlined } from '@ant-design/icons'
import styles from './index.less'
import LocaleReceiver from '../../components/LocaleProvider/LocaleReceiver'
import { MobileLocale } from '../../locale/types/mobile'
import ImageBox from '@apps/components/src/web/ImageBox'
import ShopCredit from '../../components/ShopCredit'
import YearBox from '../../components/ShopCredit/year'

export interface ProductItemType {
  name: string
  mainPic: string
  min: string
  price: number
  priceType: number
}

export interface ShopProps {
  className?: string
  id: number
  registerYears: number | undefined
  creditPoint: number | undefined
  memberName: string
  logo: string
  productList?: ProductItemType[]
  visible?: boolean
}

const ShopItem: React.FC<ShopProps> = (props) => {
  const {
    className,
    registerYears,
    id,
    creditPoint,
    memberName,
    logo,
    productList,
    visible = true,
    ...others
  } = props
  const classNameString = cx(styles['shop-list-item'], className)

  if (!visible) return null

  const renderComponent = (locale: MobileLocale) => {
    return id ? (
      <div className={classNameString} {...others}>
        <div className={styles['shop-list-item-shopheader']}>
          <div className={styles['shop-list-item-shopheader-shoplogo']}>
            <ImageBox width={40} height={40} src={logo} />
          </div>
          <div className={styles['shop-list-item-shopheader-shopinfo']}>
            <div className={styles['shop-list-item-shopheader-shopname']}>
              {memberName}
            </div>
            <div className={styles['shop-list-item-shopheader-shopdetail']}>
              <ShopCredit creditPoint={creditPoint || 0} />
              <YearBox year={registerYears || 0} style={{ marginLeft: 8 }} />
            </div>
          </div>
          <div className={styles['shop-list-item-shopheader-enterbtn']}>
            {locale['mobile.recommendShop.item.enter']}
          </div>
        </div>
        {productList && productList.length > 0 && (
          <div className={styles['shop-list-item-goodslist']}>
            {productList.map((item) => (
              <div
                className={styles['shop-list-item-goodslist-item']}
                key={item.name}
              >
                <ImageBox
                  width={106}
                  height={106}
                  round={4}
                  src={item.mainPic}
                />
                <div
                  className={styles['shop-list-item-goodslist-item-goodsname']}
                >
                  {item.name}
                </div>
                <div
                  className={styles['shop-list-item-goodslist-item-goodsprice']}
                >
                  <span className={styles.goodsPrice}>￥{item.price}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    ) : (
      <div className={classNameString} {...others}>
        <div className={styles['shop-list-item-empty']}>
          <PlusOutlined style={{ color: '#CBCACD' }} />
        </div>
      </div>
    )
  }

  return (
    <LocaleReceiver componentName="Mobile">{renderComponent}</LocaleReceiver>
  )
}

export default ShopItem
