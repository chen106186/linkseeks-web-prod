import React, { useState, useMemo } from 'react'
import cx from 'classnames'
import styles from './index.less'
import LocaleReceiver from '../../../components/LocaleProvider/LocaleReceiver'
import { MobileLocale } from '../../../locale/types/mobile'

interface PackageContainerProps {
  // 商品或优惠券item的占比，跟antd中的col span属性一致 默认8
  span?: number
  // 商品或优惠券row的gutter，跟andt中row gutter属性一致，默认12
  gutter?: any
  // 容器是否滑动
  containerScorll?: boolean
  children?: any
  className?: string
}

const PackageContainer: React.FC<PackageContainerProps> = (
  props: PackageContainerProps,
) => {
  const {
    span = 7,
    gutter = 12,
    containerScorll = false,
    children,
    className,
    ...other
  } = props
  const [activeItem, setActiveItem] = useState<any>()

  // const _tabChange = (key: string) => {
  //   setActiveItem(data[Number(key)])
  // }

  const _onChange = (data: any) => {
    setActiveItem(data)
  }

  const _children = useMemo(() => {
    if (children && !children.length) {
      return children ? [children] : []
    } else {
      return children
    }
  }, [children])

  const _discountPrice = useMemo(() => {
    if (activeItem?.groupPrice) {
      const _text = activeItem?.groupPrice?.split('.')
      return (
        <span
          className={
            styles[
              `lingxi-marketingCard-packageContainer-bottom-left-discountPrice`
            ]
          }
        >
          ¥<span>{_text[0]}</span>.{_text[1]}
        </span>
      )
    } else {
      return null
    }
  }, [activeItem])

  const renderComponent = (locale: MobileLocale) => (
    <div
      className={cx(styles[`lingxi-marketingCard-packageContainer`], className)}
      {...other}
    >
      {/* {activeItem?.detail ? <DetailItem detail={activeItem?.detail} isnull={JSON.stringify(activeItem?.detail) === '{}'} detailType='package' tag='购买商品' /> : null} */}
      {_children?.map((child: any, childIndex: any) => {
        const _ele = React.cloneElement(child, { onTabsChange: _onChange })
        return _ele
      })}
      <div className={styles[`lingxi-marketingCard-packageContainer-bottom`]}>
        <div
          className={
            styles[`lingxi-marketingCard-packageContainer-bottom-left`]
          }
        >
          {locale['mobile.marketing.meal.price']}：{_discountPrice}
          <span
            className={
              styles[
                `lingxi-marketingCard-packageContainer-bottom-left-originalPrice`
              ]
            }
          >
            {activeItem?.groupOriginalPrice
              ? `¥${activeItem?.groupOriginalPrice}`
              : null}
          </span>
        </div>
        <div
          className={
            styles[`lingxi-marketingCard-packageContainer-bottom-right`]
          }
        >
          {locale['mobile.marketing.btn.buy']}
        </div>
      </div>
    </div>
  )

  return (
    <LocaleReceiver componentName="Mobile">{renderComponent}</LocaleReceiver>
  )
}

export default PackageContainer
