import { useEffect, useState } from 'react'

export const useBidTable = () => {
  const [dataSource, setDataSource] = useState<any>([])

  const formContext = {
    dataSource: dataSource,
    ctl: {
      setDataSource: setDataSource,
    },
  }

  return {
    formContext,
  }
}
