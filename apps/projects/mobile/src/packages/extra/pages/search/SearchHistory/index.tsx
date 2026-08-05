import React, { useEffect } from 'react'
import { View, Text } from '@apps/mobile-ui'
import { observer } from 'mobx-react-lite'
import { useStores } from '@/store/useStores'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.module.scss'

interface SearchHistoryPropsType {
  type: string
  onSelect: (value: string) => void
}

const SearchHistory: React.FC<SearchHistoryPropsType> = (props: SearchHistoryPropsType) => {
  const { type, onSelect } = props
  const {
    searchStore: { searchHistory, initSearchHistoryByStorage, clearSearchHistory },
  } = useStores()
  const intl = useIntl()
  useEffect(() => {
    initSearchHistoryByStorage(type)
  }, [])

  const handleQuickSearch = (keyword: string) => {
    onSelect(keyword)
  }

  const handleclearSearchHistory = () => {
    clearSearchHistory(type)
  }

  const historyList = searchHistory

  return (
    <View className={styles['container-history']}>
      <View className={styles['header']}>
        <Text className={styles['title']}>
          {intl.formatMessage({ id: 'search.sousuolishi', defaultMessage: '搜索历史' })}
        </Text>
        <View className={styles['clearHistoryBtn']} onClick={() => handleclearSearchHistory()}>
          {intl.formatMessage({ id: 'search.qingchulishi', defaultMessage: '清除历史' })}
        </View>
      </View>
      <View className={styles['historyList']}>
        {historyList &&
          historyList.map((historyItem) => (
            <View
              className={styles['historyItem']}
              key={`historyItem${historyItem.time}`}
              onClick={() => handleQuickSearch(historyItem.name)}
            >
              <Text className={styles['historyItemText']}>{historyItem.name}</Text>
            </View>
          ))}
      </View>
    </View>
  )
}
SearchHistory.defaultProps = {
  // onSelect: () => {},
}

export default observer(SearchHistory)
