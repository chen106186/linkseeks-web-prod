import { useToggle } from '@linkseeks/hooks'
import { useEffect, useRef } from 'react'

const useFormModalStatus = (statusMap: Record<string, any>) => {
  const modalRef = useRef<any>('')
  const [visible, toggle] = useToggle()

  useEffect(() => {
    if (visible) {
      statusMap[modalRef.current] && statusMap[modalRef.current].call()
    }
  }, [visible, modalRef.current])

  const handleChangeFormStatus = (formStatus) => {
    modalRef.current = formStatus
  }
  return {
    formStatus: modalRef.current,
    handleChangeFormStatus,
    visible,
    toggle,
  }
}

export default useFormModalStatus
