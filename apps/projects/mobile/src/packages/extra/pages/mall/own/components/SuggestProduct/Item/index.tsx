import React from 'react'
import { View, Text } from '@apps/mobile-ui'
import { ColumnCommodity } from '@/components/Commodity'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.module.scss'

interface ItemProps {
  list: any[]
}

const Item: React.FC<ItemProps> = (props) => {
  const { list } = props

  const intl = useIntl()

  const _listFooter = () => (
    <Text className={styles['footer']}>
      {list.length > 0
        ? intl.formatMessage({ id: 'mall_client_suggestProduct_item_footer_1' })
        : intl.formatMessage({ id: 'mall_client_suggestProduct_item_footer_2' })}
    </Text>
  )

  return (
    <View className={styles[`item-container`]}>
      <ColumnCommodity dataSource={list} />
      {_listFooter()}
    </View>
  )
}

export default Item
