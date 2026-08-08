import { useState } from 'react'

function useLoginForm<T>(initProps: T) {
  const [form, setForm] = useState<T>(initProps)

  const setKey = (val, key) => {
    const fromData = { ...form }
    fromData[key] = val
    setForm({ ...fromData })
  }

  return {
    form,
    setKey,
  }
}

export default useLoginForm
