import React, { useState } from 'react'
import { getCurrentInstance } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import { View, Text, Input, Button, Toast, Image } from '@apps/mobile-ui'
import { useSafeArea } from '@apps/mobile-services'
import defaultImage from '@/assets/images/default_img.png'
import styles from './index.module.scss'

const ProductOffer: React.FC<{}> = () => {
  const params = getCurrentInstance().preloadData as any
  const { item, render } = params

  const [dataSource, setDataSource] = useState<any>(item)

  const { safeBottomHeight } = useSafeArea()

  const handleInput = (e) => {
    const data = { ...dataSource }
    const reg = /^\d*([.]?\d{0,4})$/
    if (reg.test(e)) {
      data.price = e
      data.money = Number(e) * data.purchaseCount
    } else {
      data.price = data.price
    }
    setDataSource({ ...data })
  }

  const handleSumbit = () => {
    const pattern = /^([1-9]\d*(\.\d{1,4})?|([0](\.([0][1-9]|[1-9]\d{0,1}))))$/
    if (!dataSource.price) {
      Toast.show({ title: '请输入单价', icon: 'none' })
      return
    }
    if (!pattern.test(dataSource.price)) {
      Toast.show({ title: '单价必须大于0且最多保留四位小数', icon: 'none' })
      return
    }
    render(dataSource)
    Router.navigateBack()
  }

  return (
    <View className={styles['container']} style={safeBottomHeight ? { paddingBottom: `${safeBottomHeight}PX` } : {}}>
      <View className={styles['product-box']}>
        <View className={styles['product-box-info']}>
          <View className={styles['product-box-info-left']}>
            <Image src={dataSource?.imgUrl || defaultImage} className={styles['product-box-info-left-image']} />
          </View>
          <View className={styles['product-box-info-right']}>
            <Text className={styles['product-box-info-right-text']}>{dataSource?.productName}</Text>
          </View>
        </View>
        <View className={styles['product-box-attribute']}>
          <View className={styles['attribute-box']}>
            <View className={styles['attribute-box-label']}>品类</View>
            <Text className={styles['attribute-box-value']}>{dataSource?.category}</Text>
          </View>
          <View className={styles['attribute-box']}>
            <View className={styles['attribute-box-label']}>单位</View>
            <Text className={styles['attribute-box-value']}>吨</Text>
          </View>
          <View className={styles['attribute-box']}>
            <View className={styles['attribute-box-label']}>品牌</View>
            <Text className={styles['attribute-box-value']}>{dataSource?.brand}</Text>
          </View>
          <View className={styles['attribute-box']}>
            <View className={styles['attribute-box-label']}>含税</View>
            <Text className={styles['attribute-box-value']}>
              {dataSource?.taxRate ? `是/${dataSource?.taxRate}%` : '否'}
            </Text>
          </View>
          <View className={styles['attribute-box']}>
            <View className={styles['attribute-box-label']}>采购数量</View>
            <Text className={styles['attribute-box-value']}>{dataSource?.purchaseCount}</Text>
          </View>
        </View>
      </View>
      <View className={styles['count-box']}>
        <View className={styles['count-box-cell']}>
          <View className={styles['count-box-cell-label']}>单价(元)</View>
          <View className={styles['count-box-cell-value']}>
            <Input required type="digit" placeholder="点击输入" value={dataSource?.price} onChange={handleInput} />
          </View>
        </View>
      </View>
      <View className={styles['operate-box']}>
        <Button type="primary" onClick={handleSumbit}>
          确认
        </Button>
      </View>

      <View className={styles['count-amount']}>
        <View className={styles['count-amount-cell']}>
          <View className={styles['count-amount-cell-label']}>单价(元)</View>
          <Text className={styles['count-amount-cell-value']}>{Number(dataSource?.price).toFixed(2) || '0.00'}</Text>
        </View>
        <View className={styles['count-amount-total']}>
          <View className={styles['count-amount-total-label']}>共</View>
          <View className={styles['count-amount-total-sign']}>￥</View>
          <View className={styles['count-amount-total-value']}>{Number(dataSource?.money).toFixed(2) || '0.00'}</View>
        </View>
      </View>
    </View>
  )
}
export default ProductOffer
