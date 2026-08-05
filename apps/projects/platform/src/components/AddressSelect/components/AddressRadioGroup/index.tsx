/*
 * @Author: XieZhiXiong
 * @Date: 2021-08-05 14:23:40
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-08-18 11:04:54
 * @Description: 地址单选框组
 */
import React, { useState, useEffect, useMemo, useRef } from 'react'
import type { RadioChangeEvent } from 'antd'
import { Radio, Button, Modal, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import type { IRequestSuccess } from '@/index'
import AddressSelectContext from '@/components/AddressSelect/context'
import styles from './index.less'
import type { GetLogisticsReceiverAddressGetResponse, GetLogisticsShipperAddressGetResponse } from '@apps/apis'
import {
  getLogisticsReceiverAddressGet,
  getLogisticsSelectListReceiverAddress,
  getLogisticsSelectListShipperAddress,
  getLogisticsShipperAddressGet,
  postLogisticsReceiverAddressDelete,
  postLogisticsReceiverAddressUpdate,
  postLogisticsShipperAddressDelete,
  postLogisticsShipperAddressUpdate,
} from '@apps/apis'
import { useIntl } from '@linkseeks/i18n'

const { confirm } = Modal
export type AddressItemType = {
  /**
   * 主键id
   */
  id: number
  /**
   * 发货人名称
   */
  shipperName?: string
  /**
   * 收件人名称
   */
  receiverName?: string
  /**
   * 发货地址
   */
  fullAddress?: string
  /**
   * 手机号码
   */
  phone?: string
  /**
   * 是否默认0-否1-是
   */
  isDefault?: number
}

export type AddressValueType = Omit<AddressItemType, 'shipperName' | 'receiverName'> & {
  /**
   * 寄件人 或者 收件人名称
   */
  name: string
  /**
   * 详细地址
   */
  address?: string
  /**
   * 城市名
   */
  cityName?: string
  /**
   * 区名
   */
  districtName?: string
  /**
   * 省名
   */
  provinceName?: string
  /**
   * 街道名字
   */
  streetName?: string
}

interface IProps {
  /**
   * 类型：1 收货地址 2 发货地址，默认 2
   */
  addressType: 1 | 2
  /**
   * 值
   */
  value?: AddressValueType
  /**
   * 选择触发改变
   */
  onChange?: (value: AddressValueType) => void
  /**
   * 是否默认选择 默认地址，是的话会触发 onChange value为默认地址，默认为false
   */
  isDefaultAddress?: boolean
  /**
   * 点击编辑触发事件
   */
  onClickEdit?: (recordId: number) => void

  /**
   * 编辑按钮文案
   */
  editBtnText?: string | React.ReactNode

  /**
   * 删除按钮文案
   */
  deleteBtnText?: string | React.ReactNode
}

const AddressRadioGroup: React.FC<IProps> = (props) => {
  const intl = useIntl()
  const {
    addressType = 2,
    value,
    onChange,
    onClickEdit,
    isDefaultAddress = false,
    editBtnText = intl.formatMessage({ id: 'components.bianji' }),
    deleteBtnText = intl.formatMessage({ id: 'components.shanchu' }),
  } = props
  const [list, setList] = useState<AddressValueType[]>([])
  const [internalValue, setInternalValue] = useState<AddressValueType | undefined>(undefined)

  const context = React.useContext(AddressSelectContext)

  // 记录是否是新增或编辑操作
  const actionFlagRef = useRef<boolean>(false)

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const triggerChange = (value: AddressValueType) => {
    if (onChange) {
      onChange(value)
    }
  }

  const getAddressList = () => {
    // context存在直接在context里边取
    if (context) {
      return
    }
    const fetchAction =
      addressType === 2 ? getLogisticsSelectListShipperAddress() : getLogisticsSelectListReceiverAddress()

    fetchAction
      .then((res: IRequestSuccess<AddressItemType[]>) => {
        if (res.code === 1000) {
          const defaultItem = res.data?.find((item) => item.isDefault)
          const listArr = res.data?.map(({ shipperName, receiverName, ...rest }) => ({
            name: shipperName || receiverName,
            ...rest,
          }))
          setList(listArr)

          // 这里处理如果设置了回调默认地址，然后进行了删除这条默认地址地址操作
          // 之后重新请求了列表，但因为之前的默认地址被删除了，需要重新置空地址值
          if (isDefaultAddress && value && value.id && !listArr.find((item) => item.id === value.id)) {
            if (!('value' in props)) {
              setInternalValue(undefined)
            }

            triggerChange(undefined)
          }

          if (isDefaultAddress && defaultItem && !actionFlagRef.current) {
            const { shipperName, receiverName, ...rest } = defaultItem
            const next = {
              name: shipperName || receiverName,
              ...rest,
            }

            if (!('value' in props)) {
              setInternalValue(next)
            }
            triggerChange(next)
          }
        }
      })
      .catch((err) => {
        console.warn(err)
      })
  }

  const refresh = (actionFlag?: boolean) => {
    if (context) {
      context?.refresh(actionFlag)
    }
    {
      // 重新获取列表，把新添加的内容加载出来
      // 不触发默认值提交
      actionFlagRef.current = true
      getAddressList()
    }
  }

  useEffect(() => {
    if ('value' in props) {
      setInternalValue(value)
    }
  }, [value])

  useEffect(() => {
    setList(context?.addressList)
  }, [context?.addressList])

  useEffect(() => {
    getAddressList()
  }, [])

  const handleSelectItem = (id: number) => {
    const current = list.find((item) => item.id === id)

    if (!('value' in props)) {
      setInternalValue(current)
    }

    if (current) {
      triggerChange(current)
    }
  }

  const handleRadioClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation()
  }

  const handleRadioChange = (e: RadioChangeEvent) => {
    const current = list.find((item) => item.id === e.target.value)

    if (!('value' in props)) {
      setInternalValue(current)
    }

    if (current) {
      triggerChange(current)
    }
  }

  const handleEdit = (e: React.MouseEvent<HTMLElement, MouseEvent>, id: number) => {
    e.stopPropagation()
    onClickEdit?.(id)
  }

  const handleDelete = (e: React.MouseEvent<HTMLElement, MouseEvent>, id: number) => {
    e.stopPropagation()
    confirm({
      title: intl.formatMessage({ id: 'components.tishi' }),
      icon: <ExclamationCircleOutlined />,
      content: intl.formatMessage({ id: 'components.shifouxuyaoshanchugaidi' }),
      onOk() {
        return (
          addressType === 2 ? postLogisticsShipperAddressDelete({ id }) : postLogisticsReceiverAddressDelete({ id })
        ).then((res) => {
          if (res.code === 1000) {
            refresh()
          }
        })
      },
    })
  }

  // 设置默认地址，这里直接调用修改地址接口
  const handleSetDefaultItem = async (e: React.MouseEvent<HTMLElement, MouseEvent>, id: number) => {
    e.stopPropagation()

    const mesInstance = message.loading({
      content: intl.formatMessage({ id: 'components.zhengzaishezhi' }),
      duration: 0,
    })

    try {
      const res =
        addressType === 2
          ? await getLogisticsShipperAddressGet({ id: `${id}` })
          : await getLogisticsReceiverAddressGet({ id: `${id}` })
      if (res.code === 1000) {
        const updateRes =
          addressType === 2
            ? await postLogisticsShipperAddressUpdate({
                ...(res.data as GetLogisticsShipperAddressGetResponse),
                isDefault: 1,
              })
            : await postLogisticsReceiverAddressUpdate({
                ...(res.data as GetLogisticsReceiverAddressGetResponse),
                isDefault: 1,
              })
        if (updateRes.code === 1000) {
          refresh(true)
        }
      }
    } catch (error) {
      console.warn(error)
    }

    mesInstance()
  }

  const options = useMemo(() => {
    return list.map((item) => ({
      value: item.id,
      label: `${item.name} ${item.fullAddress} ${item.phone}`,
      isDefault: !!item.isDefault,
    }))
  }, [list])

  return (
    <div className={styles.addressList}>
      <Radio.Group value={internalValue?.id} style={{ display: 'block' }}>
        {options.map((item) => (
          <div key={item.value} className={styles['addressList-item']} onClick={() => handleSelectItem(item.value)}>
            <div className={styles['addressList-item-left']}>
              <Radio value={item.value} onClick={handleRadioClick} onChange={handleRadioChange}>
                {item.label}
              </Radio>
              {item.isDefault ? (
                <span className={styles['addressList-item-default']}>
                  {intl.formatMessage({ id: 'components.morendizhi' })}
                </span>
              ) : (
                <div className={styles['addressList-item-actions']}>
                  <Button type="text" size="small" onClick={(e) => handleSetDefaultItem(e, item.value)}>
                    {intl.formatMessage({ id: 'components.sheweimorendizhi' })}
                  </Button>
                </div>
              )}
            </div>
            <div className={styles['addressList-item-right']}>
              <div className={styles['addressList-item-actions']}>
                <Button type="text" size="small" onClick={(e) => handleEdit(e, item.value)}>
                  {editBtnText}
                </Button>
                <Button type="text" size="small" onClick={(e) => handleDelete(e, item.value)}>
                  {deleteBtnText}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </Radio.Group>
    </div>
  )
}

export default AddressRadioGroup
