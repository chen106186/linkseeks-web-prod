import { useState } from 'react'
import { useRoleAuthTreeContext } from '../contexts'
import { history } from '@linkseeks/router-manager'
import { useRequestApi, useToggle } from '@linkseeks/hooks'
import { postMemberRoleAdd, postMemberRoleUpdate } from '@apps/apis'
import { splitButtonMenu } from '@apps/services/menuTree'
import { PageStatus, usePageStatus } from '@/hooks/usePageStatus'

const useRoleSubmit = () => {
  const [errors, setErrors] = useState<boolean>(false)
  const { pageStatus, id } = usePageStatus()
  const { runAsync: runAdd } = useRequestApi(postMemberRoleAdd, { manual: true })
  const { runAsync: runUpdate } = useRequestApi(postMemberRoleUpdate, { manual: true })
  const [loading, toggle] = useToggle(false)
  const { menuActions, idRef, menuDataRef } = useRoleAuthTreeContext()

  const handleSubmit = () => {
    menuActions
      .submit()
      .then(async ({ values }) => {
        toggle(true)
        await (pageStatus === PageStatus.EDIT
          ? runUpdate({
              roleId: id,
              roleName: values.roleName,
              remark: values.remark,
              imFlag: values.imFlag,
              ...splitButtonMenu(idRef.current, menuDataRef.current),
            })
          : runAdd({
              roleName: values.roleName,
              remark: values.remark,
              imFlag: values.imFlag,
              ...splitButtonMenu(idRef.current, menuDataRef.current),
            }))
        toggle(false)
        history.goBack(-1)
      })
      .catch((err) => {
        console.log(err)
        if (Array.isArray(err)) {
          setErrors(true)
        }
      })
  }

  return {
    handleSubmit,
    errors,
    loading,
  }
}

export default useRoleSubmit
