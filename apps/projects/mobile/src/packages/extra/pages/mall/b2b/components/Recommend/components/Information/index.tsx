import React from 'react'
import { View, Text } from '@apps/mobile-ui'
import ImageBox from '@/components/ImageBox'
import { dateFormat, getDateDiff } from '@/utils/date'
import { useIntl } from '@linkseeks/i18n'
import Router from '@/utils/router'
import styles from './index.module.scss'

interface ItemTypeProps {
  columnId: number
  columnName: string
  createTime: number
  id: number
  imageUrl: string
  title: string
  readCount?: number
}

interface InformationProps {
  list: ItemTypeProps[]
}

const Information: React.FC<InformationProps> = (props) => {
  const { list } = props
  const intl = useIntl()

  const _listFooter = () => (
    <Text className={styles['footer']}>
      {intl.formatMessage({ id: 'mall_client_suggestProduct_item_footer_1', defaultMessage: '已经到底啦～' })}
    </Text>
  )

  return list && list.length > 0 ? (
    <View className={styles['informationList']}>
      {list.map((item) => (
        <View
          className={styles['informationItem']}
          key={item.id}
          onClick={() => Router.navigateTo('companyNews/newsInformation', { informationId: item.id })}
        >
          <ImageBox width={120} borderRadius={2} height={80} source={item.imageUrl} />
          <View className={styles['informationInfoWrap']}>
            <Text className={styles['informationTitle']}>{item.title}</Text>
            <View className={styles['informationTagWrap']}>
              <View className={styles['informationTag']}>
                <Text className={styles['informationTagText']}>{item.columnName}</Text>
              </View>
            </View>
            <View className={styles['informationBottom']}>
              <Text className={styles['informationBottomText']}>
                {getDateDiff(dateFormat(new Date(item.createTime)))}
              </Text>
              <View className={styles['informationBottomRight']}>
                <Text className={styles['informationBottomText']}>
                  {item.readCount}
                  {intl.formatMessage({ id: 'mall_recommend_information_read', defaultMessage: '浏览' })}
                </Text>
              </View>
            </View>
          </View>
        </View>
      ))}
      {_listFooter()}
    </View>
  ) : null
}

export default Information
