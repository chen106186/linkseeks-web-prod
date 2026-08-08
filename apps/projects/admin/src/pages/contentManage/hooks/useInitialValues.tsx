import React, { useEffect, useState } from 'react'

const useInitialValues = (params, service) => {
  const [state, setState] = useState(null)
  useEffect(() => {
    if (params.id) {
      service(params).then((data) => {
        if (data?.data?.columnType) {
          data.data.columnType = String(data.data.columnType)
        }
        setState(data)
      })
    }
  }, [params.id])
  return state
}

export { useInitialValues }
