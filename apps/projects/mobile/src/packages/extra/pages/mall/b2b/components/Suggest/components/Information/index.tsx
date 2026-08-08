import React, { useEffect, useState } from 'react'
import { View, Text } from '@apps/mobile-ui'
import ImageBox from '@/components/ImageBox'
import { getManageContentInformationListAdorn } from '@apps/apis'
import { dateFormat, getDateDiff } from '@/utils/date'
import { useIntl } from '@linkseeks/i18n'
import Router from '@/utils/router'
import { ItemType } from '../..'
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
  id: string
  actived: boolean
  shopId: number | undefined
  tabInfo: ItemType
  onSwiperHeightChange?: (height: number) => void
}

const Information: React.FC<InformationProps> = (props) => {
  const { tabInfo, actived, shopId } = props
  const intl = useIntl()
  const [dataList, setDataList] = useState<ItemTypeProps[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [hasMore, setHasMore] = useState<boolean>(true)

  const getDataList = (): Promise<any[]> => {
    if (loading) {
      return Promise.reject()
    }

    setLoading(true)
    return new Promise(async (resolve, reject) => {
      try {
        const infoIds = tabInfo?.details?.map((item) => item.id) || []
        if (infoIds && infoIds.length > 0) {
          const param: any = {
            idInList: infoIds.join(','),
            shopId,
            current: 1,
            pageSize: 50,
          }
          const res = await getManageContentInformationListAdorn(param)
          if (res.code === 1000) {
            const infoList =
              res.data.data &&
              res.data.data.map((item) => ({
                ...item,
              }))
            resolve(infoList)
            setHasMore(false)
          }
        }
        setLoading(false)
      } catch (error) {
        reject()
        setLoading(false)
      }
    })
  }

  useEffect(() => {
    if (tabInfo && actived && hasMore) {
      getDataList()
        .then((res) => {
          setDataList(res)
        })
        .catch(() => {})
    }
  }, [tabInfo, actived])

  const _listFooter = () => (
    <Text className={styles['footer']}>
      {intl.formatMessage({ id: 'mall_client_suggestProduct_item_footer_1', defaultMessage: '已经到底啦～' })}
    </Text>
  )

  return dataList && dataList.length > 0 ? (
    <View className={styles['informationList']}>
      {dataList.map((item) => (
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
