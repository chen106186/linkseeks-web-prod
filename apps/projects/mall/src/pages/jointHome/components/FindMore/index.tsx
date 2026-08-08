import React from 'react'
import { UserInfoType } from '@/types/global'
import { getWebIntl } from '@/utils/locales'
import PopularShops from './components/popularShops'
import NewTrade from './components/newTrade'
import ShoppingNews from './components/shoppingNews'
import styles from './index.module.less'

const FindMore: React.FC = () => {
  const translate = getWebIntl()

  return (
    <div className={styles.find_more} id="find_more">
      <div className={styles.find_more_container}>
        <div className={styles.find_more_header}>{translate('web.resource.mall.findmore')}</div>
        <div className={styles.find_more_main}>
          <PopularShops />
          <ShoppingNews />
          <NewTrade />
        </div>
      </div>
    </div>
  )
}

export default FindMore
