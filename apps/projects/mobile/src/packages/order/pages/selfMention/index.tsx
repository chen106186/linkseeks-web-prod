import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useEffect, useState } from 'react'
import { View, Text, Image } from '@apps/mobile-ui'
import { getOssUrlPath } from '@apps/constants'
import { getCurrentInstance } from '@apps/mobile-services/utils/taro'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import { observer } from 'mobx-react-lite'
import useStores from '@/store/useStores'
import { getLogisticsMobileShipperAddressStoreList } from '@apps/apis'
import styles from './index.module.scss'
interface Iprops {}
const SelfMention: React.FC<Iprops> = () => {
  const { params }: any = getCurrentInstance()?.router
  const {
    confirmOrderStore: { addressInfo },
  } = useStores()
  const {
    confirmOrderStore: { setstoreItem },
  } = useStores()
  // 模拟数据
  const [dataSource, setdataSource] = useState<any>([])
  const [value, setvalue] = useState({})
  const getstorelist = async () => {
    const res = await getLogisticsMobileShipperAddressStoreList({
      vendorMemberId: params.vendorMemberId,
      vendorRoleId: params.vendorRoleId,
      receiveId: addressInfo?.id,
    })
    console.log(JSON.stringify(res.data), 'res')
    if (res.code === 1000) {
      const arr = res.data
      arr.forEach((element: any) => {
        const items = element
        items.isDefault = false
        if (items.id == params.id) {
          items.isDefault = true
          setvalue(items)
        }
      })
      setdataSource(res.data)
    }
  }
  const onclick = (item: any) => {
    const arr = dataSource
    arr.forEach((element: any) => {
      const items = element
      items.isDefault = false
      if (items.id === item.id) {
        items.isDefault = true
      }
    })
    setdataSource(arr)
    setvalue({
      ...item,
    })
  }
  useEffect(() => {
    getstorelist()
  }, [])
  const submit = () => {
    if (Object.keys(value).length > 0) {
      setstoreItem({
        ...value,
      })
    }
    Router.navigateBack()
  }
  const radioon = getOssUrlPath('/Images/Address%402x.png')
  const radiooff = getOssUrlPath('/Images/Address%402x(1).png')
  return (
    <View className={styles['container']}>
      <View className={styles['warp']}>
        {dataSource.map((item: any) => (
          <View onClick={() => onclick(item)} key={item.id}>
            <View className={styles['cell']}>
              <Image src={item.isDefault ? radiooff : radioon} className={styles['Icon']} />
              <Text className={styles['styles']}>{item.fullAddress}</Text>
            </View>
          </View>
        ))}
      </View>
      <View onClick={submit}>
        <View className={styles['btn']}>
          <Text
            style={{
              fontSize: pxTransform(14),
              textAlign: 'center',
              color: '#fff',
              width: '100%',
            }}
          >
            确定
          </Text>
        </View>
      </View>
    </View>
  )
}
export default GlobalWrapper(observer(SelfMention))
