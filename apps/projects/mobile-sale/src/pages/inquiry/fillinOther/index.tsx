import React, { useState } from 'react'
import { getCurrentInstance } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import { View, Input, Button } from '@apps/mobile-ui'
import { useSafeArea } from '@apps/mobile-services'
import styles from './index.module.scss'
import { Other } from '../inquiryOffer'

const FillinOther: React.FC<{}> = () => {
  const { safeBottomHeight } = useSafeArea()
  const params = getCurrentInstance().preloadData as any
  const { other, getOther } = params
  const [dataSource, setDataSource] = useState<Other>(other)

  const handleInput = (e, name) => {
    dataSource[name] = e
    setDataSource({ ...dataSource })
  }

  const handleSumbit = () => {
    getOther(dataSource)
    Router.navigateBack()
  }

  return (
    <View className={styles['container']} style={safeBottomHeight ? { paddingBottom: `${safeBottomHeight}PX` } : {}}>
      <View className={styles['fillin']}>
        <View className={styles['fillin-box']}>
          <View className={styles['fillin-box-cell']}>
            <View className={styles['fillin-box-cell-label']}>交付说明</View>
            <View className={styles['fillin-box-cell-value']}>
              <Input
                maxlength={50}
                placeholder="点击输入"
                onChange={(e) => handleInput(e, 'deliveryInstructions')}
                value={dataSource?.deliveryInstructions}
              />
            </View>
          </View>
        </View>
        <View className={styles['fillin-box']}>
          <View className={styles['fillin-box-cell']}>
            <View className={styles['fillin-box-cell-label']}>付款说明</View>
            <View className={styles['fillin-box-cell-value']}>
              <Input
                maxlength={50}
                placeholder="点击输入"
                onChange={(e) => handleInput(e, 'paymentType')}
                value={dataSource?.paymentType}
              />
            </View>
          </View>
        </View>
        <View className={styles['fillin-box']}>
          <View className={styles['fillin-box-cell']}>
            <View className={styles['fillin-box-cell-label']}>税费说明</View>
            <View className={styles['fillin-box-cell-value']}>
              <Input
                maxlength={50}
                placeholder="点击输入"
                onChange={(e) => handleInput(e, 'taxes')}
                value={dataSource?.taxes}
              />
            </View>
          </View>
        </View>
        <View className={styles['fillin-box']}>
          <View className={styles['fillin-box-cell']}>
            <View className={styles['fillin-box-cell-label']}>物流说明</View>
            <View className={styles['fillin-box-cell-value']}>
              <Input
                maxlength={50}
                placeholder="点击输入"
                onChange={(e) => handleInput(e, 'logistics')}
                value={dataSource?.logistics}
              />
            </View>
          </View>
        </View>
        <View className={styles['fillin-box']}>
          <View className={styles['fillin-box-cell']}>
            <View className={styles['fillin-box-cell-label']}>包装说明</View>
            <View className={styles['fillin-box-cell-value']}>
              <Input
                maxlength={50}
                placeholder="点击输入"
                onChange={(e) => handleInput(e, 'packRequire')}
                value={dataSource?.packRequire}
              />
            </View>
          </View>
        </View>
        <View className={styles['fillin-box']}>
          <View className={styles['fillin-box-cell']}>
            <View className={styles['fillin-box-cell-label']}>其他说明</View>
            <View className={styles['fillin-box-cell-value']}>
              <Input
                maxlength={50}
                placeholder="点击输入"
                onChange={(e) => handleInput(e, 'otherRequire')}
                value={dataSource?.otherRequire}
              />
            </View>
          </View>
        </View>
      </View>
      <View className={styles['operate']}>
        <Button type="primary" onClick={() => handleSumbit()}>
          确认
        </Button>
      </View>
    </View>
  )
}
export default FillinOther
