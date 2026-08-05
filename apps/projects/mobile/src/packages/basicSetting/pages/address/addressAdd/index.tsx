import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState, useEffect, useMemo } from 'react'
import cx from 'classnames'
import {
  setNavigationBarTitle,
  getCurrentInstance,
  pxTransform,
  setStorageSync,
} from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import { View, Button, Text, Input, Switch, ScrollView, Form, Toast, Image, TextArea } from '@apps/mobile-ui'
import ModeMobile from '@/components/Modemobile'
import { PATTERN_MAPS } from '@/constants/regExp'
import { COUNTRY_PHONE_CODE, COUNTRY_PHONE_LENGTH } from '@/constants'
import { THEME_COLORS } from '@/constants/theme'
import { combinationAddress } from '@/utils/dataMerge'
import { useIntl } from '@linkseeks/i18n'
import {
  getLogisticsMobileReceiverAddressGet,
  getLogisticsMobileShipperAddressGet,
  getOrderMobileCbgReceiverPickupDetail,
  postLogisticsMobileReceiverAddressAdd,
  postLogisticsMobileReceiverAddressUpdate,
  postLogisticsMobileShipperAddressAdd,
  postLogisticsMobileShipperAddressUpdate,
  postOrderMobileCbgReceiverPickupSave,
} from '@apps/apis'
import AddressCode from '../components/addresscode'
import { checkStrict } from '@/utils/phone'
import styles from './index.module.scss'
import { usePageInit } from '@/hooks/usePageInit'
import { useMobileIntl } from '@apps/locales'
import ModeCountryCode from '@/components/ModeCountryCode'
import { CN } from '@apps/constants/global'
import { useCountryCodeList } from '@apps/services'
import useStores from '@/store/useStores'
import { getOssUrlPath } from '@apps/constants'
const iconRight = getOssUrlPath('/miniprogram/assets/images/icon-right.svg')
const ArrowDownIcon = getOssUrlPath('/miniprogram/assets/images/arrow-down-fill@2x.png')
const AddressAdd = () => {
  const params = Object.assign({}, getCurrentInstance().preloadData || {}, getCurrentInstance()?.router?.params || {})
  const intl = useIntl()
  const { refresh } = params
  const {
    confirmOrderStore: { selfPickupInfo, setAddressInfo, setOrderInfo, setSelfPickupInfo },
  } = useStores()
  const [code, setCode] = useState(COUNTRY_PHONE_CODE) // 手机区号
  const [countryCode, setCountryCode] = useState<any>('CN') // 国家编码
  const [toggle, setToggle] = useState(false) // 显示手机号
  const [max, setMax] = useState(COUNTRY_PHONE_LENGTH)
  const [isSwitch, setIsSwitch] = useState(false) // 开关
  const [addressText, setAddressText] = useState<string>(
    intl.formatMessage({
      id: 'mine.qingxuanzeshouhuodiqu',
      defaultMessage: '请选择收货地区',
    }),
  )
  const [loading, setLoading] = useState<boolean>(false)
  const [addressVisible, setAddressVisible] = useState<boolean>(false)
  const [addressData, setAddressData] = useState<any>({})
  const [formItems, setFormItems] = useState<any>({
    receiverName: '',
    phone: '',
    address: '',
    tel: '',
    postalCode: '',
    shipperName: '',
    name: '',
  })
  const translate = useMobileIntl()
  /* 选着区号HTML */
  const countryCodeView = () => (
    <View className={styles['mobile']} onClick={() => setToggle(!toggle)}>
      <Text className={styles['mobile-sop']}>|</Text>
      <Text className={styles['code']}>{code}</Text>
      <Image className={cx(styles['mobile-icon'], styles['fl-right'])} src={ArrowDownIcon} />
    </View>
  )
  const onSelect = (data: any) => {
    const _obj = {
      provinceCode: data.provinItem.code,
      provinceName: data.provinItem.name,
      cityName: data.cityItem.name,
      cityCode: data.cityItem.code,
      districtName: data.countyItem.name,
      districtCode: data.countyItem.code,
      streetName: data.streetItem.name,
      streetCode: data.streetItem.code,
    }
    setAddressData(_obj)
    setAddressText(combinationAddress([_obj.provinceName, _obj.cityName, _obj.districtName, _obj.streetName]))
  }
  /* 查询收货地址 */
  const getReceiverAddress = (id: string) => {
    /* 请求接口整合数据 */
    const fn =
      params.active === '0'
        ? getLogisticsMobileReceiverAddressGet
        : params.active === '1'
        ? getLogisticsMobileShipperAddressGet
        : getOrderMobileCbgReceiverPickupDetail
    fn({
      id,
    }).then((res: any) => {
      if (res.code === 1000) {
        setFormItems(res.data)
        setAddressText(
          combinationAddress([res.data.provinceName, res.data.cityName, res.data.districtName, res.data.streetName]),
        )
        const flag = res.data.isDefault === 0 ? false : true
        setIsSwitch(flag)
        setCountryCode(res.data.countryCode)
        setAddressData(res.data)
      }
    })
  }
  useEffect(() => {
    if (params.id) {
      getReceiverAddress(params.id) // 查询详情接口
    }
    const text =
      params.active === '0'
        ? intl.formatMessage({
            id: 'mine.qingxuanzeshouhuodiqu',
            defaultMessage: '请选择收货地区',
          })
        : intl.formatMessage({
            id: 'mine.qingxuanzefahuodiqu',
            defaultMessage: '请选择发货地区',
          })
    setAddressText(text)
    setNavigationBarTitle({
      title: `${
        params.id
          ? intl.formatMessage({
              id: 'mine.xiugai',
              defaultMessage: '修改',
            })
          : intl.formatMessage({
              id: 'mine.xinzeng',
              defaultMessage: '新增',
            })
      }${intl.formatMessage({
        id: 'mine.dizhi',
        defaultMessage: '地址',
      })}`,
    })
  }, [])
  const { getTelLength, telList } = useCountryCodeList()
  /* 添加地址接口 */
  const add = (param: any) => {
    setLoading(true)
    let routeParams: any = {
      active: params.active,
    }
    if ('handleSelectAddress' in params) {
      routeParams = {
        handleSelectAddress: params.handleSelectAddress,
        active: params.active,
      }
    }
    const fn = params.active === '0' ? postLogisticsMobileReceiverAddressAdd : postLogisticsMobileShipperAddressAdd
    fn(param)
      .then((res: any) => {
        if (res.code === 1000) {
          Toast.show({
            title: intl.formatMessage({
              id: 'mine.tianjiachengong',
              defaultMessage: '添加成功',
            }),
          })
          // 设置一个常量 表面现在新增了地址，使得返回地址选择列表后 可以走后续选择的逻辑
          setStorageSync('addAddress', 1)
          Router.navigateBack()
          if (refresh) {
            refresh()
          }
          setLoading(false)
        } else {
          Toast.show({
            title: res.message,
          })
          setLoading(false)
        }
      })
      .catch((err) => {
        console.log(err)
        Toast.show({
          title: intl.formatMessage({
            id: `${err.code}`,
            defaultMessage: err.message,
          }),
        })
        setLoading(false)
      })
  }
  /* 修改地址 */
  const edit = (param: any) => {
    setLoading(true)
    const fn =
      params.active === '0' ? postLogisticsMobileReceiverAddressUpdate : postLogisticsMobileShipperAddressUpdate
    fn(param).then((res: any) => {
      if (res.code === 1000) {
        Toast.show({
          title: intl.formatMessage({
            id: 'mine.tianjiachengong',
            defaultMessage: '添加成功',
          }),
        })
        Router.navigateBack()
        if (refresh) {
          refresh()
        }
        setLoading(false)
      } else {
        Toast.show({
          title: intl.formatMessage({
            id: `${res.code}`,
            defaultMessage: res.message,
          }),
        })
        setLoading(false)
      }
    })
  }
  /* 修改地址 */
  const save = (param: any) => {
    setLoading(true)

    postOrderMobileCbgReceiverPickupSave({
      id: param.id,
      name: param.name,
      phone: param.phone,
      isDefault: isSwitch ? 1 : 0,
    }).then((res: any) => {
      if (res.code === 1000) {
        Toast.show({
          title: intl.formatMessage({
            id: 'mine.tianjiachengong',
            defaultMessage: '添加成功',
          }),
        })
        if ('handleSelectAddress' in params || selfPickupInfo?.id === res.data.id) {
          setSelfPickupInfo(res.data)
        }
        Router.navigateBack()
        if (refresh) {
          refresh()
        }
        setLoading(false)
      } else {
        Toast.show({
          title: intl.formatMessage({
            id: `${res.code}`,
            defaultMessage: res.message,
          }),
        })
        setLoading(false)
      }
    })
  }
  /* 提交表单 */
  const submit = () => {
    const param = {
      ...formItems,
    }
    const tip = intl.formatMessage({
      id: 'mine.qingxuanzeshouhuodiqu',
      defaultMessage: '请选择收货地区',
    })
    if (params.active === '0') {
      if (!param.receiverName) {
        Toast.show({
          title: intl.formatMessage({
            id: 'address.receiverName.required',
            defaultMessage: '请输入收货人',
          }),
          icon: 'none',
        })
        return false
      }
    } else if (params.active === '2') {
      if (!param.name) {
        Toast.show({
          title: '请输入提货人',
        })
        return false
      }
    } else {
      if (!param.shipperName) {
        Toast.show({
          title: intl.formatMessage({
            id: 'address.shipperName.required',
            defaultMessage: '请输入发货人',
          }),
          icon: 'none',
        })
        return false
      }
    }
    if (!param.phone) {
      Toast.show({
        title: intl.formatMessage({
          id: 'mine.qingshurushoujihao',
          defaultMessage: '请输入手机号码',
        }),
        icon: 'none',
      })
      return false
    } else if (!checkStrict(param.phone)) {
      Toast.show({
        title: intl.formatMessage({
          id: 'mine.shoujihaomabuzhengque',
          defaultMessage: '手机号码不正确',
        }),
        icon: 'none',
      })
      return false
    }
    if (params.active !== '2') {
      if (!param.address) {
        Toast.show({
          title: intl.formatMessage({
            id: 'address.address.required',
            defaultMessage: '请输入详细地址',
          }),
          icon: 'none',
        })
        return false
      }
      if (isCN) {
        // 中国地区的时候需要校验
        if (!addressData?.provinceCode || !addressData.cityCode || !addressData.districtCode) {
          if (params.active === '0') {
            Toast.show({
              title: intl.formatMessage({
                id: 'mine.qingxuanzeshouhuodiqu',
                defaultMessage: '请选择收货地区',
              }),
              icon: 'none',
            })
          } else {
            Toast.show({
              title: intl.formatMessage({
                id: 'mine.qingxuanzefahuodiqu',
                defaultMessage: '请选择发货地区',
              }),
              icon: 'none',
            })
          }
          return
        }
      }
    }
    if (param.phone && param.phone.length > max) {
      Toast.show({
        title: translate('mobile.resource.basicSetting.shoujihaobudechaoguo', {
          max,
        }),
        icon: 'none',
      })
      return
    }
    let getData = {}
    if (isCN) {
      getData = {
        id: params.id ? params.id : '',
        provinceCode: addressData.provinceCode,
        provinceName: addressData.provinceName,
        cityCode: addressData.cityCode,
        cityName: addressData.cityName,
        districtCode: addressData.districtCode,
        districtName: addressData.districtName,
        streetName: addressData.streetName,
        streetCode: addressData.streetCode,
        areaCode: code,
        countryCode: countryCode,
        isDefault: isSwitch ? 1 : 0,
      }
    } else {
      getData = {
        id: params.id ? params.id : '',
        provinceCode: '',
        provinceName: '',
        cityCode: '',
        cityName: '',
        districtCode: '',
        districtName: '',
        streetName: '',
        streetCode: '',
        areaCode: code,
        countryCode: countryCode,
        isDefault: isSwitch ? 1 : 0,
      }
    }
    const data = Object.assign(formItems, getData)
    if (!loading) {
      /* 请求接口整合数据 */
      params.active === '2' ? save(data) : !params.id ? add(data) : edit(data)
    }
  }
  const isCN = useMemo(() => {
    return countryCode === CN
  }, [countryCode])
  // input 输入写入
  const changeInputValue = (key: string, val: any) => {
    setFormItems({
      ...formItems,
      [key]: val,
    })
  }
  return (
    <View
      className={styles['container']}
      style={{
        flex: 1,
        flexDirection: 'column',
      }}
    >
      <View className={styles['page']}>
        <ScrollView className={styles['main']}>
          <Form>
            <View className={styles['address']}>
              <Form className={styles['address-item']}>
                <View className={styles['form-item']}>
                  <Text className={styles['label']}>
                    {params.active === '0'
                      ? intl.formatMessage({
                          id: 'mine.shouhuoren',
                          defaultMessage: '收货人',
                        })
                      : params.active === '1'
                      ? intl.formatMessage({
                          id: 'mine.fahuoren',
                          defaultMessage: '发货人',
                        })
                      : intl.formatMessage({
                          id: 'mine.tihuoren',
                          defaultMessage: '提货人',
                        })}
                  </Text>
                  <Input
                    placeholder={intl.formatMessage({
                      id: 'mine.qingshurumingzi',
                      defaultMessage: '请输入名字',
                    })}
                    name={params.active === '1' ? 'shipperName' : params.active === '2' ? 'name' : 'receiverName'}
                    maxlength={20}
                    value={
                      formItems[params.active === '1' ? 'shipperName' : params.active === '2' ? 'name' : 'receiverName']
                    }
                    className={styles['input']}
                    placeholderClass={styles['input-placeholder']}
                    style={{
                      marginLeft: pxTransform(0),
                      paddingLeft: pxTransform(0),
                      borderBottomColor: THEME_COLORS.borderLight,
                    }}
                    onChange={(e) =>
                      changeInputValue(
                        params.active === '1' ? 'shipperName' : params.active === '2' ? 'name' : 'receiverName',
                        e,
                      )
                    }
                  />
                </View>

                <View className={styles['form-item']}>
                  <Text className={styles['label']}>
                    {intl.formatMessage({
                      id: 'mine.shoujihaoma',
                      defaultMessage: '手机号码',
                    })}
                  </Text>
                  <Input
                    placeholder={intl.formatMessage({
                      id: 'mine.qingshurushoujihaoma',
                      defaultMessage: '请输入手机号码',
                    })}
                    name="phone"
                    maxlength={max}
                    type="number"
                    value={formItems.phone}
                    className={styles['input']}
                    placeholderClass={styles['input-placeholder']}
                    style={{
                      marginLeft: pxTransform(0),
                      paddingLeft: pxTransform(0),
                      borderBottomColor: THEME_COLORS.borderLight,
                    }}
                    onChange={(e) => changeInputValue('phone', e)}
                  />
                  {countryCodeView()}
                </View>

                {/* {params.active !== '2' && (
                  <View className={styles['form-item']}>
                    <Text className={styles['label']}>{translate('mobile.common.countryCode')}</Text>
                    <ModeCountryCode value={countryCode} onChange={setCountryCode} />
                  </View>
                )} */}
                {params.active !== '2' && isCN && (
                  <View className={styles['form-item']}>
                    <Text className={styles['label']}>
                      {params.active === '0'
                        ? intl.formatMessage({
                            id: 'mine.shouhuodiqu',
                            defaultMessage: '收货地区',
                          })
                        : intl.formatMessage({
                            id: 'mine.fahuodiqu',
                            defaultMessage: '发货地区',
                          })}
                    </Text>
                    <View
                      className={cx(styles['warp-item-box'], styles['clear'])}
                      onClick={() => setAddressVisible(!addressVisible)}
                    >
                      <Text
                        className={styles['address-text']}
                        style={{
                          color:
                            addressText ===
                              intl.formatMessage({
                                id: 'mine.qingxuanzeshouhuodiqu',
                                defaultMessage: '请选择收货地区',
                              }) ||
                            addressText ===
                              intl.formatMessage({
                                id: 'mine.qingxuanzefahuodiqu',
                                defaultMessage: '请选择发货地区',
                              })
                              ? '#C0C4CC'
                              : '#303133',
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
                )}

                {params.active !== '2' && (
                  <View className={styles['warp-flex-text']}>
                    <Text className={styles['label']}>
                      {intl.formatMessage({
                        id: 'mine.xiangxidizhi',
                        defaultMessage: '详细地址',
                      })}
                    </Text>
                    <TextArea
                      placeholder={intl.formatMessage({
                        id: 'mine.qingtianxiexiangxidizhi',
                        defaultMessage: '请填写详细地址，楼号、门牌号等',
                      })}
                      maxLength={60}
                      value={formItems.address}
                      className={cx(styles['input'], styles['warpflex'])}
                      placeholderClass={styles['input-placeholder']}
                      onChange={(e) => changeInputValue('address', e)}
                    />
                  </View>
                )}

                <View
                  className={cx(styles['from-item'], styles['justify-content'], styles['clear'], styles['set-default'])}
                >
                  <Text className={styles['label']}>
                    {intl.formatMessage({
                      id: 'mine.sheweimoren',
                      defaultMessage: '设为默认',
                    })}
                  </Text>
                  <View className={cx(styles['switch-btn'], styles['fl-right'])}>
                    <Switch color={THEME_COLORS.primary} checked={isSwitch} onChange={() => setIsSwitch(!isSwitch)} />
                  </View>
                </View>
              </Form>
            </View>

            {params.active !== '2' && (
              <View>
                <View className={styles['box']}>
                  <Text className={cx(styles['tip'], styles['boder'])}>
                    {intl.formatMessage({
                      id: 'mine.qitaxinxi',
                      defaultMessage: '其他信息(非必填)',
                    })}
                  </Text>
                </View>

                <View className={styles['address']}>
                  <Form className={styles['address-item']}>
                    <View className={styles['form-item']}>
                      <Text className={styles['label']}>
                        {intl.formatMessage({
                          id: 'mine.youbian',
                          defaultMessage: '邮编',
                        })}
                      </Text>
                      <Input
                        placeholder={intl.formatMessage({
                          id: 'mine.qingshuruyoubian',
                          defaultMessage: '请输入邮编',
                        })}
                        name="postalCode"
                        maxlength={12}
                        value={formItems.postalCode}
                        className={styles['input']}
                        placeholderClass={styles['input-placeholder']}
                        style={{
                          borderBottomColor: THEME_COLORS.borderLight,
                        }}
                        onChange={(e) => changeInputValue('postalCode', e)}
                      />
                    </View>

                    <View className={styles['form-item']}>
                      <Text className={styles['label']}>
                        {intl.formatMessage({
                          id: 'mine.dianhuahaoma',
                          defaultMessage: '电话号码',
                        })}
                      </Text>
                      <Input
                        placeholder={intl.formatMessage({
                          id: 'mine.qingshurudianhuahaoma',
                          defaultMessage: '请输入电话号码',
                        })}
                        name="tel"
                        maxlength={12}
                        value={formItems.tel}
                        className={styles['input']}
                        placeholderClass={styles['input-placeholder']}
                        style={{
                          borderBottomColor: THEME_COLORS.borderLight,
                        }}
                        onChange={(e) => changeInputValue('tel', e)}
                      />
                    </View>
                  </Form>
                </View>
              </View>
            )}
          </Form>
          <Button onClick={submit} className={styles['button']}>
            <Text
              style={{
                color: '#fff',
              }}
            >
              {intl.formatMessage({
                id: 'mine.baocun',
                defaultMessage: '保存',
              })}
            </Text>
          </Button>
        </ScrollView>

        {/* 选着手机区号 */}
        <ModeMobile
          toggle={toggle}
          onClose={() => {
            setToggle(false)
          }}
          onConfirm={(data) => {
            setCode(data.value)
            setMax(data.phoneLength)
            setToggle(false)
          }}
        />
      </View>
      {/* 三级联动 */}
      <AddressCode
        visible={addressVisible}
        onClose={() => setAddressVisible(false)}
        onSelect={onSelect}
        AddressData={addressData}
      />
    </View>
  )
}
export default GlobalWrapper(AddressAdd)
