import React, { useState } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { View, Icons, Picker } from '@apps/mobile-ui'
import { useRouter } from '@apps/mobile-services/utils/taro'
import Search from '@/components/Search'
import { changeYearMonth, getYearMonth } from '@/utils/date'
import cs from 'classnames'
import styles from './index.module.scss'

export type HandleType = 'search' | 'screen'

export type SearchWrapType = {
  onHandleBack: (type: HandleType, params: any) => void
  hideScreenColumn?: boolean
  customColumn?: React.ReactNode
  searchPlaceholder?: string
  /**
   * 自定义外部样式
   */
  customClassName?: string
  /**
   * 自定义外部容器 style
   */
  customStyle?: React.CSSProperties
  useRouterParams?: boolean
}

const SearchWrap = (props: SearchWrapType) => {
  const intl = useIntl()
  const { month, keyword } = useRouter().params
  const {
    onHandleBack,
    hideScreenColumn,
    customColumn,
    searchPlaceholder = intl.formatMessage({ id: 'order.memberName', defaultMessage: '会员名称' }),
    customClassName,
    customStyle,
    useRouterParams,
  } = props
  const [yearMonth, setYearMonth] = useState<string>(useRouterParams && month ? month : getYearMonth())
  const [word, setWord] = useState<string>(useRouterParams && keyword ? decodeURIComponent(keyword) : '')

  // 搜索
  const onSearch = (searchWord: string) => {
    onHandleBack?.('search', searchWord)
  }

  // 筛选
  const onScreen = (e) => {
    setYearMonth(e.detail.value)
    onHandleBack?.('screen', e.detail.value)
  }

  return (
    <View className={cs(styles['search-wrap'], customClassName)} style={customStyle}>
      <Search
        placeholder={searchPlaceholder}
        value={word}
        onSearch={onSearch}
        onChange={(value) => setWord(value)}
        customClassName={styles['search']}
        shape="round"
        clearable
      />
      {!hideScreenColumn && (
        <Picker mode="date" value={yearMonth} fields="month" onChange={onScreen}>
          <View className={styles['screen']}>
            <View className={styles['screen-year-month']}>{changeYearMonth(yearMonth)}</View>
            <Icons name="ArrowDownFill" size={24} />
          </View>
        </Picker>
      )}
      {customColumn}
    </View>
  )
}

SearchWrap.defaultProps = {
  hideScreenColumn: false,
  useRouterParams: false,
}

export default SearchWrap
