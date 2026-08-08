/**
 * @Description 判断地址是否可配送 hook
 */
import useStores from '@/store/useStores'

export type DeliverAreaItem = {
  /**
   * 是否不限制城市
   */
  isAllCity: boolean
  isAllRegion: boolean
  provinceCode: string
  provinceName: string
  cityCode?: string
  cityName?: string
  regionCode?: string
  regionName?: string
  districtCode?: string
  districtName?: string
}

export type DeliverCurrent = {
  provinceCode: string
  cityCode: string
  districtCode: string
  streetCode: string
}

const useDeliverable = () => {
  const {
    locationStore: { currentCity },
  } = useStores()

  /**
   * 判断地址是否可配送
   * @param unlimited 不限制区域
   * @param areas 区域列表
   * @param limitWay 限制模式 1：配送区域 2：不配送区域
   * @returns boolean
   */
  const isDeliverable = (
    unlimited: boolean,
    areas: DeliverAreaItem[],
    limitWay: number = 1,
    current?: DeliverCurrent,
  ): boolean => {
    const location = current || currentCity
    if (!location || !location.provinceCode || !location.cityCode) {
      return false
    }
    if (unlimited) {
      return true
    }
    // 这里走 true
    if (!areas || !areas.length) {
      return true
    }

    if (
      areas.some(
        (item) =>
          item.provinceCode === location.provinceCode &&
          (item.isAllCity === false ? item.cityCode === location.cityCode : true) &&
          (item.isAllRegion === false ? item.regionCode === location.districtCode : true),
      )
    ) {
      return limitWay === 1 ? true : false
    } else {
      return limitWay === 1 ? false : true
    }
  }

  return {
    isDeliverable,
  }
}

export default useDeliverable
