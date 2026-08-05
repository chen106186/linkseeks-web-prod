import {
  getLogisticsReceiverAddressGet,
  getLogisticsSelectListReceiverAddress,
  getLogisticsSelectListShipperAddress,
  getLogisticsShipperAddressGet,
  postLogisticsReceiverAddressAdd,
  postLogisticsReceiverAddressDelete,
  postLogisticsReceiverAddressUpdate,
  postLogisticsShipperAddressAdd,
  postLogisticsShipperAddressDelete,
  postLogisticsShipperAddressUpdate,
} from '@apps/apis'
import { ADDRESS_TYPE } from './AddressBaseForm'
import { ActionRef } from './useAddressManage'
import { useRequestApi, useToggle } from '@linkseeks/hooks'

export interface handleAddressOptions {
  actionRef: ActionRef
}
/**
 * 地址相关操作
 * 包含收货/发货，地址的增删改查，已经做好字段转换才能放入
 * 这里只做接口调用
 */
export const useHandleAddress = (options: handleAddressOptions) => {
  const { actionRef } = options
  const [loading, setLoading] = useToggle(false)
  /**
   * 发起提交
   */
  const handleSubmit = async () => {
    const target = await actionRef.formInstance.validateFields()
    if (target.countryCode !== 'CN') {
      // 如果是非中国地区的，将不会往接口提交参数
      delete target.provinceCode
      delete target.provinceName
      delete target.districtCode
      delete target.districtName
      delete target.cityCode
      delete target.cityName
      delete target.streetCode
      delete target.streetName
    }
    return target
  }
  /**
   * 发起新增
   */
  const handleAdd = async () => {
    const target = await handleSubmit()
    setLoading(true)
    try {
      if (actionRef.type === ADDRESS_TYPE.DELIVERY) {
        await postLogisticsShipperAddressAdd(target)
      }
      if (actionRef.type === ADDRESS_TYPE.RECEIVING) {
        await postLogisticsReceiverAddressAdd(target)
      }
    } catch (err) {
      console.log(err)
    }
    setLoading(false)
  }

  const handleEdit = async () => {
    const target = await handleSubmit()
    setLoading(true)
    try {
      if (actionRef.type === ADDRESS_TYPE.DELIVERY) {
        await postLogisticsShipperAddressUpdate(target)
      }
      if (actionRef.type === ADDRESS_TYPE.RECEIVING) {
        await postLogisticsReceiverAddressUpdate(target)
      }
    } catch (err) {
      console.log(err)
    }
    setLoading(false)
  }

  const handleDelete = async ({ id }) => {
    setLoading(true)
    try {
      if (actionRef.type === ADDRESS_TYPE.DELIVERY) {
        await postLogisticsShipperAddressDelete({ id })
      }
      if (actionRef.type === ADDRESS_TYPE.RECEIVING) {
        await postLogisticsReceiverAddressDelete({ id })
      }
    } catch (err) {
      console.log(err)
    }
    setLoading(false)
  }

  const getAddressDetail = async ({ id }) => {
    setLoading(true)
    try {
      if (actionRef.type === ADDRESS_TYPE.DELIVERY) {
        const { data } = await getLogisticsShipperAddressGet({ id })
        return data
      }
      if (actionRef.type === ADDRESS_TYPE.RECEIVING) {
        const { data } = await getLogisticsReceiverAddressGet({ id })
        return data
      }
    } catch (err) {
      console.log(err)
    }
    setLoading(false)
    return null
  }

  const getAddressList = async () => {
    setLoading(true)
    try {
      if (actionRef.type === ADDRESS_TYPE.DELIVERY) {
        const { data } = await getLogisticsSelectListShipperAddress()
        return data
      }
      if (actionRef.type === ADDRESS_TYPE.RECEIVING) {
        const { data } = await getLogisticsSelectListReceiverAddress()
        return data
      }
    } catch (err) {
      console.log(err)
    }
    setLoading(false)
    return null
  }

  return {
    loading,
    handleAdd,
    handleEdit,
    handleDelete,
    getAddressDetail,
    getAddressList,
  }
}
