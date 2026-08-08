/*
 * @Author: XieZhiXiong
 * @Date: 2021-11-22 09:45:15
 * @LastEditors: GHua
 * @LastEditTime: 2022-03-15 11:07:34
 * @Description:
 */
import React, { useEffect, useState } from 'react'
import { IndexList, View } from '@apps/mobile-ui'
import useFetchState from '@/hooks/useFetchState'
import MellowCard from '@/components/MellowCard'
import ImageBox from '@/components/ImageBox'
import { useIntl } from '@linkseeks/i18n'
import Router from '@/utils/router'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { getProductMobileShopEnterpriseGetBrand, getProductMobileShopEnterpriseGetPinyinSortBrand } from '@apps/apis'
import ListGroup, { IDataItem } from './components/listGroup'
import styles from './index.module.scss'

const BrandList: React.FC<{}> = () => {
  const [dataSource, setDataSource] = useFetchState<any[]>([])
  const [brand, setBrand] = useState<any>([])
  const intl = useIntl()

  const getBrand = () => {
    getProductMobileShopEnterpriseGetPinyinSortBrand().then((res) => {
      if (res.code === 1000) {
        setDataSource(res.data || [])
      }
    })
    getProductMobileShopEnterpriseGetBrand().then((res) => {
      if (res.code === 1000) {
        setBrand(res.data.slice(0, 8))
      }
    })
  }

  useEffect(() => {
    getBrand()
  }, [])

  /**
   * 选择品牌跳转
   * @param item BrandItem
   */
  const handleFilterBrand = (item: IDataItem) => {
    Router.navigateTo('commodityMerge/stocksSourcing/index', { type: 1, brandId: item.id })
  }

  return (
    <View className={styles['brandList']}>
      <IndexList
        topKey={intl.formatMessage({ id: 'classify_brandList_topKey' })}
        list={dataSource}
        isVibrate={false}
        isShowToast={false}
        renderItem={(item) => <ListGroup data={item} />}
      >
        <View className={styles['recommend']}>
          <MellowCard
            title={intl.formatMessage({ id: 'classify_brandList_card_title' })}
            headStyle={{ borderBottomWidth: pxTransform(0) }}
            className={styles['recommend']}
            bodyStyle={{
              paddingTop: pxTransform(0),
            }}
          >
            <View className={styles['recommend-list']}>
              {brand.map((item) => (
                <View key={item.id} className={styles['recommend-list-item']} onClick={() => handleFilterBrand(item)}>
                  <View className={styles['recommend-list-item-content']}>
                    <ImageBox
                      source={item.logoUrl}
                      width="100%"
                      height="100%"
                      className={styles['recommend-list-item-content-img']}
                    />
                  </View>
                </View>
              ))}
            </View>
          </MellowCard>
        </View>
      </IndexList>
    </View>
  )
}
export default BrandList
