import type { GetMemberMenuRegisterDetailResponse } from '@apps/apis'
import { getMemberMenuRegisterDetail } from '@apps/apis'
import { useState, useEffect } from 'react'
import { FormInstance } from 'antd'
import { FILE_TYPE_ENUM } from './useFileType'

interface IProps {
  form: FormInstance<any>
  show: boolean
  onNextAction: Function
  updateListKeys: (keys: string[]) => void
}

/**
 * 获取注册资料
 */
const useRegisterDetail = ({ form, show, onNextAction, updateListKeys }: IProps) => {
  const [registerInfo, setRegisterInfo] = useState<GetMemberMenuRegisterDetailResponse>([])

  const getRegisterDetail = async () => {
    const res = await getMemberMenuRegisterDetail({
      roleId: form.getFieldValue('memberRoleId'),
    })
    if (res.code === 1000 && res.data && res.data.length > 0) {
      const listKeys: string[] = []
      res.data.forEach((item) => {
        for (const element of item.elements) {
          if (element.fieldType === FILE_TYPE_ENUM.list && element.fieldName) {
            listKeys.push(element.fieldName)
          }
        }
      })
      if (listKeys.length > 0) {
        updateListKeys(listKeys)
      }
      setRegisterInfo(res.data)
    } else {
      setRegisterInfo([])
      onNextAction()
    }
  }

  useEffect(() => {
    if (show) {
      getRegisterDetail()
    }
  }, [show])

  return {
    registerInfo,
  }
}

export default useRegisterDetail
