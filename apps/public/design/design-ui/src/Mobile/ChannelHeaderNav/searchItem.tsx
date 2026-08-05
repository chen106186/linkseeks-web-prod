import React from 'react'
import { SearchOutlined } from '@ant-design/icons'
import cx from 'classnames'
import styles from './index.less'
import LocaleReceiver from '../../components/LocaleProvider/LocaleReceiver'
import { MobileLocale } from '../../locale/types/mobile'
import { DataItemType } from './index'

interface SearchItemProps {
  data?: DataItemType
  className?: string
}

const SearchItem = (props: SearchItemProps) => {
  const { data, className, ...others } = props

  const classNameString = cx(styles['lingxi-header-search'], className)

  const renderComponent = (locale: MobileLocale) => (
    <div className={classNameString} {...others}>
      <div className={styles['lingxi-header-search-body']}>
        <SearchOutlined className={styles['lingxi-header-search-icon']} />
        <span className={styles['lingxi-header-search-keyword']}>
          {data?.content}
        </span>
        <div className={styles['lingxi-header-search-btn']}>
          {locale['mobile.header.search.btn']}
        </div>
      </div>
    </div>
  )

  return (
    <LocaleReceiver componentName="Mobile">{renderComponent}</LocaleReceiver>
  )
}

export default SearchItem
