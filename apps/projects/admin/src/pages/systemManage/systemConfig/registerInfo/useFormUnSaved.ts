import { useMemoizedFn } from '@linkseeks/hooks'
import { useState } from 'react'

const useFormUnSaved = () => {
  const [unsaved, setUnsaved] = useState(false)

  const onFormChange = useMemoizedFn((e: any) => {
    if (!unsaved) {
      setUnsaved(true)
    }
  })

  return [unsaved, setUnsaved, onFormChange] as any
}

export default useFormUnSaved
