import { useMemo, useState } from 'react'

function usePageTitle() {
  const [info, setInfo] = useState<any>()
  const title = useMemo(() => {
    return `${info?.digest ?? ''} | ${info?.No ?? ''}`
  }, [info])

  const setDeliveryTitle = (info) => {
    info.No = info?.deliveryNo
    setInfo(info)
  }

  const setReceiveTitle = (info) => {
    info.No = info?.receiveNo
    setInfo(info)
  }

  return {
    title,
    setDeliveryTitle,
    setReceiveTitle,
  }
}

export default usePageTitle
