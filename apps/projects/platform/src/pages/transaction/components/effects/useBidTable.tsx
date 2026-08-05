import { useEffect, useState } from 'react'

export const useBidTable = () => {
  const [dataSource, setDataSource] = useState<any>([]);
  const [soure, setSoure] = useState<any>({});

  const formContext = {
    dataSource: dataSource,
    soure: soure,
    ctl: {
      setDataSource: setDataSource,
      setSoure: setSoure
    },
  }

  return {
    formContext
  }
}
