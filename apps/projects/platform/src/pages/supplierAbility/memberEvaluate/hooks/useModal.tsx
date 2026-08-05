import React, { useCallback, useState } from 'react'

// type ParamsType = {
//   onVisible?: (() => void)
// }

// const isPromise = (value: any) => {
//   return value && Object.prototype.toString.call(value) === "[object Promise]"
// }

function useModal() {
  const [visible, setVisible] = useState<boolean>(false)
  // const [loading, setLoading] = useState<boolean>(false);

  // useEffect(() => {
  //   if (visible) {
  //     params?.onVisible?.()
  //   }
  // }, [visible])

  // const onCancel = useCallback(() => {
  //   setVisible(() => false)
  // }, [])

  const toggle = useCallback((status: boolean) => {
    setVisible(() => status)
  }, [])

  return { visible, toggle }
}

export default useModal
