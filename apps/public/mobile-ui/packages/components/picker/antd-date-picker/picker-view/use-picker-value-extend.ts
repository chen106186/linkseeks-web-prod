import { useMemo } from 'react'
import { memoize } from 'lodash'
export function usePickerValueExtend(columns) {
  const generateItems = useMemo(() => {
    return memoize(
      (val) => {
        return val.map((v, index) => {
          var _a

          const column = columns[index]
          if (!column) return null
          return (_a = column.find((item) => item.value === v)) !== null && _a !== void 0 ? _a : null
        })
      },
      (val) => JSON.stringify(val),
    )
  }, [columns])

  function generateValueExtend(val) {
    return {
      get items() {
        return generateItems(val)
      },
    }
  }

  return generateValueExtend
}
