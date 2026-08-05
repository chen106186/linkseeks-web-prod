import { useEffect, useState } from 'react'
import { Form } from '@linkseeks/ui'
import {
  getContractSignatureAuthGetSignatureDetail,
  GetContractSignatureAuthGetSignatureDetailResponse,
} from '@apps/apis'

const useApply = () => {
  const [signatureDetail, setSignatureDetail] = useState<GetContractSignatureAuthGetSignatureDetailResponse>()
  const [currentState, setCurrentState] = useState<number>(0) // 申请状态: 0-未申请 1-申请中 2-申请不通过 3-申请通过
  const [spinLoading, setSpinLoading] = useState<boolean>(true)
  const [signatureForm] = Form.useForm()

  const getSignatureDetail = () => {
    setSpinLoading(true)
    getContractSignatureAuthGetSignatureDetail()
      .then((res) => {
        if (res.code === 1000 && res.data) {
          const data = res.data
          setSignatureDetail(data)
          if (data.isPersonal) {
            setCurrentState(data.personal.status as unknown as number)
          } else {
            setCurrentState(data.organization.status as unknown as number)
          }
        } else {
          setCurrentState(0)
        }
        setSpinLoading(false)
      })
      .catch(() => {
        setSpinLoading(false)
      })
  }

  useEffect(() => {
    getSignatureDetail()
  }, [])

  const refresh = () => {
    getSignatureDetail()
  }

  return {
    currentState,
    spinLoading,
    signatureDetail,
    signatureForm,
    setCurrentState,
    refresh,
  }
}

export default useApply
