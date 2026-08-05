import React from 'react'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Text, Image } from '@apps/mobile-ui'
import styles from './index.module.scss'

export interface OtherListProps {
  dataSource: Array<any>[]
  title?: string
  type?: string
  /**
   * 其他内容
   */
  extra?: React.ReactNode
}

const OtherList = (props: OtherListProps) => {
  const { dataSource, title, type, extra } = props
  const disable = () => {
    let flag = true
    const data: any[] = [...dataSource]
    if (data.length > 0) {
      flag = true
    } else {
      flag = false
    }
    return flag
  }
  return (
    <>
      {dataSource && disable() && (
        <View className={styles['OtherList-container']}>
          <View className={styles['tabItem']}>
            <Text className={styles['OtherList-title']}>{title}</Text>
            <View className={styles['extra']}>{extra}</View>
          </View>
          {type === 'GOODS' && (
            <View className={styles['tabConItem']}>
              {dataSource &&
                dataSource.map((item: any, index: number) => (
                  <View className={styles['conItem']} key={`conItem-${index + 1}`}>
                    <Text className={styles['product-item-name']}>{item.productName}</Text>
                    <Text className={styles['product-item-quantity']}>x{item.purchaseCount}</Text>
                  </View>
                ))}
            </View>
          )}
          {type === 'ANNEX' && (
            <View className={styles['tabAnnexItem']}>
              {dataSource?.map((item: any) => {
                return (
                  <View className={styles['annexItem']} key={item.url}>
                    <Image
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                      src={item.url}
                    />
                  </View>
                )
              })}
            </View>
          )}
          {type === 'ALL' && (
            <View className={styles['allMain']}>
              {dataSource.map((item: any) => {
                console.log(item)
                return (
                  <View className={styles['allWarp']} key={item.url || item.imgUrl}>
                    <Image
                      style={{
                        width: pxTransform(45),
                        height: pxTransform(45),
                      }}
                      src={item.url || item.imgUrl}
                    />
                    <View className={styles['allContent']}>
                      <Text className={styles['allContentText']}>{item.productName}</Text>
                      <Text className={styles['allContentCount']}>x{item.purchaseCount}</Text>
                    </View>
                  </View>
                )
              })}
            </View>
          )}
        </View>
      )}
    </>
  )
}

OtherList.defaultProps = {
  dataSource: undefined,
  type: 'GOODS',
  title: '标题',
}
export default OtherList
