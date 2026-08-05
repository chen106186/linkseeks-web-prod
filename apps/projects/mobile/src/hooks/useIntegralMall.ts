import { useEffect, useState } from 'react'
import { ENVIRONMENT } from '@/constants'
import { MallInfoType } from '@/store/userStore/model'
import useStores from '@/store/useStores'

interface InfoProps {
  // 企业积分商城id
  pointMallId: number | undefined
  // 渠道积分商城id
  channelPointMallId: number | undefined
  // 企业积分商城信息
  pointMallInfo: MallInfoType
  // 渠道积分商城信息
  channelPointMallInfo: MallInfoType
}

const useIntegralMall = () => {
  const {
    userStore: { allMallList },
  } = useStores()

  const [pointMallInfo, setPointMallInfo] = useState<MallInfoType>()
  const [channelPointMallInfo, setChannelPointMallInfo] = useState<MallInfoType>()

  useEffect(() => {
    const shopList = allMallList || []
    const pointMallInfo = shopList.filter((item) => item.environment === Number(ENVIRONMENT) && item.type === 2)[0] // app积分商城
    const channelPointMallInfo = shopList.filter(
      (item) => item.environment === Number(ENVIRONMENT) && item.type === 5,
    )[0] // app渠道积分商城
    setPointMallInfo(pointMallInfo)
    setChannelPointMallInfo(channelPointMallInfo)
  }, [allMallList])

  return {
    pointMallId: pointMallInfo?.id,
    channelPointMallId: channelPointMallInfo?.id,
    pointMallInfo,
    channelPointMallInfo,
  }
}

export default useIntegralMall
