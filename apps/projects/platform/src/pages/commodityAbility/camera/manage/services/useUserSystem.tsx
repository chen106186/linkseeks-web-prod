import { useLocation } from '@linkseeks/router-core'
import { history } from '@linkseeks/router-manager'
import { postCommodityWebCameraDelete } from '@apps/apis'
import { useTableRef } from '@apps/components'

const useUserSystem = () => {
  const { pathname } = useLocation()
  const ref = useTableRef()

  const addItem = () => {
    history.push(`${pathname}/add`)
  }

  const deleteItem = (record) => {
    // 删除该项
    postCommodityWebCameraDelete({
      id: record.id,
    }).then(() => {
      ref.current.reload()
    })
  }

  const updateItem = (record) => {
    history.push(
      `${pathname}/edit?id=${record.id}&preview=0&name=${encodeURIComponent(record.name)}&deviceSerial=${
        record.deviceSerial
      }&channelNo=${record.channelNo}&appKey=${encodeURIComponent(record.appKey)}&appSecret=${encodeURIComponent(
        record.appSecret,
      )}&apiBase=${encodeURIComponent(record.apiBase || '')}&tokenUrl=${encodeURIComponent(
        record.tokenUrl || '',
      )}&remark=${encodeURIComponent(record.remark || '')}&preview=0`,
    )
  }

  return {
    ref,
    addItem,
    deleteItem,
    updateItem,
    pathname,
  }
}

export default useUserSystem
