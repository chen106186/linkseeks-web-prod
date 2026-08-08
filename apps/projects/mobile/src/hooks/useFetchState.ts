import { useCallback, useEffect, useRef, useState } from 'react'

function useFetchState<T>(props: any): [T, (params: any) => void] {
  const focus = useRef<boolean>()
  const [state, setState] = useState<T>(props)

  useEffect(() => {
    focus.current = true

    return () => {
      focus.current = false
    }
  }, [])

  const setFetchState = useCallback((params) => {
    focus.current && setState(params)
  }, [])

  return [state, setFetchState]
}

export default useFetchState
