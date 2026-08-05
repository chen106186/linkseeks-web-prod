import { useEffect, useState } from 'react'
import {
  postManageMaterialLibraryAdd,
  PostManageMaterialLibraryAddRequest,
  postManageMaterialLibraryUpdateName,
} from '@apps/apis'
import { TreeContextProps } from '@apps/components'
import { ITreeDataItem } from '@apps/components/src/web/StandardTree/MenuUtil'
import { message } from '@linkseeks/ui'
import { produce } from '@apps/design-core'

const useMaterial = (treeRef: React.MutableRefObject<TreeContextProps>) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [saveLoading, setSaveLoading] = useState<boolean>(false)

  /**
   * 添加目录
   * @param name 菜单名称
   * @param parentId 父级节点id
   * @param level 层级
   * @param sort 排序
   * @returns
   */
  const addDirectory = (params: PostManageMaterialLibraryAddRequest) => {
    return new Promise((resolve, reject) => {
      setSaveLoading(true)
      postManageMaterialLibraryAdd(params)
        .then((res) => {
          if (res.code !== 1000) {
            message.destroy()
            message.error(res.message)
            reject()
          } else {
            resolve(true)
          }
        })
        .catch(() => {
          reject()
        })
        .finally(() => {
          setSaveLoading(false)
        })
    })
  }

  /**
   * 修改目录名称
   */
  const updateDirectory = (params) => {
    return new Promise((resolve, reject) => {
      setSaveLoading(true)
      postManageMaterialLibraryUpdateName(params)
        .then((res) => {
          if (res.code !== 1000) {
            message.destroy()
            message.error(res.message)
            reject()
          } else {
            resolve(true)
          }
        })
        .catch(() => {
          reject()
        })
        .finally(() => {
          setSaveLoading(false)
        })
    })
  }

  return {
    loading,
    saveLoading,
    updateDirectory,
    addDirectory,
  }
}

export default useMaterial
