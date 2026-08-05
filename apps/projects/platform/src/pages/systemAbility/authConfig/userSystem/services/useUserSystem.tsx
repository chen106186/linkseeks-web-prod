import { useLocation } from '@linkseeks/router-core'
import { history } from '@linkseeks/router-manager'
import { postMemberUserDelete, postMemberUserUpdatestatus } from '@apps/apis'
import { useTableRef } from '@apps/components'

const useUserSystem = () => {
  const { pathname } = useLocation()
  const ref = useTableRef()

  const addItem = () => {
    history.push(`${pathname}/add`)
  }

  const deleteItem = (record) => {
    // 删除该项
    postMemberUserDelete({
      userId: record.userId,
    }).then(() => {
      ref.current.reload()
    })
  }

  const updateItem = (record) => {
    history.push(`${pathname}/edit?id=${record.userId}&preview=0`)
  }

  const handleStatus = (record) => {
    postMemberUserUpdatestatus({
      userId: record.userId,
      status: record.status === 1 ? 0 : 1,
    }).then((res) => {
      ref.current.reload()
    })
  }

  return {
    ref,
    addItem,
    deleteItem,
    updateItem,
    handleStatus,
    pathname,
  }
}

export default useUserSystem
