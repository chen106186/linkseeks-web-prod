import { FormInstance, message } from 'antd'
import { DISPATCH_PWD_TYPE, ResetPasswordClass } from './ResetPasswordClass'
import { useState, useRef } from 'react'
import { useToggle } from '@linkseeks/hooks'
import { history } from '@linkseeks/router-manager'
import { useWebIntl } from '@apps/locales'

export const useForgetPwd = (form: FormInstance) => {
  const [multiAccInfoRespList, setMultiAccInfoRespList] = useState<any[]>([])
  const [multiAccountVisible, toggleMultiAccountVisible] = useToggle(false)
  const [activeUserId, setActiveUserId] = useState<any[]>([])
  const dataRef = useRef<any>({})
  const translate = useWebIntl()
  const handleSubmitCheck = async (type: DISPATCH_PWD_TYPE) => {
    const values = await form.validateFields()

    const resetPwdInstance = new ResetPasswordClass(values, type)

    const transformValues = resetPwdInstance.encryptedParams(values)

    const { data, code, message: msg } = await resetPwdInstance.dispatchCheck(transformValues)

    if (code === 1000) {
      dataRef.current = {
        type,
        ...values,
      }
      if (data?.length > 1) {
        toggleMultiAccountVisible(true)
        setMultiAccInfoRespList(data)
      } else {
        toggleMultiAccountVisible(false)
        handleSubmit()
      }
    } else {
      message.error(msg)
    }
  }

  const handleSubmit = async () => {
    const { type, ...values } = dataRef.current
    const resetPwdInstance = new ResetPasswordClass(values, type)

    const transformValues = resetPwdInstance.encryptedParams(values)

    const {
      data,
      code,
      message: msg,
    } = await resetPwdInstance.submitResetPwd({ ...transformValues, userIdList: activeUserId }, type)

    if (code === 1000) {
      message.success(translate('public.xiugaichenggong'))
      history.redirect('/user/login')
    } else {
      message.error(msg)
    }
  }

  return {
    multiAccInfoRespList,
    multiAccountVisible,
    toggleMultiAccountVisible,
    handleSubmitCheck,
    activeUserId,
    setActiveUserId,
    handleSubmit,
  }
}
