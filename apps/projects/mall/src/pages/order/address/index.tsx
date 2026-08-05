import React, { useState, useEffect, useMemo } from 'react'
import { Radio, Modal, Alert } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import AddAddress from '../components/addAddress'
import {
  getLogisticsMobileReceiverAddressListDefault,
  getLogisticsReceiverAddressGet,
  postLogisticsReceiverAddressDelete,
  postLogisticsReceiverAddressUpdate,
  GetLogisticsReceiverAddressGetResponse,
} from '@apps/apis'
import { getWebIntl } from '@/utils/locales'
import { deliveryService } from '@apps/services'
import { DELIVERY_TYPE_LOGISTICS, DELIVERY_TYPE_SELF_PICKUP } from '@/types/order'
import { OrderInfoType, ProductItemType } from '../types'
import styles from './index.module.less'

interface AddressPropsType {
  orderInfo: OrderInfoType
  onChange: (selectInfo: AddressItemType | undefined, isInArea?: boolean) => void
  onHideLoading?: Function
  visible: boolean
}

export interface AddressItemType {
  /**
   * 主键id
   */
  id: number
  /**
   * 收货人名称
   */
  receiverName: string
  /**
   * 省编号
   */
  provinceCode: string
  /**
   * 省名称
   */
  provinceName: string
  /**
   * 市编号
   */
  cityCode: string
  /**
   * 市名称
   */
  cityName: string
  /**
   * 区编号
   */
  districtCode: string
  /**
   * 区名称
   */
  districtName: string
  /**
   * 街道编码
   */
  streetCode: string
  /**
   * 街道名称
   */
  streetName: string
  /**
   * 详细地址
   */
  address: string
  /**
   * 邮编
   */
  postalCode: string
  /**
   * 手机号码
   */
  phone: string
  /**
   * 电话号码
   */
  tel: string
  /**
   * 是否默认0-否1-是
   */
  isDefault: number
}

