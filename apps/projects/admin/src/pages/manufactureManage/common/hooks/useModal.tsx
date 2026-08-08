import { useCallback, useState } from 'react'

function useModal() {
  const [visible, setVisible] = useState<boolean>(false)

  const toggle = useCallback((status: boolean) => {
    setVisible(() => status)
  }, [])

  return { visible, toggle }
}

export default useModal
