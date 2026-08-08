import React from 'react'
import cx from 'classnames'
import ImageBox from '@apps/components/src/web/ImageBox'
import startIcon from './imgs/star_icon.png'
import authIcon from './imgs/auth_icon.png'
import businessIcon from './imgs/business_icon.png'
import styles from './index.less'
import { PlatformLocale } from '../../../locale/types/platform'
import LocaleReceiver from '../../../components/LocaleProvider/LocaleReceiver'
import { divide } from 'lodash'

interface MerchantItem {
  id: number
  describe: string
  customerCategoryName: string
  mainCategory: string
  registerYears: number
  avgTradeCommentStar: number
  areas: string
  memberId: string
  memberName: string
  logo: string
}

interface MerchantProps {
  className?: string
  dataList: MerchantItem[]
}

const Merchant: React.FC<MerchantProps> = (props) => {
  const { className, dataList, ...others } = props

  const classNameString = cx(styles.module_card, className)

  const nullArr = Array.from({ length: 3 }, (_, i) => i + 1)

  const nullBottomArr = Array.from({ length: 3 }, (_, i) => i + 1)

  const renderComponent = (locale: PlatformLocale) => (
    <div className={classNameString} {...others}>
      <div className={styles.module_card_title}>
        <i className={styles.module_card_title_icon}>
          <img src={businessIcon} />
        </i>
        <label className={styles.module_card_title_label}>
          {locale['platform.merchant.title']}
        </label>
        <div className={styles.module_card_more}>
          {locale['platform.more.btn']} &gt;
        </div>
      </div>
      <div className={styles.business_list}>
        {dataList?.length > 0 ? (
          dataList.map(
            (item, index) =>
              index < 6 && (
                <div
                  className={styles.business_list_item}
                  key={`business_list_item_${item.id}`}
                >
                  <div className={styles.business_info_wrap}>
                    <div className={styles.business_logo}>
                      <ImageBox width={48} height={48} src={item.logo} />
                    </div>
                    <div className={styles.business_info}>
                      <div className={styles.business_name}>
                        <label>{item.memberName}</label>
                        <span>{item.areas}</span>
                      </div>
                      <div className={styles.info_line}>
                        <div className={styles.business_start}>
                          <img src={startIcon} />
                          <span>{item.avgTradeCommentStar || 0}</span>
                        </div>
                        <div className={styles.business_year}>
                          <span>
                            {locale['platform.merchant.settled']}
                            {item.registerYears || 0}
                            {locale['platform.unit.year']}
                          </span>
                        </div>
                        <div className={styles.business_auto}>
                          <img src={authIcon} />
                          <span>{locale['platform.info.auth']}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={cx(
                      styles.business_describe,
                      index < 3 ? styles.active : '',
                    )}
                  >
                    {item.describe}
                  </div>
                  {index < 3 ? (
                    <div className={styles.category_list_string}>
                      <label>{locale['platform.main.business']}：</label>
                      <span>{item.mainCategory}</span>
                    </div>
                  ) : null}
                </div>
              ),
          )
        ) : (
          <>
            {nullArr?.map((item) => (
              <div className={styles.business_list_null} />
            ))}
            {nullBottomArr?.map((item) => (
              <div className={styles.business_list_null_bottom} />
            ))}
          </>
        )}
      </div>
    </div>
  )

  return (
    <LocaleReceiver componentName="Platform">{renderComponent}</LocaleReceiver>
  )
}

export default Merchant
