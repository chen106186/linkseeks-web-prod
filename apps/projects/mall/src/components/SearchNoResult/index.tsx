import React from 'react'
import noResultIcon from '@/assets/imgs/no_result_icon.png'
import { getWebIntl } from '@/utils/locales'
import styles from './index.module.less'

interface NoResultPropsType {
  search?: string
  type?: number // 1:商品， 2:店铺
}

const SearchNoResult: React.FC<NoResultPropsType> = (props) => {
  const { search, type = 1 } = props
  const translate = getWebIntl()
  return (
    <div className={styles.no_result}>
      <div className={styles.no_result_tip}>
        <div className={styles.no_result_tip_img}>
          <img src={noResultIcon} />
        </div>
        <div className={styles.no_result_tip_text}>
          {search ? (
            <>
              {translate('web.resource.mall.baoqianmeiyouzhaodaoyuxiangguan', {
                search: <span className={styles.no_result_tip_search}>{search}</span>,
                type: type === 1 ? translate('web.resource.mall.commodity') : translate('web.resource.mall.store'),
              })}
            </>
          ) : (
            <>
              {translate('web.resource.mall.baoqianmeiyouzhaodaoxiangguande', {
                type: type === 1 ? translate('web.resource.mall.commodity') : translate('web.resource.mall.store'),
              })}
            </>
          )}
        </div>
      </div>
      <div className={styles.no_result_suggest}>
        <ul className={styles.no_result_suggest_list}>
          <li>{translate('web.resource.mall.jianyinin')}</li>
          <li>1、{translate('web.resource.mall.changshiqitaguanjianzi')}</li>
          <li>2、{translate('web.resource.mall.shidangjianshaoshaixuantiaojian')}</li>
          <li>3、{translate('web.resource.mall.tiaozhengjiagequjian')}</li>
        </ul>
      </div>
    </div>
  )
}

export default SearchNoResult
