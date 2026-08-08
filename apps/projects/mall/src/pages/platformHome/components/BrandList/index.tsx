import React from 'react'
import ImageBox from '@apps/components/src/web/ImageBox'
import brandIcon from '../icons/brand_icon.png'
import { getWebIntl } from '@/utils/locales'
import { useGlobalConext } from '@/context/globalProvider'
import styles from './index.module.less'

export interface BrandItemType {
  brandId: number
  brandLogo: string
  brandName: string
  describe: string
  shopId: number
}

interface BrandListProps {
  dataList: BrandItemType[]
  anchor: string
}

const BrandList: React.FC<BrandListProps> = (props) => {
  const { dataList, anchor } = props
  const { mallUrl } = useGlobalConext()
  const translate = getWebIntl()

  return (
    <div className={styles.module_card} id={anchor}>
      <div className={styles.module_card_title}>
        <i className={styles.module_card_title_icon}>
          <img src={brandIcon} />
        </i>
        <label className={styles.module_card_title_label}>{translate('web.resource.mall.pinpaiguan')}</label>
      </div>
      <div className={styles.brand_list}>
        {dataList &&
          dataList.map((item, index) => (
            <div key={`item_${index}`} className={styles.brand_list_item}>
              <a href={`${mallUrl?.defaultEnterpriseUrl}/commodity/b${item.brandId}`} title={item.describe}>
                <ImageBox width={120} height={60} src={item.brandLogo} />
              </a>
            </div>
          ))}
      </div>
    </div>
  )
}

export default BrandList
