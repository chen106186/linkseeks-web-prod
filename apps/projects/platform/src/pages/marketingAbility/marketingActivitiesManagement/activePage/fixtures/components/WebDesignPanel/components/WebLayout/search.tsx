import React from 'react'
import styles from './search.less'
import { Input } from 'antd'
import { CarOutlined } from '@ant-design/icons'
import { useWebIntl } from '@apps/locales'

const Search: React.FC<{ logo?: string }> = (props) => {
  const translate = useWebIntl()

  return (
    <div className={styles.header}>
      <div className={styles['site-logo']}>{props?.logo && <img src={props?.logo} />}</div>
      <div className={styles.search}>
        <div className={styles['search-type']}>
          <span>{translate('web.resource.marketing.shangpin')}</span>
          <span>{translate('web.resource.marketing.dianpu')}</span>
        </div>
        <div className={styles['search-input']}>
          <div className={styles['search-input-inner']}>
            <Input placeholder={translate('web.resource.marketing.qingshuruguanjianzi')} />
          </div>
          <div className={styles['search-btn']}>{translate('web.common.search')}</div>
        </div>
      </div>
      <div className={styles['header-right']}>
        <div className={styles.btn}>
          <CarOutlined style={{ fontSize: '14px' }} />
          <span className={styles['btn-text']}>{translate('web.resource.marketing.jinhuodan')}</span>
        </div>
      </div>
    </div>
  )
}

export default Search
