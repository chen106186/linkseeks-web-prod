import { useCallback, useRef, useState } from 'react'
import useMemoizedFn from '../useMemoizedFn'
import useMap from '../useMap'

interface ValueStorage {
  value: any
}

interface ValueOptions {}

interface ValueResult<T> {
  value?: T
}

const defaultOptions: ValueOptions = {}

/**
 * 用来
 */
export const useValue = <T extends any>(options: ValueOptions = defaultOptions) => {
  const [maps, { set, get }] = useMap<string, ValueStorage>()
  const [key, setKey] = useState<string>('')
  const getValue = useMemoizedFn((key: string): ValueResult<T> => {
    const _value = get(key)

    if (_value) {
      return {
        value: _value.value,
      }
    } else {
      return {
        value: undefined,
      }
    }
  })

  const setValue = useMemoizedFn((key: string, value: T) => {
    const _value: ValueStorage = {
      value: getValue(key).value ? Object.assign(getValue(key).value as any, value) : value,
    }
    setKey(key)
    set(key, _value)
  })

  return {
    getValue,
    setValue,
    maps,
    key,
  }
}

export default useValue
