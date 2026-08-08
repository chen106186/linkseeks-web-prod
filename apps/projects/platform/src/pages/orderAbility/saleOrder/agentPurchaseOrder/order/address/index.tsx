import React, { useState, useEffect, useMemo } from 'react'
import { Radio, Modal, Alert } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import AddAddress from '../components/addAddress'
import {
  getLogisticsReceiverAddressAgentPage,
  // getLogisticsMobileReceiverAddressListDefault,
  getLogisticsReceiverAddressGet,
  // postLogisticsReceiverAddressDelete,
  // postLogisticsReceiverAddressUpdate,
  postLogisticsReceiverAddressAgentDelete,
  postLogisticsReceiverAddressAgentUpdate,
  PostLogisticsReceiverAddressAgentUpdateRequest,
  // GetLogisticsReceiverAddressGetResponse,
} from '@apps/apis'
import { OrderInfoType, ProductItemType } from '../types'
import { ReceiverAddressItemType, SelectAreaItemType } from '../../components/DeliveryAddress/types'
import { RECEIVER_INFO_KEY } from '../../constants'
import { getCookie } from '@/utils/cookie'
import { useIntl } from '@linkseeks/i18n'
import { DELIVERY_TYPE_LOGISTICS, DELIVERY_TYPE_SELF_PICKUP } from '../../constants/order'
import styles from './index.less'
import { AgentPurchaseOrderInfoType } from '../../types'

interface AddressPropsType {
  buyerInfo: AgentPurchaseOrderInfoType
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
const receiverInfo = getCookie(RECEIVER_INFO_KEY, 'json') as SelectAreaItemType | undefined

const Address: React.FC<AddressPropsType> = (props) => {
  const intl = useIntl()
  const { visible, onChange, orderInfo, onHideLoading, buyerInfo } = props
  const [selectKey, setSelectKey] = useState<number>()
  const [expand, setExpand] = useState<boolean>(false)
  const [addressFormVisible, setAddressFormVisible] = useState<boolean>(false)
  const [addressList, setAddressList] = useState<AddressItemType[]>([])
  const [editItem, setEditItem] = useState<AddressItemType>()
  const [type, setType] = useState<'add' | 'edit'>('add')
  const [missMatchError, setMissMatchError] = useState<string>()

  const sortDefaultAddress = (list: ReceiverAddressItemType[]) => {
    let defaultAddress: ReceiverAddressItemType | undefined = undefined
    const result = list.filter((item) => {
      if (item.isDefault === 1) {
        defaultAddress = item
      }
      return item.isDefault === 0
    })
    if (defaultAddress) {
      result.unshift(defaultAddress)
    }
    return result
  }

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
            return true
          } else {
            noMatchProductName.push(`(${productItem.name})`)
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
    return productItem.commodityAreaList.some(
      (areaItem) =>
        areaItem.provinceCode === addressInfo.provinceCode &&
        (areaItem.isAllCity === false ? areaItem.cityCode === addressInfo.cityCode : true) &&
        (areaItem.isAllRegion === false ? areaItem.regionCode === addressInfo.districtCode : true),
    )
  }

  const getNomatchProductName = (list: AddressItemType[]) => {
    if (orderInfo && orderInfo.orderList.length > 0 && list.length > 0) {
      const noMatchProductName: string[] = []
      orderInfo.orderList.forEach((item) => {
        item.orderList.forEach((productItem) => {
          if (!productItem.isAllArea) {
            if (productItem.commodityAreaList && productItem.commodityAreaList.length > 0) {
              if (!list.some((addressItem) => judgeProductNoMatchAddress(productItem, addressItem))) {
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

  /** 获取用户收货地址数据 */
  const fetchAddressList = (init = false) => {
    const params: any = {
      current: 1,
      pageSize: 50,
      memberId: buyerInfo.memberId,
      roleId: buyerInfo.roleId,
    }
    getLogisticsReceiverAddressAgentPage(params).then((res) => {
      if (res.code === 1000 && res.data?.data && res.data.data.length > 0) {
        const list = sortDefaultAddress(res.data?.data)
        setAddressList(list)
        /** 判断用户所有收货地址是否含有匹配的地址，全部不匹配则提示 */
        getNomatchProductName(list)
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
        onChange(selectItem, judgeAddreeInArea(selectItem))
        return
      }
    }
    // 勾选默认地址
    if (defaultItem) {
      setSelectKey(defaultItem.id)
      onChange(defaultItem, judgeAddreeInArea(defaultItem))
      return
    }
    // 如果商品详情没有选择过收货地址和，也没有默认地址，则取第一个收货地址
    const firstItem = addressList[0]
    if (firstItem) {
      setSelectKey(firstItem.id)
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
      content: intl.formatMessage({ id: 'order.address.sureToDelete' }),
      centered: true,
      onOk: () => {
        return new Promise((resolve, reject) => {
          postLogisticsReceiverAddressAgentDelete({ id })
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
    const param: PostLogisticsReceiverAddressAgentUpdateRequest = addressDetailRes.data
    param.isDefault = 1
    postLogisticsReceiverAddressAgentUpdate(param).then((res: { code: number }) => {
      if (res.code === 1000) {
        fetchAddressList()
      }
    })
  }

  const _renderMissMatchError = useMemo(() => {
    return missMatchError ? (
      <Alert
        className={styles.warning_alert}
        message={intl.formatMessage({
          id: 'order.address.noMatch.errorText',
          defaultMessage: '选择的地区暂不支持 {{name}} 的商品配送！',
          name: missMatchError,
        })}
        type="warning"
        showIcon
        closable
      />
    ) : null
  }, [missMatchError])

  return visible ? (
    <div className={styles.address}>
      <div className={styles.common_title}>
        <span>{intl.formatMessage({ id: 'order.address.ReceivingAddress' })}</span>
        <div
          className={styles.common_title_btn}
          onClick={() => {
            setAddressFormVisible(true)
            setType('add')
          }}
        >
          {intl.formatMessage({ id: 'order.address.addReceivingAddress' })}
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
                      <div className={styles.default_address}>
                        {intl.formatMessage({ id: 'order.address.Defaultddress' })}
                      </div>
                    ) : (
                      <div className={styles.set_default_address} onClick={() => handleSetDefaultAddress(item)}>
                        {intl.formatMessage({ id: 'order.address.SetDefaultAddress' })}
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
                          {intl.formatMessage({ id: 'order.index.invoice.edit' })}
                        </div>
                        <div className={styles.address_item_btn} onClick={() => handleDelteAddress(item.id)}>
                          {intl.formatMessage({ id: 'order.index.invoice.delete' })}
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
          <span>
            {expand
              ? intl.formatMessage({ id: 'order.index.payway.PutAway' })
              : intl.formatMessage({ id: 'order.address.moreAddress' })}
          </span>
          <div className={styles.more_btn_icon}>
            <DownOutlined translate={undefined} rotate={expand ? 180 : 0} />
          </div>
        </div>
      )}
      <AddAddress
        title={
          type === 'add'
            ? intl.formatMessage({ id: 'order.address.addReceivingAddress' })
            : intl.formatMessage({ id: 'order.address.EditShippingAddress' })
        }
        type={type}
        editItem={editItem}
        buyerInfo={buyerInfo}
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
