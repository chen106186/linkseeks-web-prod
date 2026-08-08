/*
 * @Author: GHua
 * @Date: 2022-02-18 16:45:42
 * @LastEditTime: 2022-03-30 19:05:31
 * @LastEditors: GHua
 * @Description: 配送区域选择组件
 */
import React, { useEffect, useMemo, useRef } from 'react'
import cx from 'classnames'
import { useIntl } from '@linkseeks/i18n'
import { CaretDownOutlined } from '@ant-design/icons'
import IconFont from '@/utils/iconfont'
import {
  AreaDataItemType,
  CurrentActiveType,
  ReceiverAddressItemType,
  SelectAreaItemType,
  UseDelivertAddressDataRes,
} from './types'
import styles from './index.less'

interface DeliveryAddressProps {
  value: SelectAreaItemType | undefined
  hook: () => UseDelivertAddressDataRes
  onSelect?: (selectItem: SelectAreaItemType, isSave?: boolean) => void
}

const DeliveryAddress: React.FC<DeliveryAddressProps> = (props) => {
  const { value, hook, onSelect } = props
  const initState = useRef<boolean>(false)
  const {
    visible,
    currentActive,
    selectProvince,
    selectCity,
    selectDistrict,
    selectStreet,
    areaData,
    directlyCityList,
    cityList,
    districtList,
    streetList,
    receiverAddressList,
    dispatchCurrentActive,
    dispatchProvince,
    dispatchCity,
    dispatchDistrict,
    dispatchStreet,
    toggleVisible,
  } = hook()
  const intl = useIntl()

  const initSelect = (selectInfo: SelectAreaItemType) => {
    const provincInfo = [...directlyCityList, ...areaData].filter(
      (item) => item.provinceCode === selectInfo.provinceCode,
    )[0]

    if (provincInfo) {
      dispatchProvince(provincInfo)
      if (provincInfo.cityList.length > 0) {
        const cityInfo = provincInfo.cityList.filter((item) => item.cityCode === selectInfo.cityCode)[0]

        if (cityInfo && !selectCity && districtList.length === 0) {
          dispatchCity(cityInfo)
        } else {
          // console.log(selectCity, districtList, '如果没有区级数据')
          // // 如果没有区级数据
          // if (selectCity && districtList.length === 0 && !selectDistrict) {
          //   onSelect && onSelect({
          //     addressId: selectInfo?.addressId,
          //     provinceCode: selectInfo?.provinceCode,
          //     provinceName: selectInfo?.provinceName,
          //     cityCode: selectInfo.cityCode,
          //     cityName: selectInfo.cityName,
          //   })
          //   return
          // }
          if (districtList.length > 0 && streetList.length === 0 && !selectDistrict) {
            const districtItem = selectInfo?.districtCode
              ? districtList.filter((item) => item.districtCode === selectInfo?.districtCode)[0]
              : districtList[0]
            dispatchDistrict(districtItem)
          } else {
            if (streetList.length > 0 && selectDistrict && !selectStreet) {
              const streetItem = selectInfo?.streetCode
                ? streetList.filter((item) => item.streetCode === selectInfo?.streetCode)[0]
                : streetList[0]
              dispatchStreet(streetItem)
              onSelect &&
                onSelect({
                  addressId: selectInfo?.addressId,
                  provinceCode: selectInfo?.provinceCode,
                  provinceName: selectInfo?.provinceName,
                  cityCode: selectInfo.cityCode,
                  cityName: selectInfo.cityName,
                  districtCode: selectDistrict.districtCode,
                  districtName: selectDistrict.districtName,
                  streetCode: streetItem.streetCode,
                  streetName: streetItem.streetName,
                })
              if (receiverAddressList && receiverAddressList.length > 0) {
                const receiverAddress = selectInfo?.addressId
                  ? receiverAddressList.filter((item) => item.id === selectInfo.addressId)[0]
                  : receiverAddressList[0]
                if (!selectInfo?.districtCode && receiverAddress) {
                  onSelect &&
                    onSelect({
                      provinceCode: receiverAddress.provinceCode,
                      provinceName: receiverAddress.provinceName,
                      cityCode: receiverAddress.cityCode,
                      cityName: receiverAddress.cityName,
                      districtCode: receiverAddress.districtCode,
                      districtName: receiverAddress.districtName,
                      streetCode: receiverAddress.streetCode,
                      streetName: receiverAddress.streetName,
                      addressId: receiverAddress.id,
                    })
                  dispatchCurrentActive('address')
                } else {
                  dispatchCurrentActive('street')
                }
              } else {
                dispatchCurrentActive('street')
              }
              initState.current = true
            }
          }
        }
      }
    }
  }

  useEffect(() => {
    if (value && areaData.length > 0) {
      if (!initState.current) {
        initSelect(value)
      }
    }
  }, [value, areaData, districtList, streetList, selectDistrict])

  const handleSelectArea = (selectInfo: SelectAreaItemType, type: CurrentActiveType) => {
    switch (type) {
      case 'address':
        break
      case 'province':
        selectInfo &&
          dispatchProvince({
            provinceCode: selectInfo.provinceCode,
            provinceName: selectInfo.provinceName,
            cityList: selectInfo.cityList || [],
          })
        break
      case 'city':
        selectInfo &&
          dispatchCity({
            cityCode: selectInfo.cityCode,
            cityName: selectInfo.cityName,
          })
        break
      case 'district':
        if (selectInfo && selectInfo.districtCode && selectInfo.districtName) {
          dispatchDistrict({
            districtCode: selectInfo.districtCode,
            districtName: selectInfo.districtName,
          })
        }
        break
      case 'street':
        if (selectInfo && selectInfo.streetCode && selectInfo.streetName) {
          dispatchStreet({
            streetCode: selectInfo.streetCode,
            streetName: selectInfo.streetName,
          })
          if (selectProvince && selectCity && selectDistrict) {
            onSelect &&
              onSelect(
                {
                  addressId: undefined,
                  provinceCode: selectProvince?.provinceCode,
                  provinceName: selectProvince?.provinceName,
                  cityCode: selectCity.cityCode,
                  cityName: selectCity.cityName,
                  districtCode: selectDistrict.districtCode,
                  districtName: selectDistrict.districtName,
                  streetCode: selectInfo.streetCode,
                  streetName: selectInfo.streetName,
                },
                true,
              )
          }
        }
        break
      default:
        dispatchCity(undefined)
        break
    }
  }

  const renderAreaColumnByType = useMemo(() => {
    switch (currentActive) {
      case 'province':
        return (
          <>
            <div className={styles.delivery_box_select_hot_line}>
              {directlyCityList &&
                directlyCityList.length > 0 &&
                directlyCityList.map((directlyCityItem) => (
                  <div
                    className={cx(
                      styles.delivery_box_select_item,
                      selectProvince?.provinceCode === directlyCityItem.provinceCode && styles.active,
                    )}
                    key={directlyCityItem.provinceCode}
                    onClick={() => {
                      const provincInfo: AreaDataItemType = {
                        provinceCode: directlyCityItem.provinceCode,
                        provinceName: directlyCityItem.provinceName,
                        cityList: directlyCityItem.cityList,
                      }
                      dispatchProvince(provincInfo)
                      if (provincInfo.cityList[0]) {
                        dispatchCity({
                          cityCode: provincInfo.cityList[0].cityCode,
                          cityName: provincInfo.cityList[0].cityName,
                        })
                      }
                    }}
                  >
                    <span>{directlyCityItem.provinceName}</span>
                  </div>
                ))}
            </div>
            <div className={styles.delivery_box_select_list}>
              {areaData &&
                areaData.length > 0 &&
                areaData.map((item) => (
                  <div
                    className={cx(
                      styles.delivery_box_select_item,
                      selectProvince?.provinceCode === item.provinceCode && styles.active,
                    )}
                    key={item.provinceCode}
                    onClick={() => handleSelectArea({ ...item } as SelectAreaItemType, 'province')}
                  >
                    <span>{item.provinceName}</span>
                  </div>
                ))}
            </div>
          </>
        )
      case 'city':
        return (
          <div className={styles.delivery_box_select_list}>
            {cityList &&
              cityList.length > 0 &&
              cityList.map((item) => (
                <div
                  className={cx(
                    styles.delivery_box_select_item,
                    selectCity?.cityCode === item.cityCode && styles.active,
                  )}
                  key={item.cityCode}
                  onClick={() =>
                    handleSelectArea(
                      {
                        ...selectProvince,
                        ...item,
                      } as SelectAreaItemType,
                      'city',
                    )
                  }
                >
                  <span>{item.cityName}</span>
                </div>
              ))}
          </div>
        )
      case 'district':
        return (
          <div className={styles.delivery_box_select_list}>
            {districtList &&
              districtList.length > 0 &&
              districtList.map((item) => (
                <div
                  className={cx(
                    styles.delivery_box_select_item,
                    selectDistrict?.districtCode === item.districtCode && styles.active,
                  )}
                  key={item.districtCode}
                  onClick={() =>
                    handleSelectArea(
                      {
                        ...item,
                      } as SelectAreaItemType,
                      'district',
                    )
                  }
                >
                  <span>{item.districtName}</span>
                </div>
              ))}
          </div>
        )
      case 'street':
        return (
          <div className={styles.delivery_box_select_list}>
            {streetList &&
              streetList.length > 0 &&
              streetList.map((item) => (
                <div
                  className={cx(
                    styles.delivery_box_select_item,
                    selectStreet?.streetCode === item.streetCode && styles.active,
                  )}
                  key={item.streetCode}
                  onClick={() =>
                    handleSelectArea(
                      {
                        ...item,
                      } as SelectAreaItemType,
                      'street',
                    )
                  }
                >
                  <span>{item.streetName}</span>
                </div>
              ))}
          </div>
        )
    }
  }, [currentActive, directlyCityList, areaData, cityList, selectCity, selectProvince, selectStreet, selectDistrict])

  const handleSelectAddress = (addressInfo: ReceiverAddressItemType) => {
    if (addressInfo && onSelect) {
      onSelect(
        {
          provinceCode: addressInfo?.provinceCode,
          provinceName: addressInfo?.provinceName,
          cityCode: addressInfo.cityCode,
          cityName: addressInfo.cityName,
          districtCode: addressInfo.districtCode,
          districtName: addressInfo.districtName,
          streetCode: addressInfo.streetCode,
          streetName: addressInfo.streetName,
          addressId: addressInfo.id,
        },
        true,
      )
      toggleVisible()
    }
  }

  return (
    <div className={styles.delivery_box}>
      {value && (
        <div onClick={toggleVisible}>
          <span className={styles.delivery_address}>
            {value?.provinceName}
            {value?.cityName}
            {value?.districtName}
            {value?.streetName}
          </span>
          <CaretDownOutlined className={styles.delivery_address_icon} translate={undefined} />
        </div>
      )}
      {visible && (
        <>
          <div className={styles.delivery_box_mask} onClick={toggleVisible} />
          <div className={styles.delivery_box_panel}>
            <div className={styles.delivery_box_body}>
              <div className={styles.delivery_box_header}>
                <IconFont type="icon-positon" className={styles.delivery_box_header_icon} />
                <span>{intl.formatMessage({ id: 'delivery.address.select', defaultMessage: '选择当前定位地址' })}</span>
              </div>
              <div className={styles.delivery_box_select_line}>
                <div
                  className={cx(styles.delivery_box_select_box, currentActive !== 'address' && styles.active)}
                  onClick={() => currentActive === 'address' && dispatchCurrentActive('street')}
                >
                  {value?.provinceName} {value?.cityName}
                </div>
                {receiverAddressList && receiverAddressList.length > 0 && (
                  <div
                    className={cx(styles.delivery_box_select_box, currentActive === 'address' && styles.active)}
                    onClick={() => dispatchCurrentActive('address')}
                  >
                    <span>
                      {intl.formatMessage({ id: 'delivery.address.select.other', defaultMessage: '选择其他地区' })}
                    </span>
                    <CaretDownOutlined className={styles.select_icon} translate={undefined} />
                  </div>
                )}
              </div>
              {currentActive !== 'address' ? (
                <>
                  <div className={styles.delivery_box_select_city_line}>
                    <div
                      className={cx(
                        styles.delivery_box_select_city_line_item,
                        currentActive === 'province' && styles.active_select,
                      )}
                      onClick={() => {
                        if (currentActive !== 'province') {
                          dispatchCity(undefined)
                        }
                      }}
                    >
                      <span className={styles.delivery_box_select_city_line_item_text}>
                        {selectProvince
                          ? selectProvince.provinceName
                          : intl.formatMessage({ id: 'order.addAddress.select' })}
                      </span>
                    </div>
                    <div
                      className={cx(
                        styles.delivery_box_select_city_line_item,
                        currentActive === 'city' && styles.active_select,
                      )}
                      onClick={() => {
                        if (currentActive !== 'city') {
                          dispatchDistrict(undefined)
                        }
                      }}
                    >
                      <span className={styles.delivery_box_select_city_line_item_text}>
                        {selectCity ? selectCity.cityName : ''}
                      </span>
                    </div>
                    <div
                      className={cx(
                        styles.delivery_box_select_city_line_item,
                        currentActive === 'district' && styles.active_select,
                      )}
                      onClick={() => {
                        if (currentActive !== 'district') {
                          dispatchStreet(undefined)
                        }
                      }}
                    >
                      <span className={styles.delivery_box_select_city_line_item_text}>
                        {selectDistrict ? selectDistrict.districtName : ''}
                      </span>
                    </div>
                    <div
                      className={cx(
                        styles.delivery_box_select_city_line_item,
                        currentActive === 'street' && styles.active_select,
                      )}
                    >
                      <span className={styles.delivery_box_select_city_line_item_text}>
                        {selectStreet ? selectStreet.streetName : ''}
                      </span>
                    </div>
                  </div>
                  <div className={styles.delivery_box_address_wrap}>{renderAreaColumnByType}</div>
                </>
              ) : (
                <>
                  <div className={styles.delivery_box_header}>
                    <IconFont type="icon-adddress" className={styles.delivery_box_header_icon} />
                    <span>
                      {intl.formatMessage({
                        id: 'delivery.address.current.select',
                        defaultMessage: '从我的收货地址中选择',
                      })}
                    </span>
                  </div>
                  <div className={styles.delivery_box_address_wrap}>
                    <div className={styles.receiver_address_list}>
                      {receiverAddressList &&
                        receiverAddressList.length > 0 &&
                        receiverAddressList.map((item) => (
                          <div
                            className={cx(
                              styles.receiver_address_list_item,
                              value?.addressId === item.id && styles.active,
                            )}
                            key={item.id}
                            onClick={() => handleSelectAddress(item)}
                          >
                            <div className={styles.receiver_address_list_item_line}>
                              <span>{item.cityName}</span>
                              <span>{item.address}</span>
                              <span>
                                {item.receiverName}(
                                {intl.formatMessage({ id: 'delivery.address.text.receiver', defaultMessage: '收' })})
                              </span>
                              {item.isDefault === 1 && (
                                <label className={styles.receiver_address_default}>
                                  {intl.formatMessage({ id: 'delivery.address.default', defaultMessage: '默认地址' })}
                                </label>
                              )}
                            </div>
                            <div>
                              {item.provinceName}
                              {item.cityName}
                              {item.districtName}
                              {item.streetName}
                              {item.address}
                            </div>
                            <div>{item.phone}</div>
                          </div>
                        ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default DeliveryAddress
