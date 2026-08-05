import React from 'react'
import cx from 'classnames'
import ImageBox from '@apps/components/src/web/ImageBox'
import brandIcon from './brand_icon.png'
import styles from './index.less'
import LocaleReceiver from '../../../components/LocaleProvider/LocaleReceiver'
import { PlatformLocale } from '../../../locale/types/platform'

interface BrandItemType {
  brandId: number
  brandLogo: string
  brandName: string
  describe: string
}

interface BrandProps {
  className?: string
  dataList: BrandItemType[]
}

const Brand: React.FC<BrandProps> = (props) => {
  const { className, dataList, ...others } = props

  const classNameString = cx(styles.module_card, className)

  const nullArr = Array.from({ length: 12 }, (_, i) => i + 1)

  const renderComponent = (locale: PlatformLocale) => (
    <div className={classNameString} {...others}>
      <div className={styles.module_card_title}>
        <i className={styles.module_card_title_icon}>
          <img src={brandIcon} />
        </i>
        <label className={styles.module_card_title_label}>
          {locale['platform.brand.title']}
        </label>
      </div>
      <div className={styles.brand_list}>
        {dataList?.length > 0
          ? dataList.map((item, index) => (
              <div
                key={`item_${index}`}
                className={styles.brand_list_item}
                title={item.describe}
              >
                <ImageBox width={120} height={60} src={item.brandLogo} />
              </div>
            ))
          : nullArr?.map((item) => (
              <div className={styles.brand_list_null}>
                <div className={styles.brand_list_null_text}>品牌logo</div>
              </div>
            ))}
      </div>
    </div>
  )

  return (
    <LocaleReceiver componentName="Platform">{renderComponent}</LocaleReceiver>
  )
}

export default Brand
