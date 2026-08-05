import { ReactNode } from 'react'

export type userInfoType = {
  account?: string
  memberName?: string
  countryCode?: string
  idCardNo?: string
  logo?: string
  email?: string
  memberId?: number
  memberRoleId?: number
  memberRoleName?: string
  userName: string
  orgName?: string
  phone?: string
  token?: string
  tokenExpireMinutes?: number
  urls?: string[]
  userId: number
  memberType?: number
  jobTitle?: string
  roles: {
    roleId: number
    roleName: string
  }[]
}

export type AddressItem = {
  fullAddress: string
  id: number
  isDefault: number
  phone: string
  tel: string
  receiverName: string
  postalCode: string
}

export interface UserStoreModel {
  username: string
  setUserName: (name: string) => void
  userInfo: null | userInfoType
  removeUserInfo: () => void
  getRoleName: () => ReactNode
  setUserInfo: (data: any) => void
  refreshUserInfo: () => void
  setAddressItem: (data: any) => void
}
