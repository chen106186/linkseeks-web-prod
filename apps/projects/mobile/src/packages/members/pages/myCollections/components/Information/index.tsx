import React from 'react'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Text, Image, Toast } from '@apps/mobile-ui'
import MellowCard from '@/components/MellowCard'
import { dateFormat } from '@/utils/date'
import Router from '@/utils/router'
import { useIntl } from '@linkseeks/i18n'
import styles from './index.module.scss'
// import ImageBox from '../../../../components/ImageBox'

interface Iprops {
  title: string
  createdTime: number
  readCount: number
  imageUrl: string
  id: number
  /**
   * 1-待上架 2-已上架 3-已下架
   */
  status: 1 | 2 | 3
}

const Information = (props: Iprops) => {
  const { title, createdTime, readCount, imageUrl, id, status } = props
  const created = dateFormat(new Date(createdTime))
  const intl = useIntl()

  const handleJump = () => {
    if (status === 3) {
      Toast.show({
        title: intl.formatMessage({ id: 'card.myCollections.information.unPublished', defaultMessage: '资讯已下架' }),
      })
      return
    }
    Router.navigateTo('companyNews/newsInformation', { informationId: id })
  }

  return (
    <MellowCard style={{ width: '100%' }}>
      <View className={styles['collection-container']} onClick={handleJump}>
        <View className={styles['left']}>
          <Text className={styles['title']}>{title}</Text>
          <View>
            <Text className={styles['coll-info-text']}>{created}</Text>
            <Text className={styles['coll-info-text']}>{`${readCount} ${intl.formatMessage({
              id: 'card.myCollections.information.read',
              defaultMessage: '浏览',
            })}`}</Text>
          </View>
        </View>
        <View className={styles['image-container']}>
          <Image src={imageUrl} style={{ width: pxTransform(120), height: pxTransform(80) }} />
          {(status === 3 && (
            <View className={styles['flag']}>
              <Text className={styles['flag-text']}>
                {intl.formatMessage({ id: 'card.myCollections.status.unPublished', defaultMessage: '已下架' })}
              </Text>
            </View>
          )) ||
            null}
        </View>
      </View>
    </MellowCard>
  )
}
export default Information
