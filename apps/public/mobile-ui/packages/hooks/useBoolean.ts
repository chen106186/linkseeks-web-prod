import { useCallback, useState } from "react"

const useBoolean = (defaultValue = false) => {
  const [state, setState] = useState(defaultValue)

  const toggle = useCallback(() => {
    setState(!state)
  }, [state])

  return {
    state,
    setState,
    toggle,
    setTrue: () => {
      setState(true)
    },
    setFalse: () => {
      setState(false)
    },
  }
}

export default useBoolean
