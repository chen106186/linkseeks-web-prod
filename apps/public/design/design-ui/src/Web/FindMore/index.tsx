import React from 'react'
import cx from 'classnames'
import { getWebIntl } from '@apps/locales'
import PopularShops from './components/popularShops'
import ShoppingNews, { InquiryItemType } from './components/shoppingNews'
import NewTrade, { TradeItemType } from './components/newTrade'
import styles from './index.less'

interface IProps {
  visible?: boolean
  /** 显示控制：商城端控制 */
  visibleControl?: boolean
  inquiryList?: InquiryItemType[]
  tradeList?: TradeItemType[]
  className?: string
}

const FindMore: React.FC<IProps> = (props) => {
  const {
    visible = true,
    visibleControl = false,
    inquiryList,
    tradeList,
    className,
    ...others
  } = props
  const translate = getWebIntl()

  return (visibleControl ? visible : true) ? (
    <div className={cx(styles.find_more, className)} id="find_more" {...others}>
      <div className={styles.find_more_container}>
        <div className={styles.find_more_header}>
          {translate('web.resource.mall.findmore' as never)}
        </div>
        <div className={styles.find_more_main}>
          <PopularShops />
          <ShoppingNews list={inquiryList} />
          <NewTrade list={tradeList} />
        </div>
      </div>
    </div>
  ) : null
}

export default FindMore
