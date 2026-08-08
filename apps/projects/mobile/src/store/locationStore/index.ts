/*
 * @Author: GHua
 * @Date: 2022-02-28 14:25:22
 * @LastEditTime: 2022-03-17 19:41:25
 * @LastEditors: GHua
 * @Description:
 */
import { makeObservable, observable, action, runInAction } from 'mobx'
import { getManageAreaFindCityByIp, getManageMobileAreaFindByLocation } from '@apps/apis'
import { getLocation } from '@apps/mobile-services/utils/taro'
import { IS_WEB } from '@/constants'
import { CURRENT_CITY } from '@/constants/storage'
import { getAsyncStorage, setAsyncStorage, removeAsyncStorage } from '@apps/mobile-services/utils/storage'
import { RootStoreModel } from '../rootStore/model'
import { CurrentCityType, LocationStoreModel } from './model'

// 默认北京的省市数据
const defaultCity = {
  provinceCode: '110000',
  provinceName: '北京',
  cityCode: '110100',
  cityName: '北京市',
}

// 获取经纬度
const getLongitudeAndLatitude = (): Promise<{ longitude: number; latitude: number }> =>
  new Promise((resolve, reject) => {
    if (IS_WEB) {
      if (navigator.geolocation) {
        //如果getCurrentPosition()运行成功， //则向参数showPosition中规定的函数返回一个coordinates对象
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude })
          },
          () => {
            reject()
          },
        )
      }
      return
    }
    getLocation({
      type: 'wgs84',
      success: (result: Taro.getLocation.SuccessCallbackResult) => {
        const { latitude, longitude } = result
        resolve({ latitude, longitude })
      },
      fail: () => {
        reject()
      },
    })
  })

export default class LocationStore implements LocationStoreModel {
  private rootStore: RootStoreModel

  currentCity: CurrentCityType | undefined = undefined

  constructor(rootStore: RootStoreModel) {
    makeObservable(this, {
      currentCity: observable,
      updateCurrentCity: action.bound,
      getCurrentCity: action.bound,
    })
    this.rootStore = rootStore
    this.getStorageData()
  }

  /** 获取缓存中选择的城市信息 */
  async getStorageData() {
    const catchCurrentCity = await getAsyncStorage(CURRENT_CITY)
    if (catchCurrentCity) {
      runInAction(() => {
        this.currentCity = catchCurrentCity
      })
    }
  }

  updateCurrentCity(cityInfo: CurrentCityType) {
    this.currentCity = cityInfo
    setAsyncStorage(CURRENT_CITY, JSON.stringify(this.currentCity))
  }

  // MOBX 异步需要用runInAction 包裹着 https://cn.mobx.js.org/best/actions.html
  async getCurrentCity() {
    try {
      const catchCurrentCity = await getAsyncStorage(CURRENT_CITY)
      if (catchCurrentCity) {
        runInAction(() => {
          this.currentCity = catchCurrentCity
        })
        return
      }
      if (IS_WEB) {
        getManageAreaFindCityByIp().then((res) => {
          if (res.code === 1000 && res.data) {
            runInAction(() => {
              this.currentCity = {
                provinceCode: res.data.provinceCode,
                provinceName: res.data.province,
                cityCode: res.data.cityCode,
                cityName: res.data.cityName,
              }
              this.updateCurrentCity(this.currentCity)
            })
          } else {
            runInAction(() => {
              this.currentCity = defaultCity
              this.updateCurrentCity(this.currentCity)
            })
          }
        })
      } else {
        const latAndLng = await getLongitudeAndLatitude()
        const res = await getManageMobileAreaFindByLocation({
          location: `${latAndLng.longitude},${latAndLng.latitude}`,
        })
        if (res.code === 1000 && res.data && res.data.provinceCode) {
          const { data } = res
          runInAction(() => {
            this.currentCity = {
              provinceCode: data.provinceCode,
              provinceName: data.province,
              cityCode: data.cityCode,
              cityName: data.cityName,
            }
            this.updateCurrentCity(this.currentCity)
          })
        } else {
          runInAction(() => {
            this.currentCity = defaultCity
            this.updateCurrentCity(this.currentCity)
          })
        }
      }
    } catch (error) {
      runInAction(() => {
        this.currentCity = defaultCity
        this.updateCurrentCity(this.currentCity)
      })
    }
  }

  clearStorageCurrentCity() {
    removeAsyncStorage(CURRENT_CITY)
    this.currentCity = undefined
  }
}
