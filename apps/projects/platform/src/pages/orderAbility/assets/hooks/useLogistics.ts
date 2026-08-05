import { useMemo, useState } from 'react'

function useLogistics() {
  const [LogisticsShow, setLogisticsShow] = useState(1)

  const handleLogisticsShow = (value) => {
    setLogisticsShow(value)
  }

  const isSince = useMemo(() => {
    return LogisticsShow == 2
  }, [LogisticsShow])

  const isLogistics = useMemo(() => {
    return LogisticsShow == 1
  }, [LogisticsShow])

  return {
    handleLogisticsShow,
    isSince,
    isLogistics,
  }
}

export default useLogistics
