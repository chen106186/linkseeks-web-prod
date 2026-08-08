import { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import {
  getCommodityShopHelpInfoTree,
  getCommodityShopHelpInfoDetail,
  GetCommodityShopHelpInfoDetailResponse,
} from '@apps/apis'

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

interface MenuItemType {
  label: string
  key: string
  children?: MenuItemType[]
}

const useHelpInfo = (shopId: number | undefined) => {
  const { id } = useParams() as any;
  const [menulist, setMenulist] = useState<MenuItemType[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [helpInfoDetail, setHelpInfoDetail] = useState<GetCommodityShopHelpInfoDetailResponse>()
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const getHelpInfoContent = (id: string) => {
    if (id) {
      setSelectedKeys([id])
      getCommodityShopHelpInfoDetail({ id }).then((res) => {
        if (res.code && res.data) {
          if (res.data.level === 1) {
            setOpenKeys([id])
          }
          if (res.data.skipType === 1) {
            setHelpInfoDetail(res.data)
          } else if (res.data.skipType === 2 && res.data.skipUrl) {
            window.open(res.data.skipUrl);
          }
        }
      })
    }
  }

  const normalize = (list: any[]): MenuItemType[] => {
    if (list && list.length > 0) {
      return list.map((item) => {
        if (item.children && item.children.length > 0) {
          return {
            label: item.name,
            key: item.id,
            children: normalize(item.children)
          }
        }
        return {
          label: item.name,
          key: item.id,
        }
      })
    }
    return []
  }

  const getParentKey = (currentKey: string, data: any[]): string | null => {
    for (let i = 0; i < data.length; i++) {
      const menuItem = data[i];
      if (menuItem.children) {
        if (menuItem.children.some((child: any) => String(child.key) === String(currentKey))) {
          return String(menuItem.key);
        } else {
          const parentKey = getParentKey(currentKey, menuItem.children);
          if (parentKey) {
            return parentKey;
          }
        }
      }
    }
    return null;
  };

  const getHelpInfoTree = () => {
    if (shopId) {
      getCommodityShopHelpInfoTree({ shopId: String(shopId) }).then((res) => {
        if (res.code === 1000 && res.data) {
          const list = normalize(res.data)
          const parentKey = getParentKey(id, list)
          if (parentKey) {
            setOpenKeys([parentKey])
          }
          setMenulist(list)
        }
      })
    }
  }

  useEffect(() => {
    getHelpInfoTree()
  }, [])

  return {
    menulist,
    selectedKeys,
    helpInfoDetail,
    openKeys,
    getHelpInfoContent,
    setOpenKeys,
  }
}

export default useHelpInfo
