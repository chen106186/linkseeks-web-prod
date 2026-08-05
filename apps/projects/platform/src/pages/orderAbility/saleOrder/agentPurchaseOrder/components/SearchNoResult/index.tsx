import React from 'react'
import noResultIcon from '@/assets/imgs/no_result_icon.png'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.less'

interface NoResultPropsType {
  search?: string
  type?: number // 1:商品， 2:店铺
}

const SearchNoResult: React.FC<NoResultPropsType> = (props) => {
  const { search, type = 1 } = props
  const intl = useIntl()

  return (
    <div className={styles.no_result}>
      <div className={styles.no_result_tip}>
        <div className={styles.no_result_tip_img}>
          <img src={noResultIcon} />
        </div>
        <div className={styles.no_result_tip_text}>
          {search ? (
            <>
              {intl.formatMessage({ id: 'index.SearchNoResult.NoFindWith' })}“
              <span className={styles.no_result_tip_search}>{search}</span>”
              {intl.formatMessage({ id: 'index.SearchNoResult.relevant' })}
              {type === 1
                ? intl.formatMessage({ id: 'order.index.shop' })
                : intl.formatMessage({ id: 'index.Header.shop' })}
            </>
          ) : (
            <>
              {intl.formatMessage({ id: 'index.SearchNoResult.NoFind' })}
              {intl.formatMessage({ id: 'index.SearchNoResult.relevant' })}
              {type === 1
                ? intl.formatMessage({ id: 'order.index.shop' })
                : intl.formatMessage({ id: 'index.Header.shop' })}
            </>
          )}
        </div>
      </div>
      <div className={styles.no_result_suggest}>
        <ul className={styles.no_result_suggest_list}>
          <li>{intl.formatMessage({ id: 'index.SearchNoResult.recommend' })}</li>
          <li>1、{intl.formatMessage({ id: 'index.SearchNoResult.word' })}</li>
          <li>2、{intl.formatMessage({ id: 'index.SearchNoResult.condition' })}</li>
          <li>3、{intl.formatMessage({ id: 'index.SearchNoResult.price' })}</li>
        </ul>
      </div>
    </div>
  )
}

export default SearchNoResult
