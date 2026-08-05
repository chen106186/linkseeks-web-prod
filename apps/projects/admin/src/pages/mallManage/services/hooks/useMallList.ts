import { useEffect, useState } from 'react'
import { getCommodityShopShopList, getCommoditySelfShopModelAllocatedSelfShopModelIdList } from '@apps/apis'
import { SHOP_TYPE_ENUM } from '@apps/constants'
import { MallItemType } from '../types'

interface MallReturn {
  loading: boolean
  mallList: MallItemType[]
  allocatedIdList: number[]
  refresh: () => void
  getAllocatedIdList: (memberId: number, memberRoleId: number) => Promise<number[]>
  getDefaultMall: (mallItem: MallItemType) => MallItemType | undefined
}

interface MallProps {
  environment: string
}

const useMallList = ({ environment }: MallProps): MallReturn => {
  const [mallList, setMallList] = useState<MallItemType[]>([])
  const [allocatedIdList, setAllocatedIdList] = useState<number[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const fetchMallList = async () => {
    setLoading(true)
    getCommodityShopShopList({
      current: '1',
      pageSize: '100', // 页面不需要分页，但是接口是分页的
      isSelf: 'false',
      type: `${SHOP_TYPE_ENUM.ENTERPRISE}`,
      environment: environment !== '0' ? environment : undefined,
    })
      .then((res) => {
        if (res.data && res.data.data.length > 0) {
          setMallList(res.data.data as unknown as MallItemType[])
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

  /**
   * 获取会员已分配自营商城id列表
   */
  const getAllocatedIdList = (memberId: number, memberRoleId: number): Promise<number[]> => {
    return new Promise((resolve) => {
      getCommoditySelfShopModelAllocatedSelfShopModelIdList({
        memberId: String(memberId),
        memberRoleId: String(memberRoleId),
      })
        .then((res) => {
          if (res.code === 1000 && res.data) {
            setAllocatedIdList(res.data.selfShopModelIdList)
            resolve(res.data.selfShopModelIdList)
          } else {
            resolve([])
          }
        })
        .catch(() => {
          resolve([])
        })
    })
  }

  return {
    loading,
    mallList,
    allocatedIdList,
    getDefaultMall,
    getAllocatedIdList,
    refresh,
  }
}

export default useMallList
