import React from 'react'
import cx from 'classnames'
import { Rate } from 'antd'
import { SearchOutlined, RightOutlined } from '@ant-design/icons'
import ImageBox from '@apps/components/src/web/ImageBox'
import arrowLeftIcon from './icons/arrow-left.png'
import collectIcon from './icons/collect.png'
import styles from './index.less'
import LocaleReceiver from '../../components/LocaleProvider/LocaleReceiver'
import { MobileLocale } from '../../locale/types/mobile'
import StatusBar from '../../components/StatusBar'
import ShopCredit from '../../components/ShopCredit'
import YearBox from '../../components/ShopCredit/year'

export interface DataItemType {
  logo: string
  memberName: string
  registerYears: number
  creditPoint: number
  avgTradeCommentStar: number
}

interface ShopHeaderPorps {
  className?: string
  shopInfo: DataItemType
  backdrop?: string
}

const ShopHeader: React.FC<ShopHeaderPorps> = (props) => {
  const { className, backdrop, shopInfo, ...others } = props

  const classNameString = cx(styles['lingxi-shop-header-nav'], className)

  const renderComponent = (locale: MobileLocale) => (
    <div className={classNameString} {...others}>
      <div className={styles['lingxi-shop-header-nav-bg-wrap']}>
        <img
          src={backdrop ? backdrop : shopInfo?.logo}
          style={{ width: '100%' }}
        />
      </div>
      <div className={styles['lingxi-shop-header-nav-wrap']}>
        <StatusBar styleTheme={1} />
        <div className={styles['lingxi-header-search']}>
          <div className={styles['lingxi-header-search-left']}>
            <img src={arrowLeftIcon} />
          </div>
          <div className={styles['lingxi-header-search-body']}>
            <SearchOutlined className={styles['lingxi-header-search-icon']} />
            <span className={styles['lingxi-header-search-keyword']}>
              {locale['mobile.shop.header.placeholder']}
            </span>
          </div>
          <div className={styles['lingxi-header-search-right']}>
            <img src={collectIcon} />
          </div>
        </div>
        <div className={styles['lingxi-header-shopheader']}>
          <div className={styles['lingxi-header-shopheader-shoplogo']}>
            <ImageBox width={40} height={40} src={shopInfo?.logo} />
          </div>
          <div className={styles['lingxi-header-shopheader-shopinfo']}>
            <div className={styles['lingxi-header-shopheader-shopname']}>
              <span>{shopInfo?.memberName}</span>
              <RightOutlined />
            </div>
            <div className={styles['lingxi-header-shopheader-shopdetail']}>
              <ShopCredit
                creditPoint={shopInfo?.registerYears}
                style={{ marginRight: 8 }}
              />
              <YearBox year={shopInfo?.registerYears} />
              <div
                className={styles['lingxi-header-shopheader-shopdetail-rate']}
              >
                <Rate
                  className={styles.star}
                  disabled
                  style={{ fontSize: 16 }}
                  value={shopInfo.avgTradeCommentStar || 0}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <LocaleReceiver componentName="Mobile">{renderComponent}</LocaleReceiver>
  )
}

export default ShopHeader
