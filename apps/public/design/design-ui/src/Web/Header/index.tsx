import React, { useState } from 'react'
import cx from 'classnames'
import { FileTextOutlined } from '@ant-design/icons'
import styles from './index.less'
import LocaleReceiver from '../../components/LocaleProvider/LocaleReceiver'
import ImageBox from '@apps/components/src/web/ImageBox'
import { HeaderLocale } from '../../locale/types/header'

interface HeaderPropsType {
  type: string
  purchaseText?: string
  logoUrl: string
}

const Header: React.FC<HeaderPropsType> = (props) => {
  const { type = 'mall', purchaseText, logoUrl } = props // type: shop: 店铺; mall：商城; platform: 平台首页
  const [searchType, setSearchType] = useState<number>(1) // 1:商品； 2：店铺

  const handleChangeSearchType = (type: number) => {
    if (searchType !== type) {
      setSearchType(type)
    }
  }

  const renderComponent = (locale: HeaderLocale) => {
    return (
      <div className={styles['header']}>
        <div className={styles['header_container']}>
          <div className={styles['logo']}>
            <ImageBox width={240} height={56} src={logoUrl} />
          </div>
          <div className={styles['mall_search']}>
            {type === 'mall' && (
              <div className={styles['mall_search_tags']}>
                <div
                  className={cx(
                    styles['mall_search_tags_item'],
                    searchType === 1 ? styles['active'] : '',
                  )}
                  onClick={() => handleChangeSearchType(1)}
                >
                  {locale['mall.commodity']}
                </div>
                <div className={styles['mall_search_tags_item_split']}></div>
                <div
                  className={cx(
                    styles['mall_search_tags_item'],
                    searchType === 2 ? styles['active'] : '',
                  )}
                  onClick={() => handleChangeSearchType(2)}
                >
                  {locale['mall.shop']}
                </div>
              </div>
            )}
            {type === 'platform' && (
              <div className={styles['mall_search_tags']}>
                <div
                  className={cx(
                    styles['mall_search_tags_item'],
                    searchType === 1 ? styles['active'] : '',
                  )}
                  onClick={() => handleChangeSearchType(1)}
                >
                  {locale['platform.buy.spotgoods']}
                </div>
                <div className={styles['mall_search_tags_item_split']}></div>
                <div
                  className={cx(
                    styles['mall_search_tags_item'],
                    searchType === 2 ? styles['active'] : '',
                  )}
                  onClick={() => handleChangeSearchType(2)}
                >
                  {locale['platform.search.supplier']}
                </div>
                <div className={styles['mall_search_tags_item_split']}></div>
                <div
                  className={cx(
                    styles['mall_search_tags_item'],
                    searchType === 3 ? styles['active'] : '',
                  )}
                  onClick={() => handleChangeSearchType(3)}
                >
                  {locale['platform.look.information']}
                </div>
              </div>
            )}
            <div className={styles['mall_search_box']}>
              <input
                className={styles['mall_search_input']}
                placeholder={locale['search.placeholder']}
              />
              <div className={styles['search_btn']}>{locale['search.btn']}</div>
            </div>
          </div>
          {(type === 'mall' || type === 'platform' || type === 'own') && (
            <div
              className={cx(
                styles['shopping_cart'],
                (type === 'mall' || type === 'platform') && styles['mall'],
              )}
            >
              <FileTextOutlined className={styles['card_icon']} />
              <span>{purchaseText || locale['purchase.btn']}</span>
              <div className={styles['badge']}>0</div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <LocaleReceiver componentName="Header">{renderComponent}</LocaleReceiver>
  )
}

export default Header
