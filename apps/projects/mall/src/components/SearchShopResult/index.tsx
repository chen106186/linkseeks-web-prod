import React from 'react'
import noResultIcon from '@/assets/imgs/no_result_icon.png'
import { getWebIntl } from '@/utils/locales'
import HelmetProvider from '@/context/helmetProvider'
import { useGlobalConext } from '@/context/globalProvider'

import styles from './index.module.less'
import { LAYOUT_TYPE } from '@/types/global'
const SearchShopResult: React.FC = () => {
  const translate = getWebIntl()
  const { layoutType } = useGlobalConext()

  return (
    <HelmetProvider
      title={translate('web.resource.mall.baoqianmeiyouzhaodaoxiangguande', {
        type:
          layoutType === LAYOUT_TYPE.shop
            ? translate('web.resource.mall.store')
            : translate('web.resource.mall.shangcheng'),
      })}
    >
      <div className={styles.no_result_container}>
        <div className={styles.no_result}>
          <div className={styles.no_result_tip}>
            <div className={styles.no_result_tip_img}>
              <img src={noResultIcon} />
            </div>
            <div className={styles.no_result_tip_text}>
              {translate('web.resource.mall.baoqianmeiyouzhaodaoxiangguande', {
                type:
                  layoutType === LAYOUT_TYPE.shop
                    ? translate('web.resource.mall.store')
                    : translate('web.resource.mall.shangcheng'),
              })}
            </div>
          </div>
          <div className={styles.no_result_suggest}>
            <ul className={styles.no_result_suggest_list}>
              <li>{translate('web.resource.mall.chuxiandekenengyuanyin')}</li>
              <li>
                1、
                {translate('web.resource.mall.guanliyuandongjielegaishangcheng', {
                  type:
                    layoutType === LAYOUT_TYPE.shop
                      ? translate('web.resource.mall.store')
                      : translate('web.resource.mall.shangcheng'),
                })}
              </li>
              <li>2、{translate('web.resource.mall.shangchenglianjiecuowu')}</li>
              <li>
                3、
                {translate('web.resource.mall.ninhaiweichuangjianqiyongshangcheng', {
                  type:
                    layoutType === LAYOUT_TYPE.shop
                      ? translate('web.resource.mall.store')
                      : translate('web.resource.mall.shangcheng'),
                })}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </HelmetProvider>
  )
}

export default SearchShopResult
