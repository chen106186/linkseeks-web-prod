import { removeStorageSync, getStorageSync, setStorageSync } from '@apps/mobile-services/utils/taro'

const listRefreshKey = '__listRefresh__'

const detailsRefreshKey = '__detailsRefresh__'

const actionsRefreshKey = '__actionsRefresh__'

const depositsRefreshKey = '__depositsRefresh__'

const depositDetailsKey = '__depositDetails__'

const classifyPartnerTypesKey = '__classifyPartnerTypes__'

const modifiesRefreshKey = '__modifiesRefresh__'

export type ListRefreshType = {
  listKey: string
  refresh: boolean
}

export function setListRefreshStorage(listKey: string, refresh: boolean) {
  setStorageSync(listRefreshKey, {
    listKey,
    refresh,
  })
}

export function getListRefreshStorage(): ListRefreshType {
  const cache = getStorageSync(listRefreshKey)
  removeStorageSync(listRefreshKey)
  return cache
}

export function setDetailsRefreshStorage(refresh: boolean) {
  setStorageSync(detailsRefreshKey, refresh)
}

export function getDetailsRefreshStorage(): ListRefreshType {
  const cache = getStorageSync(detailsRefreshKey)
  removeStorageSync(detailsRefreshKey)
  return cache
}

export function setActionsRefreshStorage(refresh: boolean) {
  setStorageSync(actionsRefreshKey, refresh)
}

export function getActionsRefreshStorage(): ListRefreshType {
  const cache = getStorageSync(actionsRefreshKey)
  removeStorageSync(actionsRefreshKey)
  return cache
}

export function setDepositsRefreshStorage(refresh: boolean) {
  setStorageSync(depositsRefreshKey, refresh)
}

export function getDepositsRefreshStorage(): ListRefreshType {
  const cache = getStorageSync(depositsRefreshKey)
  removeStorageSync(depositsRefreshKey)
  return cache
}

export function setDepositDetailsStorage(data: any) {
  setStorageSync(depositDetailsKey, data)
}

export function getDepositDetailsStorage(): any {
  const cache = getStorageSync(depositDetailsKey)
  return cache
}

export function removeDepositDetailsStorage() {
  removeStorageSync(depositDetailsKey)
}

export function setDepositClassifyPartnerTypesStorage(data: any) {
  setStorageSync(classifyPartnerTypesKey, data)
}

export function getDepositClassifyPartnerTypesStorage(): any {
  const cache = getStorageSync(classifyPartnerTypesKey)
  return cache
}

export function removeDepositClassifyPartnerTypesStorage() {
  removeStorageSync(classifyPartnerTypesKey)
}

export function setModifiesRefreshStorage(refresh: boolean) {
  setStorageSync(modifiesRefreshKey, refresh)
}

export function getModifiesRefreshStorage(): ListRefreshType {
  const cache = getStorageSync(modifiesRefreshKey)
  removeStorageSync(modifiesRefreshKey)
  return cache
}
