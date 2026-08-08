import { useEffect, useState } from 'react'
import {
  getCommoditySelfShopModelAllocatedSelfShopModelIdList,
  getCommoditySelfShopModelSelfShopModelList,
} from '@apps/apis'
import { SelfMallItemType } from '../types'

interface MallReturn {
  loading: boolean
  mallList: SelfMallItemType[]
  allocatedIdList: number[]
  refresh: () => void
  getAllocatedIdList: (memberId: number, memberRoleId: number) => Promise<number[]>
}

interface MallProps {
  environment: string
}

const useSelfMallList = ({ environment }: MallProps): MallReturn => {
  const [mallList, setMallList] = useState<SelfMallItemType[]>([])
  const [allocatedIdList, setAllocatedIdList] = useState<number[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const fetchMallList = async () => {
    setLoading(true)
    const res = await getCommoditySelfShopModelSelfShopModelList({
      environment: environment !== '0' ? environment : undefined,
    } as any)
    if (res.data && res.data.length > 0) {
      setMallList(res.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchMallList()
  }, [environment])

  const refresh = () => {
    fetchMallList()
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
    getAllocatedIdList,
    refresh,
  }
}

export default useSelfMallList
