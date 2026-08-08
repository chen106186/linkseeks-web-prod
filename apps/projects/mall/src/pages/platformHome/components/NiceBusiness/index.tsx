import React from 'react'
import ImageBox from '@apps/components/src/web/ImageBox'
import cx from 'classnames'
import { SelectAreaItemType } from '@/types/global'
import { useGlobalConext } from '@/context/globalProvider'
import { getWebIntl } from '@/utils/locales'
import startIcon from './imgs/star_icon.png'
import authIcon from './imgs/auth_icon.png'
import businessIcon from '../icons/business_icon.png'
import styles from './index.module.less'

export interface MerchantItem {
  id: number
  describe: string
  customerCategoryName: string
  mainCategory: string
  registerYears: number
  creditPoint: number
  avgTradeCommentStar: number
  areas: string
  memberId: string
  roleId: number
  memberName: string
  logo: string
}

interface NiceBusinessProps {
  dataList: MerchantItem[]
  anchor: string
  templateId: number | undefined
  currentCity: SelectAreaItemType | undefined
}

const NiceBusiness: React.FC<NiceBusinessProps> = (props) => {
  const { dataList, anchor } = props
  const { mallUrl } = useGlobalConext()
  const translate = getWebIntl()

  return (
    <div className={styles.module_card} id={anchor}>
      <div className={styles.module_card_title}>
        <i className={styles.module_card_title_icon}>
          <img src={businessIcon} />
        </i>
        <label className={styles.module_card_title_label}>{translate('web.resource.mall.shilishangjia')}</label>
        <div className={styles.module_card_more}>
          <a href={`${mallUrl?.defaultEnterpriseUrl}/stores`}>
            {translate('web.common.more')}
            &gt;
          </a>
        </div>
      </div>
      <div className={styles.business_list}>
        {dataList &&
          dataList.map((item, index) => (
            <div className={styles.business_list_item} key={`business_list_item_${index}`}>
              <div className={styles.business_info_wrap}>
                <div className={styles.business_logo}>
                  <ImageBox width={48} height={48} src={item.logo} />
                </div>
                <div className={styles.business_info}>
                  <a href={`${mallUrl?.defaultEnterpriseUrl}/shop/${item.id}`} className={styles.business_name}>
                    <label>{item.memberName}</label>
                    <span>{item.areas}</span>
                  </a>
                  <div className={styles.info_line}>
                    <div className={styles.business_start}>
                      <img src={startIcon} />
                      <span>{item.creditPoint || 0}</span>
                    </div>
                    <div className={styles.business_year}>
                      {translate('web.resource.mall.ruzhunian', { year: item.registerYears })}
                    </div>
                    <div className={styles.business_auto}>
                      <img src={authIcon} />
                      <span>{translate('web.resource.mall.xinxiyirenzheng')}</span>
                    </div>
                  </div>
                </div>
              </div>
              {item.describe && (
                <div className={cx(styles.business_describe, index < 3 ? styles.active : '')}>{item.describe}</div>
              )}
              {index < 3 ? (
                <div className={styles.category_list_string}>
                  <label>{translate('web.resource.member.zhuying')}：</label>
                  <span>{item.mainCategory}</span>
                </div>
              ) : null}
            </div>
          ))}
      </div>
    </div>
  )
}

export default NiceBusiness
