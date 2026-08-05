/*
 * @Author: GHua
 * @Date: 2022-02-15 14:18:49
 * @LastEditTime: 2022-04-02 16:30:55
 * @LastEditors: GHua
 * @Description: 省市数据hook
 */
import { useEffect, useState } from 'react'
import { getManageAreaByPcode, getManageAreaFindProvinceCity } from '@apps/apis'
import {
  UseDelivertAddressDataRes,
  AreaDataItemType,
  CityItemType,
  CurrentActiveType,
  DistrictItemType,
  StreetItemType,
  ReceiverAddressItemType,
} from '../components/DeliveryAddress/types'
import { getLogisticsMobileReceiverAddressListDefault, getLogisticsReceiverAddressAgentPage } from '@apps/apis'

const useDelivertAddress = (userInfo?: { memberId: number; roleId: number }): UseDelivertAddressDataRes => {
  const [visible, setVisible] = useState<boolean>(false)
  const [currentActive, setCurrentActive] = useState<CurrentActiveType>('province')
  const [selectProvince, setSelectProvince] = useState<AreaDataItemType>()
  const [selectCity, setSelectCity] = useState<CityItemType>()
  const [selectDistrict, setSelectDistrict] = useState<DistrictItemType>()
  const [selectStreet, setSelectStreet] = useState<StreetItemType>()
  const [areaData, setAreaData] = useState<AreaDataItemType[]>([])
  const [cityList, setCityList] = useState<CityItemType[]>([])
  const [districtList, setDistrictList] = useState<DistrictItemType[]>([])
  const [streetList, setStreetList] = useState<StreetItemType[]>([])
  const [directlyCityList, setDirectlyCityList] = useState<AreaDataItemType[]>([])
  const [receiverAddressList, setReceiverAddressList] = useState<ReceiverAddressItemType[]>([])

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

  const fetchAddressList = () => {
    if (!userInfo.memberId || !userInfo.roleId) return
    const params: any = {
      memberId: userInfo.memberId,
      roleId: userInfo.roleId,
      current: 1,
      page: 30,
    }
    getLogisticsReceiverAddressAgentPage(params).then((res) => {
      if (res.code === 1000 && res.data?.data) {
        const list = sortDefaultAddress(res.data?.data)
        setReceiverAddressList(list)
      }
    })
  }

  useEffect(() => {
    fetchAddressList()
  }, [])

  const initAreaData = (list: AreaDataItemType[]): void => {
    if (!list || list.length === 0) return
    const directlyCity: AreaDataItemType[] = []
    const provinceList: AreaDataItemType[] = []

    list.forEach((provinceItem) => {
      if (provinceItem.cityList && provinceItem.cityList.length === 1) {
        directlyCity.push(provinceItem)
      } else {
        provinceList.push(provinceItem)
      }
    })
    setDirectlyCityList(directlyCity.sort((a, b) => (Number(b.provinceCode) > Number(a.provinceCode) ? -1 : 1)))
    setAreaData(provinceList.sort((a, b) => (Number(b.provinceCode) > Number(a.provinceCode) ? -1 : 1)))
  }

  const fetchAreaData = async () => {
    const res = await getManageAreaFindProvinceCity({}, { useCache: true })
    if (res.code === 1000 && res.data) {
      initAreaData(res.data as AreaDataItemType[])
    }
  }

  useEffect(() => {
    fetchAreaData()
  }, [])

  const dispatchCurrentActive = (active: CurrentActiveType) => {
    setCurrentActive(active)
  }

  const dispatchProvince = (provinceInfo: AreaDataItemType | undefined) => {
    if (provinceInfo) {
      setSelectProvince(provinceInfo)
      setCityList(provinceInfo.cityList)
      setCurrentActive('city')
    } else {
      setSelectProvince(undefined)
      setCityList([])
    }
  }

  const dispatchCity = async (cityInfo: CityItemType | undefined) => {
    if (cityInfo) {
      const res = await getManageAreaByPcode({ pcode: cityInfo.cityCode }, { useCache: true })
      if (res.code === 1000 && res.data && res.data.length > 0) {
        setDistrictList(
          res.data.map((item) => {
            return {
              districtCode: item.code,
              districtName: item.name,
            }
          }),
        )
      }
      setSelectCity(cityInfo)
      setCurrentActive('district')
    } else {
      setSelectCity(undefined)
      setSelectDistrict(undefined)
      setSelectStreet(undefined)
      setCurrentActive('province')
    }
  }

  const dispatchDistrict = async (dispatchInfo: DistrictItemType | undefined) => {
    if (dispatchInfo) {
      const res = await getManageAreaByPcode({ pcode: dispatchInfo.districtCode })
      if (res.code === 1000 && res.data && res.data.length > 0) {
        setStreetList(
          res.data.map((item) => {
            return {
              streetCode: item.code,
              streetName: item.name,
            }
          }),
        )
      }
      setSelectDistrict(dispatchInfo)
      setCurrentActive('street')
    } else {
      setSelectDistrict(undefined)
      setSelectStreet(undefined)
      setCurrentActive('city')
    }
  }

  const dispatchStreet = async (streetInfo: any) => {
    if (streetInfo) {
      setSelectStreet(streetInfo)
      setCurrentActive('street')
      setVisible(false)
    } else {
      setSelectStreet(undefined)
      setCurrentActive('district')
    }
  }

  const toggleVisible = () => {
    setVisible(!visible)
  }

  return {
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
  }
}

export default useDelivertAddress
