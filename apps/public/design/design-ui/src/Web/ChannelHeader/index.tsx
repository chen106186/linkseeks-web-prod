import React, { useState } from 'react'
import { FileTextOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import cx from 'classnames'
import styles from './index.less'
import LocaleReceiver from '../../components/LocaleProvider/LocaleReceiver'
import ImageBox from '@apps/components/src/web/ImageBox'
import ShopCredit from '../../components/ShopCredit'
import { HeaderLocale } from '../../locale/types/header'

interface ShopHeaderPropsType {
  channelInfo: any
  purchaseText?: string
  logo: string
}

const ChannelHeader: React.FC<ShopHeaderPropsType> = (props) => {
  const { channelInfo, purchaseText, logo } = props
  const [searchValue, setSearchValue] = useState<string>('')
  const [count] = useState<number>(0)

  const renderComponent = (locale: HeaderLocale) => (
    <div className={styles.shop_header}>
      <div className={styles.shop_header_container}>
        <div className={styles.logo}>
          <a href="/">
            <ImageBox width={145} height={50} src={logo} />
          </a>
        </div>
        {channelInfo ? (
          <>
            <div className={styles.shop_header_split}></div>
            <div className={styles.shop_header_info}>
              <div className={styles.shop_header_info_logo}>
                <img src={channelInfo.logo} />
              </div>
              <div className={styles.shop_header_info_content}>
                <div className={styles.shop_header_info_content_name}>
                  <span>{channelInfo.memberName}</span>
                </div>
                <div className={styles.shop_header_info_content_about}>
                  <ShopCredit creditPoint={channelInfo.creditPoint || 0} />
                </div>
              </div>
            </div>
          </>
        ) : null}
        <div className={styles.mall_search}>
          <div className={styles.mall_search_box}>
            <Input
              className={styles.mall_search_input}
              value={searchValue}
              placeholder={locale['search.placeholder']}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <div className={styles.search_btn}>{locale['search.shop.all']}</div>
          </div>
          <div className={styles.search_all_btn}>
            {locale['search.site.all']}
          </div>
        </div>
        <div className={cx(styles.shopping_cart)}>
          <div className={styles.badge}>{count}</div>
          <FileTextOutlined className={styles.card_icon} />
          <span>{purchaseText || locale['purchase.btn']}</span>
        </div>
      </div>
    </div>
  )

  return (
    <LocaleReceiver componentName="Header">{renderComponent}</LocaleReceiver>
  )
}

export default ChannelHeader
