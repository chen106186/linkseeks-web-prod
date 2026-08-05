import React, { useState, useEffect } from 'react'
import { LAYOUT_TYPE, SHOP_TYPE } from '@/constants'
import { GlobalConfig } from "@/global/config"

const useStoreId = (layoutType: LAYOUT_TYPE) => {
  const [storeId, setStoreId] = useState<number>()

  const getStoreIdByLayoutType = (newLayoutType?: LAYOUT_TYPE) => {
    const type = newLayoutType ? newLayoutType : layoutType

    switch(type) {
      case LAYOUT_TYPE.mall:
        setStoreId(getStoreId(SHOP_TYPE.mall))
        break
      case LAYOUT_TYPE.channel:
        setStoreId(getStoreId(SHOP_TYPE.channel))
        break
      case LAYOUT_TYPE.ichannel:
        setStoreId(getStoreId(SHOP_TYPE.ichannel))
        break
      case LAYOUT_TYPE.channelScoreMall:
        setStoreId(getStoreId(SHOP_TYPE.channelScoreMall))
        break
      case LAYOUT_TYPE.scoreMall:
        setStoreId(getStoreId(SHOP_TYPE.scoreMall))
        break
    }
  }

  useEffect(() => {
   getStoreIdByLayoutType()
  }, [layoutType])

  const uploadStoreId = (newLayoutType: LAYOUT_TYPE) => {
    getStoreIdByLayoutType(newLayoutType)
  }

  const getStoreId = (mallType: number) => {
    const shopList = GlobalConfig.web.shopInfo
    const shopInfo:any = shopList.filter(item => item.environment === 1 && item.type === mallType)[0] || {}
    return shopInfo.id
  }

  return {
    storeId,
    uploadStoreId
  }
}

export default useStoreId
