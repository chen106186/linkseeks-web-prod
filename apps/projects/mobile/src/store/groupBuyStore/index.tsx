import { action, makeObservable, observable } from 'mobx'
import { GroupBuyStoreModel } from './model'
import { RootStoreModel } from '../rootStore/model'
import { setStorageSync, getStorageSync } from '@apps/mobile-services/utils/taro'
export default class GroupBuyStore implements GroupBuyStoreModel {
  private rootStore: RootStoreModel

  pickupPointInfo: any = JSON.parse(getStorageSync('pickupPointInfo') || '{}')
  cartSelectedSkuIdsMap: any = {}

  constructor(rootStore: RootStoreModel) {
    makeObservable(this, {
      pickupPointInfo: observable,
      setPickupPointInfo: action.bound,

      cartSelectedSkuIdsMap: observable,
      getCartSelectedSkuIds: action.bound,
      setCartSelectedSkuIdsMap: action.bound,
    })
    this.rootStore = rootStore
  }

  setPickupPointInfo(data: {}) {
    this.pickupPointInfo = data
  }

  getCartSelectedSkuIds(activityId, teamLeaderId) {
    return this.cartSelectedSkuIdsMap[`${activityId}_${teamLeaderId}`] || []
  }

  setCartSelectedSkuIdsMap(activityId, teamLeaderId, skuIds) {
    this.cartSelectedSkuIdsMap = Object.assign({}, this.cartSelectedSkuIdsMap, {
      [`${activityId}_${teamLeaderId}`]: skuIds,
    })
  }
}
