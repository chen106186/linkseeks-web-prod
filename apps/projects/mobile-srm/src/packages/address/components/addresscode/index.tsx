import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { useIntl } from '@linkseeks/i18n'
import { View, Text, ScrollView, Image } from '@apps/mobile-ui'
import Tick from '@/assets/images/tick.png'
import { getManageAreaByPcode } from '@apps/apis'

import styles from './index.module.scss'

interface AddressPickerProps {
  // 显示控制
  visible?: boolean
  // 关闭方法
  onClose?: () => void
  // 确定方法
  onSelect?: (item: any, allMap?: any) => void
  // 全部数据
  AddressData: any
}

interface ItemProps {
  id: number
  // 地区编码
  code: string
  // 地区名字
  name: string
  // 地区等级
  level: number
  // 地区父编码
  pcode: string
}

const Provinces = (props: AddressPickerProps) => {
  const { visible, onClose, onSelect, AddressData } = props
  const [provinList, setprovinceList] = useState<any>([]) // 省列表
  const [provinItem, setprovinItem] = useState<any>({}) // 选中省
  const [cityList, setcityList] = useState<any>([]) //  市列表
  const [cityItem, setcityItem] = useState<any>([]) //  选中市
  const [countyList, setcountyList] = useState<any>([]) //  区列表
  const [countyItem, setcountyItem] = useState<any>([]) //  选中区
  const [streetList, setstreetList] = useState<any>([]) // 街道列表
  const [streetItem, setstreetItem] = useState<any>([]) // 选中街道
  const [tabList, settabList] = useState<ItemProps[]>([])
  const [TabIndex, setTabIndex] = useState<number>(0)
  const [level, setlevel] = useState(false) // 级别
  const intl = useIntl()

  /* 获取是省 */
  const provinceList = async () => {
    const res = await getData()
    console.log(res, 'res')
    setprovinceList(res)
  }

  const getData = (code?: any) =>
    new Promise((resolve) => {
      let data: any = {}
      if (code) {
        data = {
          pcode: code,
        }
      }
      getManageAreaByPcode(data).then((res: any) => {
        if (res.code === 1000) {
          resolve(res.data)
        }
      })
    })

  /* 省点击 */
  const onClick = async (item: ItemProps) => {
    setprovinItem(item)
    const res = await getData(item.code)
    const data: any = res
    setcityItem({ name: '', code: '' })
    setcountyItem({ name: '', code: '' })
    setstreetItem({ name: '', code: '' })
    setcityList(res)
    tabArr(item)
    if (data.length === 0) {
      setlevel(false)
      const obj = {
        provinItem: item,
        cityItem,
        countyItem,
        streetItem,
      }
      onSelect && onSelect(obj)
      onClose && onClose()
    }
  }

  const tabArr = (p?: ItemProps, s?: ItemProps, q?: ItemProps, j?: ItemProps) => {
    const data: any = []
    if (p) {
      data.push(p)
    }
    if (s) {
      data.push(s)
    }
    if (q) {
      data.push(q)
    }
    if (j) {
      data.push(j)
    }
    settabList(data)
    setTabIndex(TabIndex !== 3 ? TabIndex + 1 : TabIndex)
  }
  /* 市点击 */
  const oncity = async (item: ItemProps) => {
    setcityItem(item)
    const res = await getData(item.code)
    console.log(res, 'res')
    const data: any = res
    setcountyItem({ name: '', code: '' })
    setstreetItem({ name: '', code: '' })
    if (data.length === 0) {
      setlevel(false)
      const obj = {
        provinItem,
        cityItem: item,
        countyItem,
        streetItem,
      }
      onSelect && onSelect(obj)
      onClose && onClose()
    }
    setcountyList(res)
    tabArr(provinItem, item)
  }

  /* 区点击 */
  const oncounty = async (item: ItemProps) => {
    setcountyItem(item)
    const res = await getData(item.code)
    console.log(res, 'res区点击')
    const data: any = res
    setstreetItem({ name: '', code: '' })
    if (data.length === 0) {
      setlevel(false)
      const obj = {
        provinItem,
        cityItem,
        countyItem: item,
        streetItem,
      }
      onSelect && onSelect(obj)
      onClose && onClose()
    }
    setstreetList(res)
    tabArr(provinItem, cityItem, item)
  }

  /* 街道点击 */
  const onstreet = async (item: ItemProps) => {
    setstreetItem(item)
    tabArr(provinItem, cityItem, countyItem, item)
    const data = {
      provinItem,
      cityItem,
      countyItem,
      streetItem: item,
    }
    onSelect && onSelect(data)
    onClose && onClose()
  }
  useEffect(() => {
    provinceList()
    const data: any = AddressData
    if (data.provinceCode && data.cityCode && data.districtCode && data.areaCode) {
      const datarovinItem: any = {
        name: data.provinceName,
        code: data.provinceCode,
      }
      const datacityItem: any = {
        name: data.cityName,
        code: data.cityCode,
      }
      const datadistrictItem: any = {
        name: data.districtName,
        code: data.districtCode,
      }
      const datadistreetItem: any = {
        name: data.streetName,
        code: data.streetCode,
      }
      tabArr(datarovinItem, datacityItem, datadistrictItem, datadistreetItem)
      setprovinItem(datarovinItem)
      setcityItem(datacityItem)
      setcountyItem(datadistrictItem)
      setstreetItem(datadistreetItem)
      setTabIndex(0)
    }
    if (data.provinceCode) {
      getData(data.provinceCode).then((res: any) => {
        setcityList(res)
      })
    }
    if (data.cityCode) {
      getData(data.cityCode).then((res: any) => {
        setcountyList(res)
      })
    }
    if (data.districtCode) {
      getData(data.districtCode).then((res: any) => {
        setstreetList(res)
      })
    }
  }, [AddressData])

  return (
    <View className={cx(styles['ap'], visible ? styles['ap--active'] : '')}>
      <View
        className={cx(styles['ap-seat'], visible ? styles['ap-seat--active'] : '')}
        onClick={() => {
          onClose && onClose()
        }}
      ></View>
      <View className={cx(styles['ap-container'], visible ? styles['ap-container--active'] : '')}>
        <View className={styles['ap-container-top']}>
          {/* <Text className='.ap-container-top-left' onClick={() => { onClose && onClose() }}>{t('addressPicker_cancel')}</Text> */}
          <Text className={styles['ap-container-top-title']}>选择地区</Text>
          {/* <Text className='.ap-container-top-right' onClick={handleSelect}>{t('addressPicker_confirm')}</Text> */}
        </View>
        <View className={styles['flex']}>
          {tabList.map((item: ItemProps, index: number) => (
            // tyle={style.tabItem}
            <View className={styles['flex-item']} onClick={() => setTabIndex(index)} key={index}>
              {/* style={style.tabItemText} */}
              <Text>{item.name}</Text>
            </View>
          ))}
          {tabList.length !== 4 && (
            <View>
              <Text style={{ color: '#00A98F' }}>请选择</Text>
            </View>
          )}
        </View>

        <ScrollView style=" height: 300px;" className={styles['code']}>
          {TabIndex === 0 &&
            provinList.map((item: ItemProps, index: number) => (
              <View key={index} className={styles['codeitem']} onClick={() => onClick(item)}>
                <Text>{item.name}</Text>
                {provinItem.code === item.code && <Image className={styles['icon']} src={Tick} />}
              </View>
            ))}
          {TabIndex === 1 &&
            cityList.map((item: ItemProps, index: number) => (
              <View key={index} className={styles['codeitem']} onClick={() => oncity(item)}>
                <Text>{item.name}</Text>
                {cityItem.code === item.code && <Image className={styles['icon']} src={Tick} />}
              </View>
            ))}
          {TabIndex === 2 &&
            countyList.map((item: ItemProps, index: number) => (
              <View
                key={index}
                className={styles['codeitem']}
                // onClick={() => onClick(item)}
                onClick={() => oncounty(item)}
              >
                <Text>{item.name}</Text>
                {countyItem.code === item.code && <Image className={styles['icon']} src={Tick} />}
              </View>
            ))}
          {TabIndex === 3 &&
            streetList.map((item: ItemProps, index: number) => (
              <View key={index} className={styles['codeitem']} onClick={() => onstreet(item)}>
                <Text>{item.name}</Text>
                {streetItem.code === item.code && <Image className={styles['icon']} src={Tick} />}
              </View>
            ))}
        </ScrollView>
      </View>
    </View>
  )
}
export default Provinces