const Address: React.FC<AddressPropsType> = (props) => {
  const { visible, onChange, orderInfo, onHideLoading } = props
  const [selectKey, setSelectKey] = useState<number>()
  const [expand, setExpand] = useState<boolean>(false)
  const [addressFormVisible, setAddressFormVisible] = useState<boolean>(false)
  const [addressList, setAddressList] = useState<AddressItemType[]>([])
  const [editItem, setEditItem] = useState<AddressItemType>()
  const [type, setType] = useState<'add' | 'edit'>('add')
  const [missMatchError, setMissMatchError] = useState<string>()
  const receiverInfo = deliveryService.getDelivery()
  const translate = getWebIntl()

  /**
   * 判断收货地址是否在配送范围内
   */
  const judgeAddreeInArea = (addressInfo: AddressItemType) => {
    if (!orderInfo) return false
    const noMatchProductName: string[] = []
    return orderInfo.orderList.every((orderItem) => {
      return orderItem.orderList.every((productItem) => {
        if (productItem.selectDeliveryType === DELIVERY_TYPE_SELF_PICKUP) return true
        if (productItem.isAllArea) return true
        if (productItem.commodityAreaList && productItem.commodityAreaList.length > 0) {
          if (
            productItem.commodityAreaList.some(
              (areaItem) =>
                areaItem.provinceCode === addressInfo.provinceCode &&
                (areaItem.isAllCity === false ? areaItem.cityCode === addressInfo.cityCode : true) &&
                (areaItem.isAllRegion === false ? areaItem.regionCode === addressInfo.districtCode : true),
            )
          ) {
            return productItem.limitWay === 1 ? true : false
          } else {
            if (productItem.limitWay === 1) {
              noMatchProductName.push(`(${productItem.name})`)
            } else {
              return true
            }
          }
        } else {
          noMatchProductName.push(`(${productItem.name})`)
        }
        return false
      })
    })
  }

  const getNoMatchAddressProductName = (addressInfo: AddressItemType) => {
    if (orderInfo) {
      const noMatchProductName: string[] = []
      for (const orderItem of orderInfo.orderList) {
        for (const productItem of orderItem.orderList) {
          if (!productItem.isAllArea && productItem.selectDeliveryType === DELIVERY_TYPE_LOGISTICS) {
            if (productItem.commodityAreaList && productItem.commodityAreaList.length > 0) {
              if (!judgeProductNoMatchAddress(productItem, addressInfo)) {
                noMatchProductName.push(`(${productItem.name})`)
              }
            } else {
              noMatchProductName.push(`(${productItem.name})`)
            }
          }
        }
      }
      setMissMatchError(noMatchProductName.join('、'))
    }
  }

  const judgeSelectAddreeInArea = (addressId: number) => {
    if (orderInfo && orderInfo.orderList.length > 0 && addressList.length > 0) {
      const selectItem = addressList.filter((item) => item.id === addressId)[0]
      const noMatchProductName: string[] = []

      orderInfo.orderList.forEach((item) => {
        item.orderList.forEach((productItem) => {
          if (!productItem.isAllArea) {
            if (productItem.commodityAreaList && productItem.commodityAreaList.length > 0) {
              if (!judgeProductNoMatchAddress(productItem, selectItem)) {
                noMatchProductName.push(`(${productItem.name})`)
              }
            } else {
              noMatchProductName.push(`(${productItem.name})`)
            }
          }
        })
      })
      setMissMatchError(noMatchProductName.join('、'))
    }
  }

  useEffect(() => {
    if (orderInfo && selectKey) {
      judgeSelectAddreeInArea(selectKey)
    } else {
      setMissMatchError('')
    }
  }, [orderInfo])

  useEffect(() => {
    if (visible) {
      fetchAddressList(true)
    }
  }, [visible])

  const judgeProductNoMatchAddress = (productItem: ProductItemType, addressInfo: AddressItemType) => {
    if (
      productItem.commodityAreaList.some(
        (areaItem) =>
          areaItem.provinceCode === addressInfo.provinceCode &&
          (areaItem.isAllCity === false ? areaItem.cityCode === addressInfo.cityCode : true) &&
          (areaItem.isAllRegion === false ? areaItem.regionCode === addressInfo.districtCode : true),
      )
    ) {
      return productItem.limitWay === 1 ? true : false
    } else {
      return productItem.limitWay === 1 ? false : true
    }
  }

  /** 获取用户收货地址数据 */
  const fetchAddressList = (init = false) => {
    getLogisticsMobileReceiverAddressListDefault().then((res) => {
      if (res.code === 1000 && res.data && res.data.length > 0) {
        const list = res.data // .sort((b, a) => judgeAddreeInArea(b) ? -1 : 1)
        setAddressList(list)
        if (init) {
          initDefaultAddress(list)
        } else {
          if (selectKey) {
            const selectItem = list.filter((item) => item.id === selectKey)[0]
            if (selectItem) {
              onChange(selectItem, judgeAddreeInArea(selectItem))
            } else {
              setSelectKey(undefined)
              onChange(undefined)
            }
          }
        }
      } else {
        onHideLoading && onHideLoading()
      }
    })
  }

  /**
   * 当用户有默认地址或者在详情页选中了收货地址，并在配送范围内则自动选中
   * @param addressList
   * @returns
   */
  const initDefaultAddress = async (addressList: AddressItemType[]) => {
    let defaultItem
    for (const item of addressList) {
      if (item.isDefault === 1) {
        defaultItem = item
      }
    }

    // 如果在商品详情选择过收货地址，则根据选择的地址勾选
    if (receiverInfo) {
      const selectItem = addressList.filter((item) => item.id === receiverInfo.addressId)[0]
      if (selectItem) {
        setSelectKey(selectItem.id)
        getNoMatchAddressProductName(selectItem)
        onChange(selectItem, judgeAddreeInArea(selectItem))
        return
      }
    }
    // 勾选默认地址
    if (defaultItem) {
      setSelectKey(defaultItem.id)
      getNoMatchAddressProductName(defaultItem)
      onChange(defaultItem, judgeAddreeInArea(defaultItem))
      return
    }
    // 如果商品详情没有选择过收货地址和，也没有默认地址，则取第一个收货地址
    const firstItem = addressList[0]
    if (firstItem) {
      setSelectKey(firstItem.id)
      getNoMatchAddressProductName(firstItem)
      onChange(firstItem, judgeAddreeInArea(firstItem))
      return
    }

    onHideLoading && onHideLoading()
  }

  const handleSelect = async (e: any) => {
    setSelectKey(e.target.value)
    const selectItem = addressList.filter((item) => item.id === e.target.value)[0]
    if (selectItem) {
      getNoMatchAddressProductName(selectItem)
      onChange(selectItem, judgeAddreeInArea(selectItem))
    }
  }

  /**
   * 删除收货地址
   */
  const handleDelteAddress = (id: number) => {
    Modal.confirm({
      className: styles.mallComfirm,
      content: translate('web.resource.mall.shifouquerenshanchugaishouhuodizhi'),
      centered: true,
      okText: translate('web.common.confirm'),
      cancelText: translate('web.common.cancel'),
      onOk: () => {
        return new Promise((resolve, reject) => {
          postLogisticsReceiverAddressDelete({ id })
            .then((res: { code: number }) => {
              if (res.code === 1000) {
                resolve(true)
                fetchAddressList()
              }
            })
            .catch(() => {
              reject()
            })
        })
      },
    })
  }

  const handleSetDefaultAddress = async (addressItem: AddressItemType) => {
    const params: any = { id: addressItem.id }
    const addressDetailRes = await getLogisticsReceiverAddressGet(params)
    const param: GetLogisticsReceiverAddressGetResponse = addressDetailRes.data
    param.isDefault = 1
    postLogisticsReceiverAddressUpdate(param).then((res: { code: number }) => {
      if (res.code === 1000) {
        fetchAddressList()
      }
    })
  }

  const _renderMissMatchError = useMemo(() => {
    return missMatchError ? (
      <Alert
        className={styles.warning_alert}
        message={translate('web.resource.mall.xuanzedediquzanbuzhichishangpinpeisong', { name: missMatchError })}
        type="warning"
        showIcon
        closable
      />
    ) : null
  }, [missMatchError])

  return visible ? (
    <div className={styles.address}>
      <div className={styles.common_title}>
        <span>{translate('web.resource.logistics.shouhuodizhi')}</span>
        <div
          className={styles.common_title_btn}
          onClick={() => {
            setAddressFormVisible(true)
            setType('add')
          }}
        >
          {translate('web.resource.mall.xinzengshouhuodizhi')}
        </div>
      </div>
      {_renderMissMatchError}
      <Radio.Group className={styles.address_raido_group} value={selectKey} onChange={handleSelect}>
        <div className={styles.address_list}>
          {addressList.map(
            (item, index) =>
              (!expand ? index < 3 : true) && (
                <Radio className={styles.address_list_radio} value={item.id} key={`address_list_radio_${item.id}`}>
                  <div className={styles.adderss_list_radio_line}>
                    <span>{item.receiverName}</span>
                    <span>
                      {item.provinceName}
                      {item.cityName}
                      {item.districtName}
                      {item.streetName}
                      {item.address}
                    </span>
                    <span>{item.phone}</span>
                    {item.isDefault === 1 ? (
                      <div className={styles.default_address}>{translate('web.common.default')}</div>
                    ) : (
                      <div className={styles.set_default_address} onClick={() => handleSetDefaultAddress(item)}>
                        {translate('web.resource.mall.sheweimorendizhi')}
                      </div>
                    )}
                    {selectKey === item.id && (
                      <div className={styles.address_item_btn_group}>
                        <div
                          className={styles.address_item_btn}
                          onClick={() => {
                            setEditItem(item)
                            setType('edit')
                            setAddressFormVisible(true)
                          }}
                        >
                          {translate('web.common.edit')}
                        </div>
                        <div className={styles.address_item_btn} onClick={() => handleDelteAddress(item.id)}>
                          {translate('web.common.delete')}
                        </div>
                      </div>
                    )}
                  </div>
                </Radio>
              ),
          )}
        </div>
      </Radio.Group>
      {addressList.length > 3 && (
        <div className={styles.more_btn} onClick={() => setExpand(!expand)}>
          <span>{expand ? translate('web.resource.mall.shouqi') : translate('web.resource.mall.gengduodizhi')}</span>
          <div className={styles.more_btn_icon}>
            <DownOutlined translate={undefined} rotate={expand ? 180 : 0} />
          </div>
        </div>
      )}
      <AddAddress
        title={
          type === 'add'
            ? translate('web.resource.mall.xinzengshouhuodizhi')
            : translate('web.resource.mall.bianjishouhuodizhi')
        }
        type={type}
        editItem={editItem}
        visible={addressFormVisible}
        onCancel={() => {
          setAddressFormVisible(false)
        }}
        onOk={() => {
          setAddressFormVisible(false)
          fetchAddressList()
          setEditItem(undefined)
        }}
      />
    </div>
  ) : null
}

export default Address
