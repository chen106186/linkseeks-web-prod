import { useEffect, useState } from 'react'
import { getCommodityShopAbilitySelfShopList } from '@apps/apis'
import { MallItemType } from '../types'

interface MallReturn {
  loading: boolean
  mallList: MallItemType[]
  refresh: () => void
  getDefaultMall: (mallItem: MallItemType) => MallItemType | undefined
}

interface MallProps {
  environment: string
}

const useMallList = ({ environment }: MallProps): MallReturn => {
  const [mallList, setMallList] = useState<MallItemType[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const fetchMallList = () => {
    setLoading(true)
    getCommodityShopAbilitySelfShopList({
      environment: environment !== '0' ? environment : undefined,
    } as any)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setMallList(res.data)
        } else {
          setMallList([])
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchMallList()
  }, [environment])

  const refresh = () => {
    fetchMallList()
  }

  /**
   * 判断相同环境是否已有默认的商城
   */
  const getDefaultMall = (mallItem: MallItemType): MallItemType | undefined => {
    const filterList = mallList.filter((item) => item.environment === mallItem.environment)
    return filterList.find((filterItem) => filterItem.isDefault)
  }

  return {
    loading,
    mallList,
    getDefaultMall,
    refresh,
  }
}

export default useMallList
