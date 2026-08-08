import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { pxTransform, getCurrentInstance, setNavigationBarTitle } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import { View, Button, Text, Input, Switch, ScrollView, Form, Toast, Icons, Image, TextArea } from '@apps/mobile-ui'
import ModeMobile from '@/components/Modemobile'
import { PATTERN_MAPS } from '@/constants/regExp'
import iconRight from '@/assets/images/icon-right.svg'
import caretdown from '@/assets/images/arrow-down-fill@2x.png'
// import Progress from '@/components/Progress';
import { limitByte } from '@/utils'
import {
  getLogisticsMobileReceiverAddressGet,
  getLogisticsMobileShipperAddressGet,
  postLogisticsMobileReceiverAddressAdd,
  postLogisticsMobileShipperAddressAdd,
  postLogisticsMobileReceiverAddressUpdate,
  postLogisticsMobileShipperAddressUpdate,
} from '@apps/apis'
import Addresscode from '../../components/addresscode'
import styles from './index.module.scss'
import { useCountryCodeList } from '@apps/services'
import Select from '@/components/Select'

const AddressAdd = () => {
  const route: { params: any } = {
    params: getCurrentInstance().preloadData || {},
  }

  const { refresh } = route.params
  const [code, setCode] = useState('+86') // 手机区号
  const [toggle, settoggle] = useState(false) // 显示手机号
  const [max, setMax] = useState(11)
  const [isSwitch, setisSwitch] = useState(false) // 开关
  const [addressText, setAddressText] = useState<string>('请选择收货地区')
  const { countryCodeList } = useCountryCodeList()
  const [loading, setLoading] = useState<boolean>(false)

  const [Addressvisible, setAddressvisible] = useState<boolean>(false)
  const [AddressData, setAddressData] = useState<any>({})
  const [formItems, setFormItems] = useState<any>({
    receiverName: '',
    phone: '',
    address: '',
    tel: '',
    postalCode: '',
    shipperName: '',
  })

  /* 选着区号HTML */
  const countryCodeView = () => (
    <View className={styles['mobile']} onClick={() => settoggle(!toggle)}>
      <Text className={styles['mobile-sop']}>|</Text>
      <Text className={styles['code']}>{code}</Text>
      <Image className={cx(styles['mobile-icon'], styles['fl-right'])} src={caretdown} />
    </View>
  )

  const onSelect = (data: any) => {
    console.log(data)
    setAddressData({
      provinceCode: data.provinItem.code,
      provinceName: data.provinItem.name,
      cityName: data.cityItem.name,
      cityCode: data.cityItem.code,
      districtName: data.countyItem.name,
      districtCode: data.countyItem.code,
      streetName: data.streetItem.name,
      streetCode: data.streetItem.code,
    })
    setAddressText(`${data.provinItem.name}${data.cityItem.name}${data.countyItem.name}${data.streetItem.name}`)
  }
  /* 查询收货地址 */
  const getreceiverAddress = (id: string) => {
    // const dataSource = { ...AddressData }
    /* 请求接口整合数据 */
    const fn = route.params.active === '0' ? getLogisticsMobileReceiverAddressGet : getLogisticsMobileShipperAddressGet
    fn({ id }).then((res: any) => {
      if (res.code === 1000) {
        setFormItems(res.data)
        setAddressText(`${res.data.provinceName}${res.data.cityName}${res.data.districtName}${res.data.streetName}`)
        // eslint-disable-next-line no-unneeded-ternary
        const falg = res.data.isDefault === 0 ? false : true
        setisSwitch(falg)
        setAddressData(res.data)
      }
    })
  }

  useEffect(() => {
    if (route.params.id) {
      getreceiverAddress(route.params.id) // 查询详情接口
    }
    const text = route.params.active === '0' ? '请选择收货地区' : '请选择发货地区'
    setAddressText(text)

    setNavigationBarTitle({
      title: `${route.params.id ? '修改' : '新增'}地址`,
    })
  }, [])

  /* 添加地址接口 */
  const add = (param: any) => {
    setLoading(true)
    let routeParams: any = {
      active: route.params.active,
    }
    if ('handleSelectAddress' in route.params) {
      routeParams = {
        handleSelectAddress: route.params.handleSelectAddress,
        active: route.params.active,
      }
    }

    const fn =
      route.params.active === '0' ? postLogisticsMobileReceiverAddressAdd : postLogisticsMobileShipperAddressAdd
    fn(param).then((res: any) => {
      if (res.code === 1000) {
        Router.navigateBack()
        if (refresh) {
          refresh()
        }
        setLoading(false)
      } else {
        setLoading(false)
      }
    })
  }
  /* 修改地址 */
  const edit = (param: any) => {
    setLoading(true)
    const fn =
      route.params.active === '0' ? postLogisticsMobileReceiverAddressUpdate : postLogisticsMobileShipperAddressUpdate
    fn(param).then((res: any) => {
      if (res.code === 1000) {
        // Toast.show({ title: '添加成功' })
        Router.navigateBack()
        if (refresh) {
          refresh()
        }
        setLoading(false)
      } else {
        setLoading(false)
      }
    })
  }

  const handleChangeCountryCode = (value) => {
    setFormItems({
      ...formItems,
      countryCode: value,
    })
  }
  /* 提交表单 */
  const submit = () => {
    const param = formItems
    const tip = '请选择收货地区'
    if (!param.phone) {
      Toast.show({ title: '请输入手机号码', icon: 'none' })
      return false
    }
    if (addressText === tip) {
      Toast.show({ title: tip, icon: 'none' })
      return
    }
    if (param.tel && !PATTERN_MAPS.tel.test(param.tel)) {
      Toast.show({
        title: '请输请输入正常电话号码,格式为:020-12345678手机号码',
        icon: 'none',
      })
      return
    }
    const addressMes = limitByte(param.address, { allowChineseTransform: true, maxByte: 100 })
    if (addressMes) {
      Toast.show({ title: `详细地址${addressMes}`, icon: 'none' })
      return
    }
    console.log(AddressData, 'AddressData')
    const getdata = {
      id: route.params.id ? route.params.id : '',
      provinceCode: AddressData.provinceCode,
      provinceName: AddressData.provinceName,
      cityCode: AddressData.cityCode,
      cityName: AddressData.cityName,
      districtCode: AddressData.districtCode,
      districtName: AddressData.districtName,
      streetName: AddressData.streetName,
      streetCode: AddressData.streetCode,
      areaCode: code,
      isDefault: isSwitch ? 1 : 0,
    }
    const Ddata = Object.assign(formItems, getdata)
    console.log(Ddata, 1231321)
    if (!loading) {
      /* 请求接口整合数据 */
      !route.params.id ? add(Ddata) : edit(Ddata)
    }
  }
  // input 输入写入
  const changeInputValue = (key: string, val: any) => {
    setFormItems({ ...formItems, [key]: val })
  }

  return (
    <View className={styles['container']} style={{ flex: 1, flexDirection: 'column' }}>
      <View className={styles['page']}>
        <ScrollView className={styles['mian']}>
          <Form>
            <View className={styles['address']}>
              <Form className={styles['address-item']}>
                <View className={styles['form-item']}>
                  <Text className={styles['lable']}>{route.params.active === '0' ? '收货人' : '发货人'}</Text>
                  <Input
                    placeholder={'请输入名字'}
                    name={route.params.active === '0' ? 'receiverName' : 'shipperName'}
                    maxlength={20}
                    value={formItems[route.params.active === '0' ? 'receiverName' : 'shipperName']}
                    className={styles['input']}
                    style={{ marginLeft: 0, paddingLeft: 0, borderBottomColor: '#F4F5F7' }}
                    onChange={(e) => changeInputValue(route.params.active === '0' ? 'receiverName' : 'shipperName', e)}
                  />
                </View>

                <View className={styles['form-item']}>
                  <Text className={styles['lable']}>{'手机号码'}</Text>
                  <Input
                    placeholder={'请输入手机号码'}
                    name="phone"
                    maxlength={max}
                    type="number"
                    value={formItems.phone}
                    className={styles['input']}
                    style={{ marginLeft: 0, paddingLeft: 0, borderBottomColor: '#F4F5F7' }}
                    onChange={(e) => changeInputValue('phone', e)}
                  />
                  {countryCodeView()}
                </View>

                <View className={styles['form-item']}>
                  <Text className={styles['lable']}>国家地区</Text>
                  <View className={cx(styles['warp-item-box'], styles['clear'])}>
                    <Select
                      title="地区选择"
                      options={countryCodeList}
                      onChange={handleChangeCountryCode}
                      value={formItems.countryCode}
                    />
                    {/* <Text
                      className={styles['address-text']}
                    >
											中国
                    </Text>
                    <Image
                      className={cx(styles['mobile-icon'], styles['fl-right'], styles['right-arrow'])}
                      src={iconRight}
                    /> */}
                  </View>
                </View>
                <View className={styles['form-item']}>
                  <Text className={styles['lable']}>{route.params.active === '0' ? '收货地区' : '发货地区'}</Text>
                  <View
                    className={cx(styles['warp-item-box'], styles['clear'])}
                    onClick={() => setAddressvisible(!Addressvisible)}
                  >
                    <Text
                      className={styles['address-text']}
                      style={{
                        fontSize: pxTransform(16),
                        color:
                          addressText === '请选择收货地区' || addressText === '请选择发货地区' ? '#C0C4CC' : '#303133',
                      }}
                    >
                      {addressText}
                    </Text>
                    <Image
                      className={cx(styles['mobile-icon'], styles['fl-right'], styles['right-arrow'])}
                      src={iconRight}
                    />
                  </View>
                </View>

                <View className={styles['warpflextext']}>
                  <Text className={styles['lable']}>详细地址</Text>
                  <TextArea
                    placeholder={'请填写详细地址，楼号、门牌号等'}
                    maxLength={100}
                    value={formItems.address}
                    className={cx(styles['input'], styles['warpflex'])}
                    onChange={(e) => changeInputValue('address', e)}
                  />
                </View>

                <View
                  className={cx(styles['from-item'], styles['justify-content'], styles['clear'], styles['set-defulet'])}
                >
                  <Text className={styles['lable']}>设为默认</Text>
                  <View className={cx(styles['switch-btn'], styles['fl-right'])}>
                    <Switch color="#00A98F" checked={isSwitch} onChange={() => setisSwitch(!isSwitch)} />
                  </View>
                </View>
              </Form>
            </View>
            <View className={styles['box']}>
              <Text className={cx(styles['tip'], styles['boder'])}>其他信息(非必填)</Text>
            </View>

            <View className={styles['address']}>
              <Form className={styles['address-item']}>
                <View className={styles['form-item']}>
                  <Text className={styles['lable']}>邮编</Text>
                  <Input
                    placeholder={'请输入邮编'}
                    name="postalCode"
                    maxlength={12}
                    value={formItems.postalCode}
                    className={styles['input']}
                    style={{ borderBottomColor: '#F4F5F7' }}
                    onChange={(e) => changeInputValue('postalCode', e)}
                  />
                </View>

                <View className={styles['form-item']}>
                  <Text className={styles['lable']}>{'电话号码'}</Text>
                  <Input
                    placeholder={'请输入电话号码'}
                    name="tel"
                    maxlength={12}
                    value={formItems.tel}
                    className={styles['input']}
                    style={{ borderBottomColor: '#F4F5F7' }}
                    onChange={(e) => changeInputValue('tel', e)}
                  />
                </View>
              </Form>
            </View>
          </Form>
          <Button onClick={submit} className={styles['button']}>
            <Text style={{ color: '#fff' }}>保存</Text>
          </Button>
        </ScrollView>

        {/* 选着手机区号 */}
        <ModeMobile
          toggle={toggle}
          onClose={() => {
            settoggle(false)
          }}
          onConfirm={(data) => {
            setCode(data.value)
            setMax(data.phoneLength)
            settoggle(false)
          }}
        />
      </View>
      {/* 三级联动 */}
      <Addresscode
        visible={Addressvisible}
        onClose={() => setAddressvisible(false)}
        onSelect={onSelect}
        AddressData={AddressData}
      />
      {/* <Progress
        visible={Addressvisible}
        onClose={() => setAddressvisible(false)}
        onSelect={onSelect}
      /> */}
    </View>
  )
}
export default AddressAdd
