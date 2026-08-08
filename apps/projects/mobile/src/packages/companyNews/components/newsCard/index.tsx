import React from 'react'
import { View, Text, Image, Toast } from '@apps/mobile-ui'
import Router from '@/utils/router'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { dateFormat, getDateDiff } from '@/utils/date'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.module.scss'

interface Props {
  Item: any
  childrenNode?: React.ReactNode
  type?: boolean
  keyword?: string
}
const NewCard = (props: Props) => {
  const { Item, childrenNode, type, keyword } = props
  const intl = useIntl()
  const handleJump = () => {
    if (Item.status === 3) {
      Toast.show({
        icon: 'none',
        title: intl.formatMessage({ id: 'companyNews.component.zixunyixiajia', defaultMessage: '资讯已下架' }),
      })
      return
    }
    Router.navigateTo('companyNews/newsInformation', { informationId: Item.id })
  }
  return (
    <View className={styles['news-warp-item']} onClick={handleJump}>
      <View className={styles['box']}>
        <View>
          <Text className={`${Item.imageUrl ? styles['title'] : styles['title1']}`}>
            <Text>{Item.title.split(keyword)[0]}</Text>
            <Text style={{ color: 'red' }}>{keyword}</Text>
            <Text>{Item.title.split(keyword)[1]}</Text>
          </Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text className={styles['msg']} style={{ marginRight: pxTransform(20) }}>
            {Item.columnName}
          </Text>
          {type && (
            <Text className={styles['msg']} style={{ marginRight: pxTransform(10) }}>
              {getDateDiff(dateFormat(new Date(Item.createTime)))}
            </Text>
          )}
          {childrenNode || <Text className={styles['msg']}>{getDateDiff(dateFormat(new Date(Item.createTime)))}</Text>}
        </View>
      </View>
      {Item.imageUrl ? <Image className={styles['url']} src={String(Item.imageUrl)} /> : null}
    </View>
  )
}
NewCard.defaultProps = {
  childrenNode: null,
}

export default NewCard
