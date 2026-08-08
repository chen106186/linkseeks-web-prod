import { useEffect, useState, useCallback, useRef } from 'react'

const defaultOptions = {
  cancelOnUnmount: true,
}

const useInterval = (fn: () => void, milliseconds: number, options = defaultOptions) => {
  const opts = { ...defaultOptions, ...(options || {}) }
  const timeout = useRef<ReturnType<typeof setInterval>>()
  const callback = useRef(fn)
  const [isCleared, setIsCleared] = useState(false)

  const clear = useCallback(() => {
    if (timeout.current) {
      setIsCleared(true)
      clearInterval(timeout.current)
    }
  }, [])

  useEffect(() => {
    if (typeof fn === 'function') {
      callback.current = fn
    }
  }, [fn])

  useEffect(() => {
    if (typeof milliseconds === 'number') {
      timeout.current = setInterval(() => {
        callback.current()
      }, milliseconds)
    }

    return clear
  }, [milliseconds])

  useEffect(
    () => () => {
      if (opts.cancelOnUnmount) {
        clear()
      }
    },
    [],
  )

  return [isCleared, clear]
}

export default useInterval
