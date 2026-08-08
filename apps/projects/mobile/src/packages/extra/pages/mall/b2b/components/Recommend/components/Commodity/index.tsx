import React from 'react'
import { View, Text } from '@apps/mobile-ui'
import { ColumnCommodity } from '@/components/Commodity'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.module.scss'

interface ItemProps {
  list: any[]
}

const Commodity: React.FC<ItemProps> = (props) => {
  const { list } = props
  const intl = useIntl()

  const _listFooter = () => (
    <Text className={styles['footer']}>
      {intl.formatMessage({ id: 'mall_client_suggestProduct_item_footer_1', defaultMessage: '已经到底啦～' })}
    </Text>
  )

  return (
    <View className={styles[`item-container`]}>
      <ColumnCommodity dataSource={list} />
      {_listFooter()}
    </View>
  )
}

export default Commodity
