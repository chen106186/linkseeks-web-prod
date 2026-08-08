import { useEffect, useState } from 'react'
import { getCommodityShopHelpInfoHelpInfoEnable, getCommodityShopHelpInfoTree } from '@apps/apis'

export interface HelpType {
  /**
   * 主键ID
   */
  id?: number
  /**
   * 父id
   */
  parentId?: number
  /**
   * 商城id
   */
  shopId?: number
  /**
   * 排序
   */
  sort?: number
  /**
   * 层级<br/>
   * 默认一级
   */
  level?: number
  /**
   * 标题
   */
  name: string
  /**
   * 跳转类型 1-站内，2-站外
   */
  skipType?: number
  /**
   * 跳转路径
   */
  skipUrl?: string
  children: HelpType[]
}

const useHelpInfo = (shopId: number | undefined) => {
  const [helpInfoEnable, setHelpInfoEnable] = useState<boolean>(false)
  const [footerNavList, setFooterNavList] = useState<HelpType[]>([])

  const getHelpInfoTree = () => {
    getCommodityShopHelpInfoTree({ shopId: String(shopId) }).then((res) => {
      if (res.code === 1000 && res.data) {
        setFooterNavList(res.data as unknown as HelpType[])
      }
    })
  }

  const getHelpInfoEnable = () => {
    if (shopId) {
      getCommodityShopHelpInfoHelpInfoEnable({ shopId: String(shopId) }).then((res) => {
        if (res.code === 1000) {
          setHelpInfoEnable(Boolean(res.data))
          if (Boolean(res.data)) {
            getHelpInfoTree()
          }
        }
      })
    }
  }

  useEffect(() => {
    getHelpInfoEnable()
  }, [])

  return {
    helpInfoEnable,
    footerNavList,
  }
}

export default useHelpInfo
