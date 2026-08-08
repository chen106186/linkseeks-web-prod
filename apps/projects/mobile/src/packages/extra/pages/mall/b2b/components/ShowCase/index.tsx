import React from 'react'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import { View } from '@apps/mobile-ui'
import Skeleton from '@/components/Skeleton'
import ImageBox from '@/components/ImageBox'
import styles from './index.module.scss'

type ShowcaseShopItem = {
  id: number
  productIds?: number[]
}

export type showcaseDetailsItem = {
  /**
   * 名称
   */
  name: string
  /**
   * 类型：1-商品 2-活动 3-积分 4-店铺 6-品牌
   */
  type: number
  /**
   * 橱窗广告
   */
  banner: string
  /**
   * 内页广告
   */
  inner: string
  /**
   * 推荐 ,Long
   */
  id: number[]
  details?: ShowcaseShopItem[]
}

interface ShowCaseProps {
  loading: boolean
  status?: boolean
  list: showcaseDetailsItem[]
}

const getStoreInCommodityList = (type: number, details?: ShowcaseShopItem[]) => {
  if (type !== 4 || !details || details.length === 0) return undefined

  return JSON.stringify(
    details.map((item) => ({
      storeId: item.id,
      commodityIdList: item.productIds || [],
    })),
  )
}

const ShowCase: React.FC<ShowCaseProps> = (props) => {
  const { loading, status, list } = props

  const handleLink = (info: showcaseDetailsItem) => {
    if (info.type === 2) {
      if (info.id) {
        Router.navigateTo('activity/index', { id: info.id })
      }
    } else {
      // preload({
      //   ...info,
      // })
      // Router.navigateTo('extra/showcase')
      const { name, type, banner, inner, details, id } = info
      Router.navigateTo('extra/showcase', {
        name,
        type,
        banner,
        inner,
        storeInCommodityList: getStoreInCommodityList(type, details),
        id: id?.join(','),
      })
    }
  }

  return !loading ? (
    status ? (
      list && list.length > 0 ? (
        <View className={styles.container}>
          <View className={styles.showCaseWrapper}>
            {list.map((item, index) => (
              <View
                key={`showcase${item.name}_${index}`}
                className={styles.showCaseItem}
                onClick={() => handleLink(item)}
              >
                <View className={styles.showCaseItemBody}>
                  <ImageBox resizeMode="widthFix" width="100%" height={120} source={item.banner} />
                </View>
              </View>
            ))}
          </View>
        </View>
      ) : null
    ) : null
  ) : (
    <Skeleton.List
      wrapStyle={{
        backgroundColor: 'transparent',
        padding: `${pxTransform(0)} ${pxTransform(8)}`,
        marginBottom: pxTransform(8),
      }}
      style={{
        backgroundColor: '#FFF',
        marginBottom: pxTransform(0),
      }}
      column={2}
      row={2}
      item={<Skeleton height={120} style={{ margin: pxTransform(6) }} />}
    />
  )
}

ShowCase.defaultProps = {
  status: true,
}

export default ShowCase
