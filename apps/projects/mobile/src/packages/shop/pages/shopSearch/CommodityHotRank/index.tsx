import React, { useEffect, useState } from 'react'
import { View, Text } from '@apps/mobile-ui'
import ImageBox from '@/components/ImageBox'
import useProductDetailJump from '@/hooks/useProductDetailJump'
import { numFormat } from '@/utils/numberFormat'
import { postProductMobileShopEnterpriseGetCommodityList } from '@apps/apis'
import { getOssUrlPath } from '@apps/constants'
import styles from './index.module.scss'

const hotIcon = getOssUrlPath('/miniprogram/assets/images/fire-fill@2x.png')
const top1Icon = getOssUrlPath('/miniprogram/assets/images/top1@2x.png')
const top2Icon = getOssUrlPath('/miniprogram/assets/images/top2@2x.png')
const top3Icon = getOssUrlPath('/miniprogram/assets/images/top3@2x.png')

const CommodityHotRank: React.FC<{}> = () => {
  const [commodityList, setCommodityList] = useState<any[]>([])
  const { jmpProductDetail } = useProductDetailJump()
  const showRank = (level: number) => {
    switch (level) {
      case 1:
        return <ImageBox className={styles['rankIcon']} width={64} height={20} source={top1Icon} />
      case 2:
        return <ImageBox className={styles['rankIcon']} width={64} height={20} source={top2Icon} />
      case 3:
        return <ImageBox className={styles['rankIcon']} width={64} height={20} source={top3Icon} />
      default:
        return (
          <View className={styles['rank']}>
            <Text className={styles['rankText']}>
              TOP
              {level}
            </Text>
          </View>
        )
    }
  }

  /**
   * @param commodityId 商品id
   * @param type 产品定价类型
   */
  const handleJumpDetial = (commodityId: number, type: number) => {
    jmpProductDetail(type, { commodityId })
  }

  const fetchCommodityList = () => {
    const param: any = {
      current: 1,
      pageSize: 9,
      orderType: 1, // 销量从高到低
    }
    postProductMobileShopEnterpriseGetCommodityList(param).then((res) => {
      if (res.code === 1000) {
        setCommodityList(res.data.data)
      }
    })
  }

  useEffect(() => {
    fetchCommodityList()
  }, [])

  return commodityList && commodityList.length > 0 ? (
    <View className={styles['container']}>
      <View className={styles['header']}>
        <Text className={styles['title']}>热门排行</Text>
        <ImageBox width={16} height={16} source={hotIcon} />
      </View>
      <View className={styles['commodityList']}>
        {commodityList.map((commodityItem, index: number) => (
          <View
            className={styles['commodityItem']}
            key={commodityItem.id}
            onClick={() => handleJumpDetial(commodityItem.id, commodityItem.priceType)}
          >
            <ImageBox width={72} height={72} source={commodityItem.mainPic || ''} />
            <View className={styles['commodityInfo']}>
              {showRank(index + 1)}
              <View className={styles['commidtyName']}>
                <Text className={styles['commidtyNameText']}>{commodityItem.name}</Text>
              </View>
              <View style={{ marginTop: 'auto' }}>
                <Text className={styles['soldText']}>{numFormat(commodityItem.sold)}</Text>
                <Text className={styles['soldText']}>成交</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  ) : null
}
export default CommodityHotRank
