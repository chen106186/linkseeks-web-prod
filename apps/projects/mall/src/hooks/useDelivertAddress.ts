/*
 * @Description: 省市数据hook
 */
import { useEffect, useState } from 'react'
import {
  getManageAreaByPcode,
  getManageAreaFindProvinceCity,
  getLogisticsMobileReceiverAddressListDefault,
} from '@apps/apis'
import {
  UseDelivertAddressDataRes,
  AreaDataItemType,
  CityItemType,
  CurrentActiveType,
  DistrictItemType,
  StreetItemType,
  UserInfoType,
  ReceiverAddressItemType,
} from '@/components/DeliveryAddress/types'

const useDelivertAddress = (userInfo: UserInfoType): UseDelivertAddressDataRes => {
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
    getLogisticsMobileReceiverAddressListDefault().then((res) => {
      if (res.code === 1000) {
        const list = sortDefaultAddress(res.data)
        setReceiverAddressList(list)
      }
    })
  }

  useEffect(() => {
    if (userInfo) {
      fetchAddressList()
    }
  }, [userInfo])

  const initAreaData = (list: AreaDataItemType[]): void => {
    if (!list || list.length === 0) return
    const directlyCity: AreaDataItemType[] = []
    const provinceList: AreaDataItemType[] = []

    list.forEach((provinceItem) => {
      if (provinceItem.cityList && provinceItem.cityList.length <= 2) {
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
