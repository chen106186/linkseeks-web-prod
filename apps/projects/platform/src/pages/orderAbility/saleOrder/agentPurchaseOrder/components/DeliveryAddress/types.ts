/*
 * @Author: GHua
 * @Date: 2022-02-15 16:06:03
 * @LastEditTime: 2022-02-21 18:48:37
 * @LastEditors: GHua
 * @Description:
 */
export interface CityItemType {
  cityCode: string
  cityName: string
}

export interface DistrictItemType {
  districtCode: string
  districtName: string
}

export interface StreetItemType {
  streetCode: string
  streetName: string
}

export interface SelectAreaItemType {
  provinceCode: string
  provinceName: string
  cityList?: CityItemType[]
  cityCode: string
  cityName: string
  districtCode?: string
  districtName?: string
  streetCode?: string
  streetName?: string
  addressId?: number
}

export type CurrentActiveType = 'province' | 'city' | 'district' | 'street' | 'address'

export interface AreaDataItemType {
  provinceCode: string
  provinceName: string
  cityList: CityItemType[]
}

export interface SearchOption {
  label: string
  value: string
}

export type UserInfoType =
  | {
      userId: number
      memberId: number
      token: string
      name: string
      logo: string
      level: number
      levelTag: string
      creditPoint: number
      memberRoleType: number
      memberRoleId: number
    }
  | undefined

export interface ReceiverAddressItemType {
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
   * 街道编号
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

export interface UseDelivertAddressDataRes {
  visible: boolean
  currentActive: CurrentActiveType
  selectProvince: AreaDataItemType | undefined
  selectCity: CityItemType | undefined
  selectDistrict: DistrictItemType | undefined
  selectStreet: StreetItemType | undefined
  areaData: AreaDataItemType[]
  directlyCityList: AreaDataItemType[]
  cityList: CityItemType[]
  districtList: DistrictItemType[]
  streetList: StreetItemType[]
  receiverAddressList: ReceiverAddressItemType[]
  dispatchCurrentActive: (active: CurrentActiveType) => void
  dispatchProvince: (info: AreaDataItemType | undefined) => void
  dispatchCity: (info: CityItemType | undefined) => void
  dispatchDistrict: (info: DistrictItemType | undefined) => void
  dispatchStreet: (info: StreetItemType | undefined) => void
  toggleVisible: () => void
}
