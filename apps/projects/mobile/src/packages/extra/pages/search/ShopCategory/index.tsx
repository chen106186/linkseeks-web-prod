import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { Text, View } from '@apps/mobile-ui'
import { observer } from 'mobx-react-lite'
import useFetchState from '@/hooks/useFetchState'
import { FILTER_PARAM_KEY } from '@/components/FilterSortBar/type'
import { useIntl } from '@linkseeks/i18n'
import {
  getProductMobileShopEnterpriseGetFirstCategory,
  GetProductMobileShopEnterpriseGetFirstCategoryResponse,
} from '@apps/apis'
import styles from './index.module.scss'

type ItmeType = {
  /**
   * 主键id
   */
  id: number
  /**
   * 名称
   */
  name: string
  /**
   * 图片url路径
   */
  imageUrl: string
}

interface SearchHistoryPropsType {
  onSelect: Function
}

const ShopCategory: React.FC<SearchHistoryPropsType> = (props) => {
  const { onSelect } = props
  const intl = useIntl()
  const [more, setmore] = useState<boolean>(false)
  const [firstCategoryList, setFirstCategoryList] =
    useFetchState<GetProductMobileShopEnterpriseGetFirstCategoryResponse>([])
  const fetchFirshCategoryList = () => {
    getProductMobileShopEnterpriseGetFirstCategory().then((res) => {
      if (res.code === 1000) {
        setFirstCategoryList(res.data)
      }
    })
  }

  useEffect(() => {
    fetchFirshCategoryList()
  }, [])

  const handleFilter = (item: ItmeType) => {
    onSelect({
      [FILTER_PARAM_KEY.categoryId]: String(item.id),
    })
  }

  return firstCategoryList && firstCategoryList.length > 0 ? (
    <View className={styles['category']}>
      <View className={styles['header']}>
        <Text className={styles['title']}>
          {intl.formatMessage({ id: 'search.dianpufenlei', defaultMessage: '店铺分类' })}
        </Text>
      </View>
      <View className={cx(styles['historyList1'], more ? styles['max_height_auto'] : styles['max_height'])}>
        {firstCategoryList.map((item) => (
          <View className={styles['historyItem']} key={`historyItem${item.id}`} onClick={() => handleFilter(item)}>
            <View className={styles['itemBody']}>
              <Text className={styles['historyItemText']}>{item.name}</Text>
            </View>
          </View>
        ))}
      </View>
      {firstCategoryList.length > 9 && (
        <View className={styles['historyListMore']} onClick={() => setmore(!more)}>
          {more
            ? intl.formatMessage({ id: 'search.shouqi', defaultMessage: '收起' })
            : intl.formatMessage({ id: 'search.zhankai', defaultMessage: '展开更多' })}
        </View>
      )}
    </View>
  ) : null
}

ShopCategory.defaultProps = {
  onSelect: () => {},
}

export default observer(ShopCategory)
