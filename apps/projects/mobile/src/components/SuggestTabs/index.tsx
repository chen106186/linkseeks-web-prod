import React, { useState, useMemo, useRef, useImperativeHandle } from 'react'
import { observer } from 'mobx-react-lite'
import { View, Text, Tabs } from '@apps/mobile-ui'
import { CurrentCityType } from '@/store/locationStore/model'
import cx from 'classnames'
import Commodity from './components/Commodity'
import styles from './index.module.scss'

export interface ItemType {
  num: number
  type: number
  explain: string
  title: string
  details: any[]
  id?: number[]
  selectIds?: number[]
  customize: {
    id: number
    tags?: string[]
  }[]
}

interface SuggestProps {
  activeKey: number
  currentRef: any
  shopId?: number
  details: ItemType[]
  scroll: boolean
  ref?: any
  currentCity: CurrentCityType | undefined
  refreshing: boolean
  onScrollToUpper?: (state: boolean) => void
  onTabChange: (index: number) => void
}

const SuggestTabs: React.FC<SuggestProps> = (props) => {
  const { details, scroll, activeKey, shopId, currentRef, onTabChange } = props
  const tabsRef = useRef<any>()
  const [loadMore, setLoadMore] = useState<boolean>(false)

  const _renderTabItems = useMemo(() => {
    if (details && details.length > 0) {
      const _tabItemList: any[] = []
      for (const item of details) {
        if (item.title) {
          _tabItemList.push({
            title: (
              <View className={styles['tab-item']}>
                <Text className={styles['tab-item-title']}>{item?.title}</Text>
                <View className={styles['tab-item-explain-wrap']}>
                  <View className={styles['tab-item-explain']}>{item?.explain}</View>
                </View>
              </View>
            ),
          })
        }
      }
      return _tabItemList
    }
    return []
  }, [details])

  const handleTabClick = (index: number) => {
    onTabChange(index)
  }

  const handleLoadMore = () => {
    setLoadMore(true)
  }

  useImperativeHandle(currentRef, () => ({
    loadMore: handleLoadMore,
  }))

  const renderTabPane = useMemo(() => {
    const bodyStyle: React.CSSProperties = {
      transition: 'unset',
    }
    const transformStyle = `translate3d(-${activeKey * 100}%, 0px, 0px)`

    Object.assign(bodyStyle, {
      transform: transformStyle,
      WebkitTransform: transformStyle,
    })

    const renderComponentByType = (info: ItemType, index) => {
      return (
        <Commodity
          loadMore={loadMore}
          loadMoreFn={setLoadMore}
          id={`swiperItem_view_${index}`}
          actived={index === activeKey}
          tabInfo={info}
          refreshing={false}
        />
      )
    }

    if (details && details.length > 0) {
      return (
        <View className={styles['mall-recommend-tabs__body']}>
          <View className={styles['mall-recommend-tabs-transform']} style={bodyStyle}>
            {details.map((item, index) => (
              <View
                className={cx(
                  styles['mall-recommend-tabs-pane'],
                  index === activeKey ? styles['actived'] : styles['unactived'],
                )}
                id={`swiperItem_view_${index}`}
                key={`pannel_${index}`}
              >
                {renderComponentByType(item, index)}
              </View>
            ))}
          </View>
        </View>
      )
    }
    return null
  }, [details, loadMore, activeKey, shopId])

  return (
    <View className={cx(styles['mall-recommend'])} id="mallRecommend">
      <Tabs
        className={cx(styles['mall-recommend-tabs'], scroll ? styles['fixed'] : '')}
        ref={tabsRef}
        current={activeKey}
        tabList={_renderTabItems}
        onClick={handleTabClick}
        transparentBg
        hideUnderLine
        activeColor="#00A98F"
      />
      {renderTabPane}
    </View>
  )
}

SuggestTabs.defaultProps = {
  scroll: true,
}

export default observer(SuggestTabs)
