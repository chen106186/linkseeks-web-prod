/**
 * @Description: 是否审核通过hook
 */
import { useState } from 'react'

const useVerifyAgree = () => {
  const [agree, setAgres] = useState<boolean>(true)

  const toggle = (flag: boolean) => {
    setAgres(flag)
  }

  return {
    agree,
    toggle,
  }
}

export default useVerifyAgree
