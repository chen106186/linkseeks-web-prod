import { useEffect, useState } from 'react'
import {
  getCommodityShopAbilitySelfShopList,
  postCommodityShopHelpInfoSave,
  postCommodityShopHelpInfoUpdate,
  getCommodityShopHelpInfoHelpInfoEnable,
  postCommodityShopHelpInfoHelpInfoEnable,
  PostCommodityShopHelpInfoUpdateRequest,
  PostCommodityShopHelpInfoSaveRequest,
} from '@apps/apis'
import { TreeContextProps } from '@apps/components'
import { ITreeDataItem } from '@apps/components/src/web/StandardTree/MenuUtil'
import { message } from '@linkseeks/ui'
import { produce } from '@apps/design-core'

const useHelpful = (treeRef: React.MutableRefObject<TreeContextProps>) => {
  const [mallList, setMallList] = useState<{ label: string; key: string }[]>([])
  const [activeKey, setActiveKey] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false)
  const [saveLoading, setSaveLoading] = useState<boolean>(false)
  const [switchLoading, setSwitchLoading] = useState<boolean>(false)
  const [helpInfoEnable, setHelpInfoEnable] = useState<boolean>(false)

  useEffect(() => {
    if (activeKey) {
      /** 查询是否开启商城帮助信息 */
      const getHelpInfoEnable = () => {
        getCommodityShopHelpInfoHelpInfoEnable({ shopId: activeKey }).then((res) => {
          if (res.code === 1000) {
            setHelpInfoEnable(Boolean(res.data))
          }
        })
      }
      getHelpInfoEnable()

      if (treeRef.current.refreshTreeData) {
        treeRef.current.refreshTreeData()
      }
    }
  }, [activeKey])

  /**
   * 开启/关闭商城帮助信息
   */
  const enableHelpInfo = () => {
    if (activeKey) {
      setSwitchLoading(true)
      postCommodityShopHelpInfoHelpInfoEnable({
        shopId: Number(activeKey),
        helpInfoEnable: !helpInfoEnable,
      })
        .then((res) => {
          if (res.code === 1000) {
            setHelpInfoEnable(!helpInfoEnable)
          }
        })
        .finally(() => {
          setSwitchLoading(false)
        })
    }
  }

  const fetchMallList = () => {
    setLoading(true)
    getCommodityShopAbilitySelfShopList()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const list = res.data.map((item) => ({
            label: item.name,
            key: String(item.id),
          }))
          setMallList(list)
          setActiveKey(list[0]?.key)
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchMallList()
  }, [])

  const updateMenu = (params: PostCommodityShopHelpInfoUpdateRequest) => {
    return new Promise((resolve, reject) => {
      setSaveLoading(true)
      postCommodityShopHelpInfoUpdate(params)
        .then((res) => {
          if (res.code !== 1000) {
            message.destroy()
            message.error(res.message)
            reject()
          } else {
            resolve(true)
          }
        })
        .catch((err) => {
          reject()
        })
        .finally(() => {
          setSaveLoading(false)
        })
    })
  }

  /**
   * 添加菜单
   * @param name 菜单名称
   * @param parentId 父级节点id
   * @param level 层级
   * @param sort 排序
   * @returns
   */
  const addMenu = (params: PostCommodityShopHelpInfoSaveRequest, list: ITreeDataItem[]) => {
    return new Promise((resolve, reject) => {
      let sort = 1
      if (list && list.length > 0) {
        const sortList = produce(list, (oldList) => {
          return oldList.sort((a, b) => (b.sort > a.sort ? -1 : 1))
        })
        sort = sortList[sortList.length - 1].sort + 1
      }
      const param: PostCommodityShopHelpInfoSaveRequest = {
        ...params,
        sort,
        shopId: activeKey as any,
      }
      setSaveLoading(true)
      postCommodityShopHelpInfoSave(param)
        .then((res) => {
          if (res.code !== 1000) {
            message.destroy()
            message.error(res.message)
            reject()
          } else {
            resolve(true)
          }
        })
        .catch((err) => {
          reject()
        })
        .finally(() => {
          setSaveLoading(false)
        })
    })
  }

  return {
    activeKey,
    loading,
    saveLoading,
    switchLoading,
    mallList,
    helpInfoEnable,
    setActiveKey,
    addMenu,
    updateMenu,
    enableHelpInfo,
  }
}

export default useHelpful
